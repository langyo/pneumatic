import React, { MouseEventHandler, useRef, useContext } from 'react';
import { cx, css } from '@emotion/css';
import Icon from '@mdi/react';
import { ThemeProviderContext } from '../themeProviderContext';
import { TouchRipple } from './touchRipple';

export function Button({ children, className, onClick }: {
  children?: any,
  onClick?: MouseEventHandler<HTMLInputElement>,
  className?: string
}) {
  const rippleRef = useRef(undefined);

  return <div className={cx(css`
    position: relative;
    padding: 4px;
    font-size: 16px;
    user-select: none;
    border-radius: 4px;
    transition: .2s;
    &:hover {
      background: rgba(0, 0, 0, .2);
    }
  `, className || '')}
    onMouseDown={event => {
      event.stopPropagation();
      rippleRef.current.start(event);
      if (onClick) {
        onClick(event);
      }
    }}
    onMouseUp={() => rippleRef.current.stop()}
  >
    {children}
    <TouchRipple className={css`
      border-radius: 4px;
    `}
      ref={rippleRef}
    />
  </div>
}

export function IconButton({ className, path, size, color, onClick }: {
  className?: string,
  path: string,
  size?: number,
  color?: string,
  onClick?: MouseEventHandler<HTMLInputElement>
}) {
  const { palette } = useContext(ThemeProviderContext);
  const rippleRef = useRef(undefined);

  return <div className={cx(css`
    position: relative;
    padding: 4px;
    height: ${24 * (size || 1)}px;
    width: ${24 * (size || 1)}px;
    border-radius: 4px;
    transition: .2s;
    &:hover {
      background: rgba(0, 0, 0, .2);
    }
  `, className || '')}
    onMouseDown={event => {
      event.stopPropagation();
      rippleRef.current.start(event);
      if (onClick) {
        onClick(event);
      }
    }}
    onMouseUp={() => rippleRef.current.stop()}
  >
    <Icon path={path} size={size || 1} color={color || palette.text} />
    <TouchRipple className={css`
      border-radius: 4px;
    `}
      ref={rippleRef}
    />
  </div>
}