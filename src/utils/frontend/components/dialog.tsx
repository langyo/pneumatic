import React, { Children, Component, useState } from 'react';
import { css, cx, keyframes } from '@emotion/css';
import Draggable, { DraggableData } from 'react-draggable';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { Scrollbars } from 'react-custom-scrollbars';
import { IconButton } from './button';
import { IWindowInfo } from '../taskManagerContext';

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
      backdrop-filter: blur(2px);
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
          width: calc(100% - 4px);
          left: 4px;
          height: 32px;
          display: flex;
          flex-direction: row;
          align-items: center;
          user-select: none;
        `, 'drag-handle-tag')}>
          <Icon className={css`
            margin: 4px;
          `}
            path={icon} size={1} color='rgba(0, 0, 0, 1)'
          />
          <div className={css`
            margin: 4px;
          `}>
            <p className={css`
              height: 24px;
              line-height: 24px;
              font-size: 16px;
            `}>
              {title}
            </p>
          </div>
          <div className={css`
            margin: 4px;
          `}>
            <p className={css`
              height: 20px;
              line-height: 20px;
              font-size: 12px;
            `}>
              {subTitle || ''}
            </p>
          </div>
          <div className={css`
            position: absolute;
            top: 0px;
            right: 0px;
          `}>
            <div className={css`
              margin: 4px;
              margin-right: 12px;
            `}>
              <IconButton size={0.5} path={mdiClose} onClick={setDestory} />
            </div>
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
        top: 16px;
        left: -4px;
        height: calc(100% - 32px);
        width: 8px;
        z-index: 1;
        cursor: e-resize;
        filter: drop-shadow(0 0 16px #000);
      `)}
        onMouseDown={() => void 0}
      >
        <div className={css`
          border: 1px solid #6cf;
          height: 100%;
          width: 0px;
          margin: 0px 3px;
        `} />
      </div>
      <div className={cx(css`
        position: absolute;
        top: 16px;
        right: -4px;
        height: calc(100% - 32px);
        width: 8px;
        z-index: 1;
        cursor: e-resize;
        filter: drop-shadow(0 0 16px #000);
      `)}
        onMouseDown={() => void 0}
      >
        <div className={css`
          border: 1px solid #6cf;
          height: 100%;
          width: 0px;
          margin: 0px 3px;
        `} />
      </div>
      <div className={cx(css`
        position: absolute;
        left: 16px;
        top: -4px;
        width: calc(100% - 32px);
        height: 8px;
        z-index: 1;
        cursor: s-resize;
        filter: drop-shadow(0 0 16px #000);
      `)}
        onMouseDown={() => void 0}
      >
        <div className={css`
          border: 1px solid #6cf;
          height: 0px;
          width: 100%;
          margin: 3px 0px;
        `} />
      </div>
      <div className={cx(css`
        position: absolute;
        left: 16px;
        bottom: -4px;
        width: calc(100% - 32px);
        height: 8px;
        z-index: 1;
        cursor: s-resize;
        filter: drop-shadow(0 0 16px #000);
      `)}
        onMouseDown={() => void 0}
      >
        <div className={css`
          border: 1px solid #6cf;
          height: 0px;
          width: 100%;
          margin: 3px 0px;
        `} />
      </div>
      <div className={cx(css`
        position: absolute;
        top: -4px;
        left: -4px;
        height: 20px;
        width: 20px;
        z-index: 1;
        cursor: se-resize;
        filter: drop-shadow(0 0 16px #000);
      `)}
        onMouseDown={() => void 0}
      >
        <div className={css`
          margin-left: 4px;
          margin-top: 4px;
          background: #6cf;
          width: 16px;
          height: 16px;
          clip-path: polygon(calc(100% - 1px) 0px, 100% 1px, 1px 100%, 0px calc(100% - 1px));
        `} />
      </div>
      <div className={cx(css`
        position: absolute;
        bottom: -4px;
        left: -4px;
        height: 20px;
        width: 20px;
        z-index: 1;
        cursor: ne-resize;
        filter: drop-shadow(0 0 16px #000);
      `)}
        onMouseDown={() => void 0}
      >
        <div className={css`
          margin-bottom: 4px;
          margin-left: 4px;
          background: #6cf;
          width: 16px;
          height: 16px;
          clip-path: polygon(0px 1px, 1px 0px, 100% calc(100% - 1px), calc(100% - 1px) 100%);
        `} />
      </div>
      <div className={cx(css`
        position: absolute;
        top: -4px;
        right: -4px;
        height: 20px;
        width: 20px;
        z-index: 1;
        cursor: ne-resize;
        filter: drop-shadow(0 0 16px #000);
      `)}
        onMouseDown={() => void 0}
      >
        <div className={css`
          margin-top: 4px;
          margin-right: 4px;
          background: #6cf;
          width: 16px;
          height: 16px;
          clip-path: polygon(0px 1px, 1px 0px, 100% calc(100% - 1px), calc(100% - 1px) 100%);
        `} />
      </div>
      <div className={cx(css`
        position: absolute;
        bottom: -4px;
        right: -4px;
        height: 20px;
        width: 20px;
        z-index: 1;
        cursor: se-resize;
        filter: drop-shadow(0 0 16px #000);
      `)}
        onMouseDown={() => void 0}
      >
        <div className={css`
          margin-bottom: 4px;
          margin-right: 4px;
          background: #6cf;
          width: 16px;
          height: 16px;
          clip-path: polygon(calc(100% - 1px) 0px, 100% 1px, 1px 100%, 0px calc(100% - 1px));
        `} />
      </div>
    </div>
  </Draggable>
}