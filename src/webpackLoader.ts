import * as webpack from 'webpack';

import { join } from 'path';

import { Volume } from 'memfs';
import { Union } from 'unionfs'
import * as realFs from 'fs';

function vfsLoader(
  virtualFiles: { [key: string]: string },
  entryPath: string = process.cwd()
) {
  const vf = Object.keys(virtualFiles).reduce((obj, key) => ({
    ...obj,
    [join(entryPath, key)]: virtualFiles[key]
  }), {});

  const mfs = Volume.fromJSON(vf);
  const fs = ((new Union()) as any).use(realFs).use(mfs);
  if (typeof fs['join'] === 'undefined') {
    fs['join'] = join;
  }

  return fs;
}

export async function webpackCompiler(
  code: string,
  extraOpts: webpack.Configuration = {},
  extraFiles: { [path: string]: string } = {}
): Promise<{ code: string, sourceMap: string }> {
  const fs = vfsLoader({
    './__entry.ts': code,
    ...extraFiles
  });
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
          (err, code) => {
            fs.readFile('/output.js.map', { encoding: 'utf8' },
              (err, sourceMap) => {
                resolve({
                  code, sourceMap
                })
              })
          });
      }
    })
  });
};
