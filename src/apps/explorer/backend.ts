import { readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

const fileTypesRaw = {
  process: [
    'exe', 'com'
  ],
  shell: [
    'sh', 'bat'
  ],
  image: [
    'iso', 'mds', 'ccd', 'cue', 'bwt', 'cdi', 'nrg', 'pdi', 'b5t', 'isz'
  ],
  picture: [
    'webp', 'bmp', 'avif', 'gif', 'jpg', 'jpeg', 'svg',
    'psd', 'cdr', 'png', 'ai', 'hdri', 'ico'
  ],
  audio: [
    'cda', 'wav', 'mp3', 'midi?', 'wma', 'ogg', 'amr', 'ape', 'flac', 'aac'
  ],
  video: [
    'mp4', 'asf', 'mov', 'avi', 'wmv', '3gp', 'flv', 'f4v'
  ],
  document: [
    'txt', 'doc', 'docx', 'md', 'odf'
  ],
  excel: [
    'xls', 'xlsx'
  ],
  powerpoint: [
    'ppt', 'pptx'
  ],
  webpage: [
    'htm', 'html', 'asp', 'aspx', 'php'
  ],
  package: [
    'rar', 'zip', 'gz', '7z', 'tar', 'cab', 'jar'
  ],
  code: [
    'c', 'cpp', 'cs', 'h', 'hpp', 'css', 'less', 'scss',
    'coffee', 'js', 'jsx', 'ejs', 'ts', 'tsx', 'go',
    'hlsl', 'java', 'lua', 'py', 'ruby', 'rust', 'r',
    'perl', 'vb', 'sql', 'swift', 'mm'
  ],
  configure: [
    'json', 'xml', 'xsl', 'yaml', 'gson'
  ]
};
const fileTypes = Object.keys(fileTypesRaw).reduce((obj, key) => ({
  ...obj,
  ...fileTypesRaw[key].reduce((obj: { [key: string]: string }, type: string) => ({
    ...obj,
    [type]: key
  }), {})
}), {});

export async function socketAutoRun(_token: string, { path }, { send }) {
  send({
    baseName: basename(path),
    files: readdirSync(path).reduce((obj, name) => ({
      ...obj,
      [name]: {
        media:
          statSync(join(path, name)).isDirectory() ? 'folder' :
            (fileTypes[name.substr(basename(name).lastIndexOf('.') + 1)] || 'file')
      }
    }), {})
  });
}
