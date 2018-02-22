const path = require('path');

console.log(process.env.NODE_ENV);

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  ...(
                    process.env.NODE_ENV === 'production'
                      ? { browsers: ['last 3 Chrome versions'] }
                      : { node: 'current' }
                  ),
                },
                shippedProposals: true,
                modules: false,
                useBuiltIns: 'usage',
                debug: true,
              }],
            ],
            plugins: [
              ['@babel/plugin-proposal-object-rest-spread', { 'loose': true, 'useBuiltIns': true }]
            ]
          }
        }
      }
    ]
  },
};