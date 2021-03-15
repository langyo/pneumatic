import React, { MouseEventHandler, useRef } from 'react';
import { cx, css } from '@emotion/css';
import Icon from '@mdi/react';
import { TouchRipple } from './touchRipple';

export function Button({ children, className, onClick }: {
  children?: any,
  className?: string,
  onClick?: MouseEventHandler<HTMLDivElement>
}) {
  const rippleRef = useRef(undefined);

  return <div className={cx(css`
    position: relative;
    margin: 4px;
    padding: 4px;
    font-size: 16px;
    user-select: none;
    border-radius: 4px;
    transition: background 0.5s;
    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  `, className || '')}
    onMouseDown={event => {
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
  onClick?: MouseEventHandler<HTMLDivElement>
}) {
  const rippleRef = useRef(undefined);

  return <div className={cx(css`
    position: relative;
    margin: 4px;
    padding: 4px;
    height: ${24 * (size || 1)}px;
    width: ${24 * (size || 1)}px;
    border-radius: 4px;
    transition: background 0.5s;
    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  `, className || '')}
    onMouseDown={event => {
      rippleRef.current.start(event);
      if (onClick) {
        onClick(event);
      }
    }}
    onMouseUp={() => rippleRef.current.stop()}
  >
    <Icon path={path} size={size || 1} color={color || '#000'} />
    <TouchRipple className={css`
      border-radius: 4px;
    `}
      ref={rippleRef}
    />
  </div>
}