import webpack from 'webpack';
import { VueLoaderPlugin } from 'vue-loader';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { join } from 'path';
import {
  globalWebpackConfig,
  resolveWebpackCompileResult,
  createWebpackVirtualFileSystem,
} from './utils';

export async function generateMainlyScripts() {
  const compiler = webpack({
    entry: {
      web: join(process.cwd(), './src/appClientRender.ts'),
    },
    module: {
      rules: [
        {
          test: /\.json5$/,
          use: ['json5-loader'],
        },
        {
          test: /\.svg$/,
          use: ['svg-inline-loader'],
        },
        {
          test: /\.vue$/,
          use: ['vue-loader'],
        },
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'ts-loader',
              options: { appendTsSuffixTo: [/\.vue$/] },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: {
                url: false,
              },
            },
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        title: 'Pneumatic',
        publicPath: '/'
      }),
    ],
    ...globalWebpackConfig,
    target: 'web',
    output: {
      path: join(process.cwd(), './dist/'),
      filename: `[name].bundle.js`,
    },
  });
  compiler.inputFileSystem = createWebpackVirtualFileSystem({});
  await resolveWebpackCompileResult(compiler);
}
