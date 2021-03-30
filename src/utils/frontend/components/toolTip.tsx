import React, { useContext, useState } from 'react';
import { css, cx } from '@emotion/css';
import { ThemeProviderContext } from '../themeProviderContext';

export function ToolTip({
  content, position, children, className
}: {
  content: any, position: 'left' | 'right',
  children?: any, className?: string
}) {
  const { palette } = useContext(ThemeProviderContext);
  const [hover, setHover] = useState(false);

  return <div
    className={cx(css`
      position: relative;
    `, className || '')}
  >
    <div
      className={css`
        position: absolute;
        top: -6px;
        ${position === 'left' ? 'right' : 'left'}: calc(100% + 8px);
        transition: .2s;
        transform: translateX(var(--translateX)) scale(var(--scale));
        opacity: var(--opacity);
        height: 36px;
        line-height: 36px;
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
        color: ${palette.text};
        margin: 4px;
        padding: 0px 8px;
        background: ${palette(.8).primary};
        border-radius: 4px;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, .6);
      `}
      style={{
        '--translateX': hover ? '0px' : '-4px',
        '--scale': hover ? '1' : '.9',
        '--opacity': hover ? '1' : '0'
      } as any}>
      {content}
    </div>
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </div>
  </div>
}