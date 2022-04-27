import webpack from 'webpack';
import { VueLoaderPlugin } from 'vue-loader';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
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
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false,
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
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
      new MiniCssExtractPlugin({ filename: '[name].bundle.css' }),
      new HtmlWebpackPlugin({
        title: 'Pneumatic'
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

export async function generateServiceWorkerScripts() {
  const compiler = webpack({
    entry: join(process.cwd(), './src/serviceWorker.ts'),
    module: {
      rules: [
        {
          test: /\.json5$/,
          use: ['json5-loader'],
        },
        {
          test: /\.ts$/,
          use: ['ts-loader'],
        },
      ],
    },
    ...globalWebpackConfig,
    target: 'webworker',
    output: {
      path: join(process.cwd(), './dist/'),
      filename: `sw.js`,
    },
  });
  await resolveWebpackCompileResult(compiler);
}
