import { series, watch } from 'gulp';

import { clean } from './tasks/clean';
import {
  generateMainlyScripts
} from './tasks/generateScripts';
export { clean };

export const build = series(
  clean,
  generateMainlyScripts
);

export const publish = series(clean, build);

export const dev = () => watch('src/**/*', series(generateMainlyScripts));
