import React, { useState } from 'react';
import { css } from '@emotion/css';
import {
  mdiApplication
} from '@mdi/js';

import { ToolbarItem } from '../../../utils/frontend/components/toolbarItem';

export function Drawer({ }) {
  return <div className={css`
    margin: 0px;
    padding-top: 8px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
    user-select: none;
    color: rgba(0, 0, 0, 1);
  `}>
    <div className={css`
      width: 80%;
      height: 24px;
      margin: 4px 0px;
    `}>
      {'Fast forward'}
    </div>
    <ToolbarItem iconPath={mdiApplication} title='All' />
    <div className={css`
      width: 90%;
      height: 2px;
      margin: 4px 0px;
      background: rgba(0.5, 0.5, 0.5, 0.1);
    `} />
    <div className={css`
      width: 80%;
      height: 24px;
      margin: 4px 0px;
    `}>
      {'Recent'}
    </div>
    <ToolbarItem iconPath={mdiApplication} title='All' />
  </div>;
}
