#!/usr/bin/env python3
"""
Script to flatten the skills directory structure.
Moves all JSON files from skills/skills/ to skills/
"""

import shutil
from pathlib import Path

SOURCE_DIR = Path("/Users/blake/myspace/skill-hub/skills/skills")
TARGET_DIR = Path("/Users/blake/myspace/skill-hub/skills")

def main():
    """Move all JSON files from skills/skills/ to skills/"""
    if not SOURCE_DIR.exists():
        print(f"Error: Source directory {SOURCE_DIR} does not exist")
        return
    
    # Get all JSON files
    json_files = list(SOURCE_DIR.glob("*.json"))
    
    if not json_files:
        print("No JSON files found to move")
        return
    
    print(f"Found {len(json_files)} JSON files to move")
    
    moved_count = 0
    skipped_count = 0
    
    for json_file in json_files:
        target_file = TARGET_DIR / json_file.name
        
        # Check if target already exists
        if target_file.exists():
            print(f"  ⚠ Skipping {json_file.name} (already exists in target)")
            skipped_count += 1
            continue
        
        try:
            # Move file
            shutil.move(str(json_file), str(target_file))
            print(f"  ✓ Moved {json_file.name}")
            moved_count += 1
        except Exception as e:
            print(f"  ✗ Error moving {json_file.name}: {e}")
    
    print(f"\n{'='*50}")
    print(f"Move complete!")
    print(f"  Moved: {moved_count}")
    print(f"  Skipped: {skipped_count}")
    print(f"{'='*50}")
    
    # Check if source directory is now empty (except .gitkeep)
    remaining_files = [f for f in SOURCE_DIR.iterdir() if f.name != '.gitkeep']
    if not remaining_files:
        print(f"\nSource directory is now empty (except .gitkeep)")
        print(f"You can manually delete {SOURCE_DIR} if desired")

if __name__ == "__main__":
    main()
