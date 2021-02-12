import React from 'react';
import { css } from '@emotion/css';
import Icon from '@mdi/react';

export function ToolbarItem({ iconPath, title, onClick }: {
  iconPath: string, title: string, onClick?: (event: Event) => void
}) {
  return <div className={css`
    width: 80%;
    height: 32px;
    margin: 2px;
    padding: 4px;
    display: flex;
    border-radius: 4px;
    &:hover {
      background: rgba(0.5, 0.5, 0.5, 0.1);
    }
    &:active {
      background: rgba(0.5, 0.5, 0.5, 0.2);
    }
  `}
    onClick={onClick}
  >
    <div className={css`
      margin: 4px;
    `}>
      <Icon path={iconPath} size={1} />
    </div>
    <div className={css`
      margin: 0px 8px;
      line-height: 32px;
      user-select: none;
    `}>
      {title}
    </div>
  </div>;
}