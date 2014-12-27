require 'bundler'
Bundler.require
require 'sprockets/sass/functions' # Avoid "tilt" lib warnings.

$:.push File.expand_path('lib', __dir__)

require 'purolandgreeting'

case ENV['RACK_ENV']
when 'production'
  require 'gctools/oob'
  require 'unicorn/worker_killer'
  use GC::OOB::UnicornMiddleware
  use Unicorn::WorkerKiller::MaxRequests
  use Unicorn::WorkerKiller::Oom, 64 * (1024 ** 2), 96 * (1024 ** 2)
end

use Rack::Timeout
Rack::Timeout.timeout = 20

map '/assets' do
  run PurolandGreeting::Application.sprockets
end

map '/' do
  run PurolandGreeting::Application
end
