// Test script to verify data loading
const fs = require('fs');
const path = require('path');

// Simulate the getSkills function
const skillsDir = path.join(process.cwd(), 'skills');
const skillsFileDir = skillsDir;

function getSkills() {
  try {
    const files = fs.readdirSync(skillsFileDir);
    const skills = [];

    for (const file of files) {
      // Skip config files
      if (file === 'index.json' || file === 'categories.json') {
        continue;
      }
      
      if (file.endsWith('.json')) {
        try {
          const fullPath = path.join(skillsFileDir, file);
          const content = fs.readFileSync(fullPath, 'utf8');
          const data = JSON.parse(content);
          skills.push(data);
        } catch (error) {
          console.warn(`Failed to load skill from ${file}:`, error.message);
        }
      }
    }

    return skills.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error loading skills:', error);
    return [];
  }
}

const skills = getSkills();
console.log(`\n✅ Successfully loaded ${skills.length} skills\n`);

// Show breakdown by category
const byCategory = {};
skills.forEach(skill => {
  byCategory[skill.category] = (byCategory[skill.category] || 0) + 1;
});

console.log('Skills by category:');
Object.entries(byCategory).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});

console.log(`\nFeatured skills: ${skills.filter(s => s.featured).length}`);
console.log(`Recent skills (last 6):`);
skills.slice(-6).reverse().forEach(s => {
  console.log(`  - ${s.name} (${s.addedDate})`);
});
