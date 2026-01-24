#!/usr/bin/env python3
"""
Script to import skills from GitHub repository.
"""

import json
import re
import yaml
import requests
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional

# GitHub repository info
REPO_OWNER = "K-Dense-AI"
REPO_NAME = "claude-scientific-skills"
REPO_BRANCH = "main"
SKILLS_PATH = "scientific-skills"
GITHUB_API_BASE = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}"
GITHUB_RAW_BASE = f"https://raw.githubusercontent.com/{REPO_OWNER}/{REPO_NAME}/{REPO_BRANCH}"

# Target directory
TARGET_DIR = Path("/Users/blake/myspace/skill-hub/skills/skills")

# Category mapping - default to implementation for scientific skills
CATEGORY_MAP = {
    # Process skills
    "citation-management": "process",
    "clinical-decision-support": "process",
    "exploratory-data-analysis": "process",
    "hypothesis-generation": "process",
    "literature-review": "process",
    "peer-review": "process",
    "scientific-brainstorming": "process",
    "scientific-critical-thinking": "process",
    "scientific-writing": "process",
    "statistical-analysis": "process",
    
    # Development tools
    "get-available-resources": "development",
    
    # Implementation (default for most scientific skills)
}

DEFAULT_CATEGORY = "implementation"
DEFAULT_VERSION = "1.0.0"


def get_skill_list() -> list[str]:
    """Get list of all skills from GitHub."""
    url = f"{GITHUB_API_BASE}/contents/{SKILLS_PATH}"
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        contents = response.json()
        skills = [item['name'] for item in contents if item['type'] == 'dir']
        return sorted(skills)
    except Exception as e:
        print(f"Error fetching skill list: {e}")
        return []


def get_skill_md(skill_name: str) -> Optional[str]:
    """Get SKILL.md content for a skill from GitHub."""
    url = f"{GITHUB_RAW_BASE}/{SKILLS_PATH}/{skill_name}/SKILL.md"
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"  Warning: Could not fetch SKILL.md for {skill_name}: {e}")
        return None


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
    
    # Common scientific tag keywords
    tag_keywords = {
        "database": ["database", "data"],
        "analysis": ["analysis", "analytics"],
        "visualization": ["visualization", "plot", "chart"],
        "machine-learning": ["ml", "machine-learning", "ai"],
        "biology": ["biology", "bio", "genomics"],
        "chemistry": ["chemistry", "chem", "molecular"],
        "physics": ["physics", "quantum"],
        "statistics": ["statistics", "stats"],
        "python": ["python", "pandas", "numpy"],
        "integration": ["integration", "api"],
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
    if "database" in desc_lower:
        tags.append("database")
    if "visualization" in desc_lower or "plot" in desc_lower:
        tags.append("visualization")
    
    # Remove duplicates and return
    return list(set(tags))[:10]  # Limit to 10 tags


def convert_skill_to_json(skill_name: str, content: str) -> Optional[Dict[str, Any]]:
    """Convert a skill's SKILL.md content to JSON format."""
    # Extract frontmatter
    frontmatter, body = extract_frontmatter(content)
    
    if not frontmatter:
        print(f"  Warning: No frontmatter found for {skill_name}")
        return None
    
    # Get skill name and description
    name = frontmatter.get("name", skill_name)
    description = frontmatter.get("description", "")
    
    if not description:
        print(f"  Warning: No description found for {skill_name}")
        return None
    
    # Determine category
    category = CATEGORY_MAP.get(skill_name, DEFAULT_CATEGORY)
    
    # Extract tags
    tags = extract_tags(description, skill_name)
    
    # Build JSON object
    skill_json = {
        "id": skill_name,
        "name": name.replace("-", " ").title() if "-" in name else name.title(),
        "description": description,
        "category": category,
        "repository": f"https://github.com/{REPO_OWNER}/{REPO_NAME}/tree/{REPO_BRANCH}/{SKILLS_PATH}/{skill_name}",
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
    """Main function to import all skills from GitHub."""
    print("Fetching skill list from GitHub...")
    skill_list = get_skill_list()
    
    if not skill_list:
        print("No skills found or error fetching skill list")
        return
    
    print(f"Found {len(skill_list)} skills")
    print(f"\nImporting skills...")
    
    # Ensure target directory exists
    TARGET_DIR.mkdir(parents=True, exist_ok=True)
    
    imported_count = 0
    skipped_count = 0
    error_count = 0
    
    for i, skill_name in enumerate(skill_list, 1):
        print(f"\n[{i}/{len(skill_list)}] Processing: {skill_name}")
        
        # Get SKILL.md content
        content = get_skill_md(skill_name)
        
        if not content:
            print(f"  ✗ Skipped (no SKILL.md found)")
            skipped_count += 1
            continue
        
        # Convert to JSON
        skill_json = convert_skill_to_json(skill_name, content)
        
        if skill_json:
            # Write JSON file
            output_file = TARGET_DIR / f"{skill_name}.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(skill_json, f, indent=2, ensure_ascii=False)
            
            print(f"  ✓ Created {output_file.name}")
            imported_count += 1
        else:
            print(f"  ✗ Skipped (conversion failed)")
            error_count += 1
    
    print(f"\n{'='*50}")
    print(f"Import complete!")
    print(f"  Imported: {imported_count}")
    print(f"  Skipped: {skipped_count}")
    print(f"  Errors: {error_count}")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
