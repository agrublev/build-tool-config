module.exports = function flow(options) {
  return {
    ignore: [
      '.*/node_modules/.*',
      '.*/packages/.*/esm/.*',
      '.*/packages/.*/lib/.*',
      '.*/tests/.*',
      '.*\\.test\\.js',
    ],
    include: [
      options.workspaces ? './packages' : './src',
    ],
    lints: {
      all: 'warn',
      sketchy_null_bool: 'off',
      sketchy_null_mixed: 'off',
      sketchy_null_number: 'off',
      sketchy_null_string: 'off',
      unclear_type: 'off',
      untyped_import: 'off',
    },
    options: {
      emoji: true,
      esproposal: {
        class_instance_fields: 'enable',
        class_static_fields: 'enable',
        export_star_as: 'enable',
      },
      include_warnings: true,
      module: {
        ignore_non_literal_requires: true,
      },
      suppress_comment: '\\\\(.\\\\|\\n\\\\)*\\\\$FlowIgnore',
    },
  };
};
