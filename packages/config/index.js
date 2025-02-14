/* eslint-disable no-param-reassign */

const fs = require('fs-extra');
const path = require('path');
const { EXTS, DIR_PATTERN, CJS_FOLDER, ESM_FOLDER } = require('./constants');

const extsWithoutJSON = EXTS.filter(ext => ext !== '.json');

function hasNoPositionalArgs(context, name) {
  const args = context.args._;

  return args.length === 0 || (args.length === 1 && args[0] === name);
}

/**
 * @param { import('@beemo/core').default } tool
 */
module.exports = function milesOSS(tool) {
  const usingTypeScript = tool.isPluginEnabled('driver', 'typescript');
  const workspacePrefixes = tool.getWorkspacePaths({ relative: true });

  // Babel
  tool.onRunDriver.listen(context => {
    context.addOption('--copy-files');

    if (usingTypeScript && !context.args.extensions) {
      context.addOption('--extensions', extsWithoutJSON.join(','));
    }

    if (hasNoPositionalArgs(context, 'babel')) {
      context.addArg('src');
      context.addOption('--out-dir', context.args.esm ? ESM_FOLDER : CJS_FOLDER);
    }
  }, 'babel');

  // ESLint
  tool.onRunDriver.listen(context => {
    context.addOptions(['--color', '--report-unused-disable-directives']);

    if (usingTypeScript && !context.args.ext) {
      context.addOption('--ext', extsWithoutJSON.join(','));
    }

    if (hasNoPositionalArgs(context, 'eslint')) {
      if (workspacePrefixes.length > 0) {
        workspacePrefixes.forEach(wsPrefix => {
          context.addArg(path.join(wsPrefix, DIR_PATTERN));
        });
      } else {
        context.addArgs(['src', 'tests']);
      }
    }
  }, 'eslint');

  // Jest
  tool.onRunDriver.listen((context, driver) => {
    context.addOptions(['--colors', '--logHeapUsage']);

    if (context.argv.includes('--coverage')) {
      context.addOption('--detectOpenHandles');
    }

    driver.options.env.NODE_ENV = 'test';
    driver.options.env.TZ = 'UTC';
  }, 'jest');

  // Prettier
  tool.onRunDriver.listen(context => {
    context.addOption('--write');

    if (hasNoPositionalArgs(context, 'prettier')) {
      const exts = '{ts,tsx,js,jsx,scss,css,gql,yml,yaml}';

      if (workspacePrefixes.length > 0) {
        workspacePrefixes.forEach(wsPrefix => {
          context.addArgs([
            path.join(wsPrefix, DIR_PATTERN, `**/*.${exts}`),
            path.join(wsPrefix, '*.{md,json}'),
          ]);
        });
      } else {
        context.addArgs([path.join(DIR_PATTERN, `**/*.${exts}`), '*.{md,json}']);
      }
    }

    context.addArgs(['docs/**/*.md', 'README.md']);
  }, 'prettier');

  // TypeScript
  if (usingTypeScript && workspacePrefixes.length > 0) {
    tool.getPlugin('driver', 'typescript').onAfterExecute.listen(() => {
      const corePackage = path.join(tool.options.root, 'packages/core');

      if (fs.existsSync(corePackage)) {
        fs.copySync(path.join(tool.options.root, 'README.md'), path.join(corePackage, 'README.md'));
      }
    });
  }
};
