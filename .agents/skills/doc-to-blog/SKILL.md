---
name: doc-to-blog
description: Converts technical documentation (e.g., README.md, study notes) into a formatted blog post with metadata and renames the file to use the .pub.md extension. Use this when the user wants to publish or share existing notes as a blog article.
---

# doc-to-blog

This skill automates the conversion of technical documentation into a blog-ready format.

## Workflow

1.  **Analyze**: Read the input file and identify key topics, titles, and structural elements.
2.  **Generate Metadata**: Create a YAML frontmatter block with the following fields:
    - `title`: Extracted from the content or summarized.
    - `date`: Today's date (YYYY-MM-DD).
    - `category`: Relevant technical domain (e.g., Frontend, Backend, AI).
    - `tags`: List of 3-5 keywords.
    - `summary`: A concise one-sentence description.
3.  **Format Content**:
    - Preserve all original technical content and code examples.
    - Organize with clear headings (H1, H2, H3).
    - Ensure a professional and engaging tone.
4.  **Rename & Save**:
    - Rename the file to a descriptive, hyphen-cased name ending in `.pub.md` (e.g., `03-component-basics.pub.md`).
    - Save under `blog/content/`, preserving the category folder structure (e.g., `blog/content/frontend/react/...`).

## Guidelines

- **Preservation**: Never omit technical details, even if the conversion focuses on "blogging."
- **Consistency**: Follow the project's existing blog post patterns (if any).
- **Naming**: Ensure file names are URL-friendly (lowercase, no spaces).
