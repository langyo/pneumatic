import React, { useState } from 'react';
import { List } from '../../../utils/frontend/components/list';
import { css } from '@emotion/css';
import { Icon } from '@mdi/react';
import {
  mdiPaletteOutline, mdiImage
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
        <Icon path={mdiPaletteOutline} size={1} color='#fff' />
      </div>
      {'Palette'}
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
        <Icon path={mdiImage} size={1} color='#fff' />
      </div>
      {'Background'}
    </div>,
  ]} />;
}
