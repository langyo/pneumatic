import * as webpack from 'webpack';

import { join } from 'path';

import { Volume } from 'memfs';
import { Union } from 'unionfs'
import * as realFs from 'fs';

export async function webpackCompiler(
  code: string,
  extraOpts: webpack.Configuration = {},
  extraFiles: { [path: string]: string } = {}
): Promise<{ code: string, sourceMap: string }> {
  const fs = ((new Union()) as any).use(realFs).use(Volume.fromJSON({
    [join(process.cwd(), './__entry.ts')]: code,
    ...extraFiles
  }));
  if (!fs['join']) {
    fs['join'] = join;
  }

  const compiler = webpack({
    entry: join(process.cwd(), './__entry.ts'),
    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    context: process.cwd(),
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      ]
    },
    resolve: {
      modules: [
        join(process.cwd(), './node_modules'),
        'node_modules'
      ]
    },
    resolveLoader: {
      modules: [
        join(process.cwd(), './node_modules'),
        'node_modules'
      ]
    },
    output: {
      filename: 'output.js',
      path: process.cwd()
    },
    devtool: 'source-map',
    ...extraOpts
  });
  compiler.inputFileSystem = fs;
  compiler.outputFileSystem = fs;

  return new Promise((resolve, reject) => {
    compiler.run((err: Error, status) => {
      if (err) {
        reject(err);
      }

      else if (status.hasErrors()) {
        const info = status.toJson();
        let errStr = '';
        if (status.hasErrors()) {
          for (const e of info.errors) {
            errStr += e.message + '\n';
          }
        }
        if (status.hasWarnings()) {
          for (const e of info.warnings) {
            errStr += e.message + '\n';
          }
        }
        reject(Error(errStr));
      }

      else {
        fs.readFile(join(process.cwd(), '/output.js'), { encoding: 'utf8' },
          (err: Error, code: string) => {
            if (err) {
              throw err;
            }
            fs.readFile(join(process.cwd(), '/output.js.map'), { encoding: 'utf8' },
              (err: Error, sourceMap: string) => {
                if (err) {
                  throw err;
                }
                resolve({
                  code, sourceMap
                })
              })
          });
      }
    })
  });
};
