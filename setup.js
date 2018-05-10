const fs = require('fs');
const path = require('path');

let index = path.resolve('./node_modules/babel-preset-react-app/index.js');
let index_text = fs.readFileSync(index, 'utf8');

if (!index_text.includes('babel-plugin-relay')) {
  if (index_text.includes('const plugins = [')) {
    index_text = index_text.replace(
      'const plugins = [',
      "const plugins = [\n  require.resolve('babel-plugin-relay'),"
    );
    fs.writeFileSync(index, index_text, 'utf8');
  }
  else {
    throw new Error(`Failed to inject babel-plugin-relay in ${file}.`);
  }
}

let start = path.resolve('./node_modules/react-scripts/scripts/start.js');
let start_orig = path.resolve('./node_modules/react-scripts/scripts/start-orig.js');
let start_text = fs.readFileSync(start, 'utf8');
fs.writeFileSync(start_orig, start_text, 'utf8');

let new_start = path.resolve('./scripts/start.js');
let new_start_text = fs.readFileSync(new_start, 'utf8');
fs.writeFileSync(start, new_start_text, 'utf8');

const spawn = require('react-dev-utils/crossSpawn');
let result = spawn.sync(
  'babel',
  ['./src/server/todolistSchema.js', '--out-file',
    './node_modules/react-scripts/scripts/todolistSchema.js'],
  { stdio: 'inherit' }
);

result = spawn.sync(
  'babel',
  ['./src/server/todolistData.js', '--out-file',
    './node_modules/react-scripts/scripts/todolistData.js'],
  { stdio: 'inherit' }
);
