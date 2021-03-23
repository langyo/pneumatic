import React, { Children, Component, useState, useContext } from 'react';
import { css, cx, keyframes } from '@emotion/css';
import Draggable, { DraggableData } from 'react-draggable';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { Scrollbars } from 'react-custom-scrollbars';
import { IconButton } from './button';
import { IWindowInfo } from '../taskManagerContext';
import { ITheme, ThemeProviderContext } from '../themeProviderContext';

type IDragType = 'none' | 'move' |
  'dragLeftTop' | 'dragLeftBottom' |
  'dragRightTop' | 'dragRightBottom' |
  'dragLeft' | 'dragRight' |
  'dragTop' | 'dragBottom'

export function Dialog({
  width, height, left, top, priority,
  icon, title, subTitle,
  bodyComponent, drawerComponent,
  setWindowInfo, setActive, setDestory
}: {
  width: number, height: number, left: number, top: number, priority: number,
  icon: string, title: string, subTitle: string,
  bodyComponent: Component, drawerComponent: Component,
  setWindowInfo: (info: Partial<IWindowInfo>) => void,
  setActive: () => void,
  setDestory: () => void
}) {
  const { palette } = useContext(ThemeProviderContext);
  const [dragging, setDragging] = useState('none');

  return <Draggable
    position={{ x: left, y: top }}
    handle='.drag-handle-tag'
    onStop={(_e, state: DraggableData) => setWindowInfo({
      left: state.x,
      top: state.y
    })}
  >
    <div className={css`
      position: fixed;
      width: ${width};
      height: ${height};
      background: ${palette(0.8).primary};
      border-radius: 4px;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
      z-index: ${5000 + priority};
    `}>
      <div className={css`
        width: 100%;
        height: 100%;
      `}
        onMouseDown={setActive}
      >
        <div className={cx(css`
          position: absolute;
          width: 100%;
          height: 32px;
          top: 0px;
          z-index: 2;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          user-select: none;
          background: ${palette(0.2).secondary};
          border-radius: 4px;
          color: ${palette.text};
        `, 'drag-handle-tag')}>
          <p className={css`
            margin-left: 8px;
            line-height: 24px;
            font-size: 16px;
          `}>
            {title}
          </p>
          <p className={css`
            margin-left: 8px;
            line-height: 16px;
            font-size: 12px;
          `}>
            {subTitle || ''}
          </p>
          <div className={css`
            position: absolute;
            right: 4px;
          `}>
            <IconButton size={0.8} color={palette.text} path={mdiClose} onClick={setDestory} />
          </div>
        </div>
        <div className={css`
          position: absolute;
          bottom: 4px;
          left: 4px;
          width: calc(40% - 4px);
          height: calc(100% - 32px - 4px - 4px);
        `}
          onMouseDown={setActive}
        >
          <Scrollbars className={css`
            width: 100%;
            height: 100%;
          `}>
            {Children.map(drawerComponent, (component, index) => <div className={css`
              animation: ${keyframes`
                0% {
                  opacity: 0;
                  scale: 0.5;
                }
                100% {
                  opacity: 1;
                  scale: 1;
                }
              `} 0.2s ${index * 0.2}s both;
            `}>
              {component}
            </div>)}
          </Scrollbars>
        </div>
        <div className={css`
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: calc(60% - 4px);
          height: calc(100% - 32px - 4px - 4px);
        `}
          onMouseDown={setActive}
        >
          <Scrollbars className={css`
            width: 100%;
            height: 100%;
            `}>
            {Children.map(bodyComponent, (component, index) => <div className={css`
              animation: ${keyframes`
                0% {
                  opacity: 0;
                  scale: 0.5;
                }
                100% {
                  opacity: 1;
                  scale: 1;
                }
              `} 0.2s ${index * 0.2}s both;
            `}>
              {component}
            </div>)}
          </Scrollbars>
        </div>
      </div>
      <div className={cx(css`
        position: absolute;
        top: 4px;
        left: -4px;
        height: calc(100% - 8px);
        width: 8px;
        z-index: 1;
        cursor: e-resize;
      `)}
        onMouseDown={() => void 0}
      />
      <div className={cx(css`
        position: absolute;
        top: 4px;
        right: -4px;
        height: calc(100% - 8px);
        width: 8px;
        z-index: 1;
        cursor: e-resize;
      `)}
        onMouseDown={() => void 0}
      />
      <div className={cx(css`
        position: absolute;
        left: 4px;
        top: -4px;
        width: calc(100% - 8px);
        height: 8px;
        z-index: 1;
        cursor: s-resize;
      `)}
        onMouseDown={() => void 0}
      />
      <div className={cx(css`
        position: absolute;
        left: 4px;
        bottom: -4px;
        width: calc(100% - 8px);
        height: 8px;
        z-index: 1;
        cursor: s-resize;
      `)}
        onMouseDown={() => void 0}
      />
      <div className={cx(css`
        position: absolute;
        top: -4px;
        left: -4px;
        height: 8px;
        width: 8px;
        z-index: 1;
        cursor: se-resize;
      `)}
        onMouseDown={() => void 0}
      />
      <div className={cx(css`
        position: absolute;
        bottom: -4px;
        left: -4px;
        height: 8px;
        width: 8px;
        z-index: 1;
        cursor: ne-resize;
      `)}
        onMouseDown={() => void 0}
      />
      <div className={cx(css`
        position: absolute;
        top: -4px;
        right: -4px;
        height: 8px;
        width: 8px;
        z-index: 1;
        cursor: ne-resize;
      `)}
        onMouseDown={() => void 0}
      />
      <div className={cx(css`
        position: absolute;
        bottom: -4px;
        right: -4px;
        height: 8px;
        width: 8px;
        z-index: 1;
        cursor: se-resize;
      `)}
        onMouseDown={() => void 0}
      />
    </div>
  </Draggable>
}