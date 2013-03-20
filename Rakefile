#!/usr/bin/env rake

desc 'docs'
task :docs do
  begin
    require 'fileutils'
    require 'maruku'
    md = ""
    File.open("README.md", "r") do |infile|
      while (line = infile.gets)
        md += line
      end
    end
    doc = Maruku.new(md)
    File.open("/Users/hank/java/dailycred/app/views/tags/docs/passport.html", 'w') {|f| f.write doc.to_html}
    p "Copied Readme"
  rescue LoadError
  end
end

task :default => :docs