source 'https://rubygems.org'
ruby '2.3.1'

gem 'activerecord'
gem 'activesupport', require: 'active_support/all'
gem 'dotenv', require: false
gem 'dropbox-sdk', require: 'dropbox_sdk'
gem 'escape_utils'
gem 'foreman', require: false
gem 'hamlit'
gem 'hashie'
gem 'ltsv'
gem 'mechanize'
gem 'pg'
gem 'pry', require: false
gem 'rack'
gem 'rack-contrib', require: 'rack/contrib'
gem 'rack-timeout'
gem 'rake', require: false
gem 'ridgepole'
gem 'server-starter'
gem 'sinatra', require: 'sinatra/base'
gem 'slack-notifier'
gem 'twitter'
gem 'unicorn'
gem 'unicorn-worker-killer', require: false
gem 'varnish-client', github: 'mono0x/varnish-client'

group :development do
  gem 'guard'
  gem 'guard-rake'
  gem 'sinatra-contrib', require: 'sinatra/reloader'
end

group :test do
  gem 'database_cleaner'
  gem 'factory_girl', '~> 4.0'
  gem 'rack-test', require: 'rack/test'
  gem 'rr', require: false
  gem 'simplecov', require: false
  gem 'test-unit', '~> 3.0', require: false
  gem 'test-unit-rr', require: false
  gem 'timecop'
  gem 'vcr'
  gem 'webmock'
end
