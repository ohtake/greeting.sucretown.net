require 'bundler'
Bundler.require
require 'sinatra/activerecord/rake'

$:.push File.expand_path('lib', __dir__)

require 'purolandgreeting'

namespace :crawler do
  task :register do
    PurolandGreeting::Crawler.register
  end

  task :update do
    PurolandGreeting::Crawler.update
  end
end

namespace :db do
  task :import do
    PurolandGreeting::Database.import STDIN
  end

  task :export do
    STDOUT.puts PurolandGreeting::Database.export
  end

  task :normalize do
    PurolandGreeting::Database.normalize
  end

  task :backup do
    system 'pg_dump --inserts -x -h localhost -U puro puroland-greeting | xz > /tmp/puroland-greeting.sql.xz'
    system 'dropbox-api put /tmp/puroland-greeting.sql.xz dropbox:/work/greeting.sucretown.net/data/database.sql.xz'
  end
end
