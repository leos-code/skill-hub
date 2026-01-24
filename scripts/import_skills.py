#!/usr/bin/env python3
"""
Script to import skills from /Users/blake/myspace/skills/skills/ 
and convert them to JSON format for skill-hub project.
"""

import os
import re
import json
import yaml
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional

# Source and target directories
SOURCE_DIR = Path("/Users/blake/myspace/skills/skills")
TARGET_DIR = Path("/Users/blake/myspace/skill-hub/skills/skills")

# Category mapping based on skill type
CATEGORY_MAP = {
    "algorithmic-art": "implementation",
    "brand-guidelines": "implementation",
    "canvas-design": "implementation",
    "doc-coauthoring": "process",
    "docx": "implementation",
    "frontend-design": "implementation",
    "internal-comms": "process",
    "mcp-builder": "development",
    "pdf": "implementation",
    "pptx": "implementation",
    "skill-creator": "development",
    "slack-gif-creator": "implementation",
    "theme-factory": "implementation",
    "web-artifacts-builder": "development",
    "webapp-testing": "development",
    "xlsx": "implementation",
}

# Default values
DEFAULT_REPOSITORY_PREFIX = "https://github.com/anthropics/skills/tree/main/skills"
DEFAULT_VERSION = "1.0.0"


def extract_frontmatter(content: str) -> tuple[Optional[Dict[str, Any]], str]:
    """Extract YAML frontmatter from markdown content."""
    frontmatter_pattern = r'^---\s*\n(.*?)\n---\s*\n(.*)$'
    match = re.match(frontmatter_pattern, content, re.DOTALL)
    
    if not match:
        return None, content
    
    frontmatter_text = match.group(1)
    body = match.group(2)
    
    try:
        frontmatter = yaml.safe_load(frontmatter_text)
        return frontmatter or {}, body
    except yaml.YAMLError:
        return None, content


def extract_tags(description: str, skill_name: str) -> list[str]:
    """Extract tags from description and skill name."""
    tags = []
    
    # Common tag keywords
    tag_keywords = {
        "pdf": ["pdf", "document"],
        "docx": ["docx", "word", "document"],
        "pptx": ["pptx", "powerpoint", "presentation"],
        "xlsx": ["xlsx", "excel", "spreadsheet"],
        "frontend": ["frontend", "web", "ui", "react"],
        "design": ["design", "visual", "art"],
        "testing": ["testing", "test", "qa"],
        "mcp": ["mcp", "protocol", "server"],
        "gif": ["gif", "animation", "slack"],
        "theme": ["theme", "styling", "design"],
        "canvas": ["canvas", "art", "visual"],
        "algorithmic": ["algorithmic", "generative", "art"],
        "brand": ["brand", "guidelines", "styling"],
        "coauthoring": ["documentation", "writing", "collaboration"],
        "comms": ["communication", "internal"],
        "skill-creator": ["skill", "development", "meta"],
        "webapp": ["webapp", "web", "application"],
        "artifacts": ["artifacts", "html", "react"],
    }
    
    # Add tags based on skill name
    skill_lower = skill_name.lower()
    for keyword, tag_list in tag_keywords.items():
        if keyword in skill_lower:
            tags.extend(tag_list)
    
    # Extract from description
    desc_lower = description.lower()
    if "workflow" in desc_lower or "process" in desc_lower:
        tags.append("workflow")
    if "template" in desc_lower:
        tags.append("template")
    if "api" in desc_lower:
        tags.append("api")
    
    # Remove duplicates and return
    return list(set(tags))[:10]  # Limit to 10 tags


def convert_skill_to_json(skill_dir: Path) -> Optional[Dict[str, Any]]:
    """Convert a skill directory to JSON format."""
    skill_md = skill_dir / "SKILL.md"
    
    if not skill_md.exists():
        print(f"Warning: SKILL.md not found in {skill_dir}")
        return None
    
    # Read SKILL.md
    try:
        content = skill_md.read_text(encoding='utf-8')
    except Exception as e:
        print(f"Error reading {skill_md}: {e}")
        return None
    
    # Extract frontmatter
    frontmatter, body = extract_frontmatter(content)
    
    if not frontmatter:
        print(f"Warning: No frontmatter found in {skill_md}")
        return None
    
    # Get skill name from directory or frontmatter
    skill_id = skill_dir.name
    name = frontmatter.get("name", skill_id)
    description = frontmatter.get("description", "")
    
    if not description:
        print(f"Warning: No description found for {skill_id}")
        return None
    
    # Determine category
    category = CATEGORY_MAP.get(skill_id, "implementation")
    
    # Extract tags
    tags = extract_tags(description, skill_id)
    
    # Build JSON object
    skill_json = {
        "id": skill_id,
        "name": name.replace("-", " ").title(),
        "description": description,
        "category": category,
        "repository": f"{DEFAULT_REPOSITORY_PREFIX}/{skill_id}",
        "version": DEFAULT_VERSION,
        "tags": tags,
        "addedDate": datetime.now().strftime("%Y-%m-%d"),
        "featured": False,
    }
    
    # Add optional fields if they exist in frontmatter
    if "usageExample" in frontmatter:
        skill_json["usageExample"] = frontmatter["usageExample"]
    
    return skill_json


def main():
    """Main function to import all skills."""
    if not SOURCE_DIR.exists():
        print(f"Error: Source directory {SOURCE_DIR} does not exist")
        return
    
    # Ensure target directory exists
    TARGET_DIR.mkdir(parents=True, exist_ok=True)
    
    # Get all skill directories
    skill_dirs = [d for d in SOURCE_DIR.iterdir() if d.is_dir() and not d.name.startswith('.')]
    
    print(f"Found {len(skill_dirs)} skill directories")
    
    imported_count = 0
    skipped_count = 0
    
    for skill_dir in sorted(skill_dirs):
        skill_id = skill_dir.name
        print(f"\nProcessing: {skill_id}")
        
        skill_json = convert_skill_to_json(skill_dir)
        
        if skill_json:
            # Write JSON file
            output_file = TARGET_DIR / f"{skill_id}.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(skill_json, f, indent=2, ensure_ascii=False)
            
            print(f"  ✓ Created {output_file.name}")
            imported_count += 1
        else:
            print(f"  ✗ Skipped {skill_id}")
            skipped_count += 1
    
    print(f"\n{'='*50}")
    print(f"Import complete!")
    print(f"  Imported: {imported_count}")
    print(f"  Skipped: {skipped_count}")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
