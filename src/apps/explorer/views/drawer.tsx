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
      height: 32px;
      line-height: 32px;
      display: flex;
      flex-direction: row;
      align-items: center;
    `}>
      <div className={css`
        margin: 0px 12px;
      `}>
        <Icon path={mdiServerNetwork} size={1} color='#fff' />
      </div>
      {'All'}
    </div>,
    '------',
    'Fast forward',
    <div className={css`
      height: 32px;
      line-height: 32px;
      display: flex;
      flex-direction: row;
      align-items: center;
    `}>
      <div className={css`
        margin: 0px 12px;
      `}>
        <Icon path={mdiFolderOutline} size={1} color='#fff' />
      </div>
      {'nickelcat'}
    </div>,
    <div className={css`
      height: 32px;
      line-height: 32px;
      display: flex;
      flex-direction: row;
      align-items: center;
    `}>
      <div className={css`
        margin: 0px 12px;
      `}>
        <Icon path={mdiFolderOutline} size={1} color='#fff' />
      </div>
      {'pneumatic'}
    </div>
  ]} />;
}