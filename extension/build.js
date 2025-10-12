const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building zKMem Extension...');

// Clean dist directory
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}

// Run webpack build
console.log('Running webpack build...');
execSync('npx webpack --mode production', { stdio: 'inherit' });

// Copy manifest.json to dist
console.log('Copying manifest.json...');
fs.copyFileSync('manifest.json', 'dist/manifest.json');

// Create icons directory and copy placeholder icons
console.log('Creating icons...');
const iconsDir = path.join('dist', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create simple SVG icons (you can replace these with actual icons later)
const createIcon = (size) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#000000"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#FFD700" font-family="Arial" font-size="${size * 0.6}">Z</text>
  </svg>`;
};

// Generate icons
[16, 32, 48, 128].forEach(size => {
  const iconPath = path.join(iconsDir, `icon${size}.png`);
  // For now, create a simple text file - you should replace this with actual PNG icons
  fs.writeFileSync(iconPath.replace('.png', '.svg'), createIcon(size));
});

console.log('Build completed successfully!');
console.log('Extension files are in the dist/ directory');
console.log('Load the extension in Chrome by going to chrome://extensions/ and enabling Developer mode');
console.log('Then click "Load unpacked" and select the dist/ directory');
