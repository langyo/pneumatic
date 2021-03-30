import React, { useState } from 'react';
import { List } from '../../../utils/frontend/components/list';
import { css } from '@emotion/css';
import { Icon } from '@mdi/react';
import {
  mdiAccountCircleOutline, mdiSecurity
} from '@mdi/js';

export function Drawer({ }) {
  return <List items={[
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
        <Icon path={mdiAccountCircleOutline} size={1} color='#fff' />
      </div>
      {'Account'}
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
        <Icon path={mdiSecurity} size={1} color='#fff' />
      </div>
      {'Security'}
    </div>
  ]} />;
}
