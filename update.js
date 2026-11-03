const fs = require('fs');
const p = JSON.parse(fs.readFileSync('package.json', 'utf8'));
p.scripts = {
  'lint:html': 'htmlhint "**/*.html"',
  'lint:css': 'stylelint "**/*.css"',
  'lint:js': 'eslint .',
  'lint': 'npm run lint:html && npm run lint:css && npm run lint:js'
};
fs.writeFileSync('package.json', JSON.stringify(p, null, 2));
