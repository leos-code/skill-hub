#!/usr/bin/env python3
"""
Script to fix repository URLs for newly imported skills.
"""

import json
from pathlib import Path

SKILLS_DIR = Path("/Users/blake/myspace/skill-hub/skills/skills")
CORRECT_PREFIX = "https://github.com/anthropics/skills/tree/main/skills"

# Skills that were newly imported and need fixing
NEW_SKILLS = [
    "algorithmic-art",
    "brand-guidelines",
    "canvas-design",
    "doc-coauthoring",
    "docx",
    "frontend-design",
    "internal-comms",
    "mcp-builder",
    "pdf",
    "pptx",
    "skill-creator",
    "slack-gif-creator",
    "theme-factory",
    "web-artifacts-builder",
    "webapp-testing",
    "xlsx",
]

def fix_repository_url(skill_id: str):
    """Fix repository URL for a skill."""
    skill_file = SKILLS_DIR / f"{skill_id}.json"
    
    if not skill_file.exists():
        print(f"Warning: {skill_file} does not exist")
        return False
    
    try:
        with open(skill_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Update repository URL
        old_url = data.get('repository', '')
        new_url = f"{CORRECT_PREFIX}/{skill_id}"
        data['repository'] = new_url
        
        # Write back
        with open(skill_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Fixed {skill_id}: {old_url} -> {new_url}")
        return True
    except Exception as e:
        print(f"Error processing {skill_id}: {e}")
        return False

def main():
    """Main function."""
    fixed_count = 0
    error_count = 0
    
    for skill_id in NEW_SKILLS:
        if fix_repository_url(skill_id):
            fixed_count += 1
        else:
            error_count += 1
    
    print(f"\n{'='*50}")
    print(f"Complete!")
    print(f"  Fixed: {fixed_count}")
    print(f"  Errors: {error_count}")
    print(f"{'='*50}")

if __name__ == "__main__":
    main()
