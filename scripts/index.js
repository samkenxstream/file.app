if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const path = require('path');
const dirPath = path.join(__dirname);

require('@babel/register')({
  presets: [[require.resolve('@babel/preset-env')], [require.resolve('next/babel')]],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        alias: {
          '~': dirPath,
        },
      },
    ],
  ],
  ignore: ['node_modules', '.next'],
});

module.exports = require('./' + process.argv[2] + '.js');
