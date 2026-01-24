#!/usr/bin/env python3
"""
Script to remove author field from all skill JSON files.
"""

import json
import os
from pathlib import Path

SKILLS_DIR = Path("/Users/blake/myspace/skill-hub/skills/skills")

def remove_author_from_skill(file_path: Path):
    """Remove author field from a skill JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Remove author field if it exists
        if 'author' in data:
            del data['author']
            
            # Write back
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main function."""
    skill_files = list(SKILLS_DIR.glob("*.json"))
    
    removed_count = 0
    skipped_count = 0
    
    for skill_file in sorted(skill_files):
        if remove_author_from_skill(skill_file):
            print(f"✓ Removed author from {skill_file.name}")
            removed_count += 1
        else:
            print(f"- No author field in {skill_file.name}")
            skipped_count += 1
    
    print(f"\n{'='*50}")
    print(f"Complete!")
    print(f"  Removed author: {removed_count}")
    print(f"  Skipped: {skipped_count}")
    print(f"{'='*50}")

if __name__ == "__main__":
    main()
