import webpack from 'webpack';
import { Volume, IFs, DirectoryJSON } from 'memfs';
import { Union } from 'unionfs';
import * as realFs from 'fs';
import WebpackTerserPlugin from 'terser-webpack-plugin';
import { join } from 'path';

export const isDevelopmentMode = process.argv.indexOf('--dev') >= 0;
console.log(
  `You are in the ${isDevelopmentMode ? 'development' : 'production'} mode.`
);

export async function resolveWebpackCompileResult(
  runnableWebpackObject: webpack.Compiler
) {
  return await new Promise(
    (resolve: (sth: any) => void, reject: (sth: any) => void) =>
      runnableWebpackObject.run((err: Error, stats: webpack.Stats) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        const info = stats.toJson();
        if (stats.hasErrors()) {
          for (let line of info.errors) {
            console.error(line.message);
            reject(err);
          }
        }
        if (stats.hasWarnings()) {
          for (let line of info.warnings) {
            console.warn(line.message);
          }
        }
        resolve(stats);
      })
  );
}

export const globalWebpackConfig: webpack.Configuration = {
  resolve: {
    alias: {
      '@': join(process.cwd(), './src'),
      '@res': join(process.cwd(), './res')
    },
    extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx'],
    modules: [join(process.cwd(), './node_modules'), 'node_modules']
  },
  resolveLoader: {
    modules: [join(process.cwd(), './node_modules'), 'node_modules']
  },
  ...(isDevelopmentMode
    ? {
        mode: 'development',
        devtool: 'inline-source-map',
        cache: {
          type: 'filesystem'
        }
      }
    : {
        mode: 'production',
        optimization: {
          minimize: true,
          minimizer: [
            new WebpackTerserPlugin({
              extractComments: false
            })
          ]
        }
      })
};

export function createWebpackVirtualFileSystem(
  virtualFileSystem: DirectoryJSON
) {
  const webpackVirtualFs: IFs = (new Union() as any)
    .use(Volume.fromJSON(virtualFileSystem))
    .use(realFs);
  webpackVirtualFs['join'] = join;
  return webpackVirtualFs;
}
