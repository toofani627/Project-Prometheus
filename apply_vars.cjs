const fs = require('fs');
const path = require('path');

const directory = './src';

const replacements = [
  { regex: /#F4E7D5/gi, target: 'var(--color-neo-cream)' },
  { regex: /#FEF9F2/gi, target: 'var(--color-neo-warm-white)' },
  { regex: /#101010/gi, target: 'var(--color-neo-black)' },
  { regex: /#010101/gi, target: 'var(--color-neo-dark)' },
  { regex: /#111111/gi, target: 'var(--color-neo-surface)' },
  { regex: /#1a1a1a/gi, target: 'var(--color-neo-surface-2)' },
  { regex: /#0d0d0d/gi, target: 'var(--color-table-1)' },
  { regex: /#0a0a0a/gi, target: 'var(--color-table-2)' },
  { regex: /#157A26/gi, target: 'var(--color-neo-green-dark)' },
  { regex: /#E0F5DC/gi, target: 'var(--color-neo-green-light)' },
  { regex: /rgba\(244,\s*231,\s*213/gi, target: 'rgba(var(--color-neo-cream-rgb)' },
  { regex: /rgba\(16,\s*16,\s*16/gi, target: 'rgba(var(--color-neo-black-rgb)' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  replacements.forEach(swap => {
    content = content.replace(swap.regex, swap.target);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated with variables:', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(directory);
console.log('Variables applied!');
