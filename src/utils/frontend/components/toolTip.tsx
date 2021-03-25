import React, { useContext, useState } from 'react';
import { css } from '@emotion/css';
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
    className={css`
      position: relative;
    `}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
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
        background: ${palette(0.6).primary};
        border-radius: 4px;
      `}
      style={{
        '--translateX': hover ? '0px' : '-4px',
        '--scale': hover ? '1' : '0.9',
        '--opacity': hover ? '1' : '0'
      } as any}>
      {content}
    </div>
    {children}
  </div>
}