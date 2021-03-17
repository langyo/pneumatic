import React, { useState } from 'react';
import { List } from '../../../utils/frontend/components/list';
import { css } from '@emotion/css';
import { Icon } from '@mdi/react';
import {
  mdiServerNetwork, mdiFolderOutline
} from '@mdi/js';

export function Drawer({ }) {
  return <List items={[
    'Device',
    <div className={css`
      display: flex;
      flex-direction: row;
      align-items: center;
    `}>
      <Icon path={mdiServerNetwork} size={1} color='#fff' />
      <div className={css`
        line-height: 24px;
        height: 24px;
        margin-left: 8px;
      `}>
        {'All'}
      </div>
    </div>,
    '------',
    'Fast forward',
    <div className={css`
      display: flex;
      flex-direction: row;
      align-items: center;
    `}>
      <Icon path={mdiFolderOutline} size={1} color='#fff' />
      <div className={css`
        line-height: 24px;
        height: 24px;
        margin-left: 8px;
      `}>
        {'nickelcat'}
      </div>
    </div>,
    <div className={css`
      display: flex;
      flex-direction: row;
      align-items: center;
    `}>
      <Icon path={mdiFolderOutline} size={1} color='#fff' />
      <div className={css`
        line-height: 24px;
        height: 24px;
        margin-left: 8px;
      `}>
        {'pneumatic'}
      </div>
    </div>
  ]} />;
}