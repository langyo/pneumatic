import React, { useState } from 'react';
import { List } from '../../../utils/frontend/components/list';
import { css } from '@emotion/css';
import { Icon } from '@mdi/react';
import {
  mdiTimelineClock
} from '@mdi/js';

export function Drawer({ }) {
  return <List items={[
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
        <Icon path={mdiTimelineClock} size={1} color='#fff' />
      </div>
      {'All'}
    </div>,
    '------',
    'Recent',
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
        <Icon path={mdiTimelineClock} size={1} color='#fff' />
      </div>
      {'All'}
    </div>,
  ]} />;
}
