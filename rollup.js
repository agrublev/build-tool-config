/* eslint-disable no-param-reassign, comma-dangle, no-magic-numbers, dot-notation */

import fs from 'fs';
import path from 'path';
import JSON5 from 'json5';
import babel from 'rollup-plugin-babel';
import common from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import yargs from 'yargs-parser';

const options = yargs(process.argv.slice(2));
const extensions = ['.js', '.jsx', '.json'];

// Extract the format from the command line
const format = options.f || options.format || 'cjs';

// Modify Babel config a bit
const babelConfig = JSON5.parse(fs.readFileSync(
  path.join(__dirname, `babel${(format === 'cjs') ? '.node' : ''}.json5`)
));

babelConfig.presets.forEach((preset) => {
  if (Array.isArray(preset) && preset[0] === 'env') {
    preset[1].modules = false;
  }
});

// Determine constants to replace
const replacements = {
  __DEV__: "process.env.NODE_ENV !== 'production'",
};

if (process.env.NODE_ENV === 'production') {
  replacements['__DEV__'] = true;
  replacements['process.env.NODE_ENV'] = JSON.stringify('production');
}

export default {
  format,
  entry: './src/index.js',
  dest: './lib/bundle.js',
  sourceMap: (format === 'iife'),
  // Order is important!
  plugins: [
    replace(replacements),
    resolve({
      extensions,
      jsnext: true,
    }),
    common({
      extensions,
    }),
    json(),
    babel(Object.assign(babelConfig, {
      exclude: 'node_modules/**',
      runtimeHelpers: (babelConfig.plugins.indexOf('transform-runtime') >= 0),
    })),
    uglify(),
  ],
};
