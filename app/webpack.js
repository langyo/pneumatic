import webpack from 'webpack';

webpack({
  entry: './clientIndex.js',

  output: {
    path: resolve('/dist/'),
    filename: 'bundle.js'
  },

  watch: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: '/node_modules/'
      }
    ]
  }
}, (err, status) => {
  if(err || status.hasErrors()) throw new Error(err || status.hasErrors());

  const now = (new Date()).toLocaleTimeString();
  console.log(`${chalk.yellow(now)} ${chalk.blue('INFO')} Webpack has been compiled the static file.`);
});
