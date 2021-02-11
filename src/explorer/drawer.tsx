import React, { useState } from 'react';
import { css } from '@emotion/css';
import {
  mdiServerNetwork, mdiFolderOutline
} from '@mdi/js';

import { ToolbarItem } from '../utils/toolbarItem';

export function ExplorerDrawer({ }) {
  return <div className={css`
    margin: 0px;
    padding-top: 8px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: top;
    align-items: center;
    align-content: flex-start;
    user-select: none;
    color: #fff;
  `}>
    <div className={css`
      width: 80%;
      height: 24px;
      margin: 4px 0px;
    `}>
      {'Device'}
    </div>
    <ToolbarItem iconPath={mdiServerNetwork} title='Hard Disk (sda)' />
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
      {'Fast forward'}
    </div>
    <ToolbarItem iconPath={mdiFolderOutline} title='~' />
    <ToolbarItem iconPath={mdiFolderOutline} title='nickelcat' />
    <ToolbarItem iconPath={mdiFolderOutline} title='pneumatic' />
  </div>;
}
