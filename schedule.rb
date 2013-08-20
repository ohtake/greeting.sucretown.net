require 'bundler'
Bundler.require :schedule

def execute_command(command)
  result = `#{command} 2>&1`
  return if result.empty?
  STDERR.puts result
  gmail = Gmail.new(ENV['GMAIL_ADDRESS'], ENV['GMAIL_PASSWORD'])
  gmail.deliver do
    to      ENV['GMAIL_ADDRESS']
    subject "Schedule #{command}"
    body    result
  end
end

scheduler = Rufus::Scheduler.start_new

scheduler.cron '0 0-7,10-23 * * *' do
  execute_command 'bundle exec rake crawler:update'
end

scheduler.cron '*/5 8-9 * * *' do
  execute_command 'bundle exec rake crawler:register'
end

scheduler.cron '15 4 * * *' do
  execute_command 'bundle exec rake db:backup'
end

scheduler.join
