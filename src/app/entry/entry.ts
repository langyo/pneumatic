import { series } from 'nickelcat';
import { routeHttp, renderReactComponent } from 'nickelcat-action-routes';

export const entry = routeHttp(
  { path: '/pneumatic/entry' },
  series(
    renderReactComponent(
    )
  )
);

