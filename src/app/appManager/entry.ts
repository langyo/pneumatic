import { series } from 'nickelcat';
import { routeWebSocket, renderReactComponent } from 'nickelcat-action-routes';

export const entry = routeWebSocket(
  { path: '/pneumatic/app/appManager' },
  series(
    renderReactComponent(
    )
  )
);
