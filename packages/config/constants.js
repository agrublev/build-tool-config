exports.EXTS = ['.ts', '.tsx', '.js', '.jsx', '.json'];

exports.EXT_PATTERN = '{ts,tsx,js,jsx}';

exports.DIR_PATTERN = '{bin,src,tests}';

exports.MIN_IE_VERSION = 11;

exports.MIN_NODE_VERSION = '10.9.0';

exports.CJS_FOLDER = 'lib';

exports.ESM_FOLDER = 'esm';

exports.IGNORE_PATHS = ['node_modules/', `${exports.CJS_FOLDER}/`, `${exports.ESM_FOLDER}/`];
