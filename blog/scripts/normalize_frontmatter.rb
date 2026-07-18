#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"

CONTENT_ROOT = File.expand_path("../content", __dir__)
CATEGORIES = {
  "ai" => "AI",
  "algorithms" => "Algorithms",
  "backend" => "Backend",
  "blockchain" => "Blockchain",
  "design-architecture" => "Design & Architecture",
  "frontend" => "Frontend",
  "language" => "Language",
  "mobile" => "Mobile",
  "security" => "Security"
}.freeze

def yaml_string(value)
  %Q("#{value.to_s.gsub("\\", "\\\\").gsub('"', '\\"')}")
end

Dir.glob(File.join(CONTENT_ROOT, "**", "*.pub.md")).sort.each do |path|
  content = File.read(path)
  relative = path.delete_prefix("#{CONTENT_ROOT}/")
  category = CATEGORIES.fetch(relative.split("/", 2).first)

  unless content.start_with?("---\n")
    heading = content[/^#\s+(.+)$/, 1] || File.basename(path, ".pub.md").tr("-", " ").split.map(&:capitalize).join(" ")
    frontmatter = [
      "---",
      "title: #{yaml_string(heading)}",
      "date: #{Date.today}",
      "category: #{yaml_string(category)}",
      "tags:",
      "  - #{category}",
      "  - Documentation",
      "  - Technical Notes",
      "summary: #{yaml_string("#{heading}의 핵심 개념과 설계 원칙을 정리합니다.")}",
      "---",
      ""
    ].join("\n")
    File.write(path, frontmatter + content)
    next
  end

  closing = content.index("\n---\n", 4)
  raise "Unclosed frontmatter: #{relative}" unless closing

  frontmatter = content[4...closing]
  body = content[(closing + 5)..]
  title = frontmatter[/^title:\s*["']?(.*?)["']?\s*$/, 1]&.strip || File.basename(path, ".pub.md").tr("-", " ")
  description = frontmatter[/^description:\s*(.+)$/, 1]&.strip

  lines = frontmatter.lines(chomp: true)
  unless lines.any? { |line| line.start_with?("category:") }
    date_index = lines.index { |line| line.start_with?("date:") } || 0
    lines.insert(date_index + 1, "category: #{yaml_string(category)}")
  end
  unless lines.any? { |line| line.start_with?("summary:") }
    summary = description || yaml_string("#{title}에 관한 기술 내용과 핵심 개념을 정리합니다.")
    lines << "summary: #{summary}"
  end

  File.write(path, "---\n#{lines.join("\n")}\n---\n#{body}")
end
