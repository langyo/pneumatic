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
      backdrop-filter: blur(2px);
      z-index: ${5000 + priority};
    `}>
      <div className={css`
        width: 100%;
        height: 100%;
      `}
        onMouseDown={setActive}
      >
        <div className={css`
          position: absolute;
          width: 100%;
          height: calc(100% + 30px);
          top: -30px;
          z-index: -1;
          background: repeating-linear-gradient(0deg, ${palette.primary}, transparent 4px);
          filter: blur(1px);
          clip-path: polygon(16px 30px, 20% 30px, calc(20% + 32px) 0px, calc(80% - 32px) 0px, 80% 30px, calc(100% - 16px) 30px, 100% 46px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0px calc(100% - 16px), 0px 46px);
        `} />
        <div className={cx(css`
          position: absolute;
          width: 60%;
          left: 20%;
          top: -30px;
          height: 60px;
          z-index: 2;
          clip-path: polygon(32px 0px, calc(100% - 32px) 0px, 100% 30px, calc(100% - 32px) 100%, 32px 100%, 0px 30px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          user-select: none;
          color: ${palette.text};
        `, 'drag-handle-tag')}>
          <p className={css`
            margin: 10px;
            margin-bottom: 0px;
            line-height: 24px;
            font-size: 16px;
          `}>
            {title}
          </p>
          <p className={css`
            margin-top: 0px;
            margin-bottom: 10px;
            line-height: 16px;
            font-size: 12px;
          `}>
            {subTitle || ''}
          </p>
        </div>
        <div className={css`
          position: absolute;
          top: 4px;
          right: 16px;
        `}>
          <IconButton size={0.8} color={palette.text} path={mdiClose} onClick={setDestory} />
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
        filter: drop-shadow(0 0 4px ${palette.secondary});
      `)}
        onMouseDown={() => void 0}
      >
        <div className={css`
          border: 1px solid ${palette.primary};
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
        filter: drop-shadow(0 0 4px ${palette.secondary});
      `)}
        onMouseDown={() => void 0}
      >
        <div className={css`
          border: 1px solid ${palette.primary};
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
        filter: drop-shadow(0 0 4px ${palette.secondary});
      `)}
        onMouseDown={() => void 0}
      >
        <div className={css`
          position: absolute;
          left: 0px;
          border: 1px solid ${palette.primary};
          height: 0px;
          width: calc(20% - 12px);
          margin: 3px 0px;
        `} />
        <div className={css`
          position: absolute;
          right: 0px;
          border: 1px solid ${palette.primary};
          height: 0px;
          width: calc(20% - 12px);
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
        filter: drop-shadow(0 0 4px ${palette.secondary});
      `)}
        onMouseDown={() => void 0}
      >
        <div className={css`
          border: 1px solid ${palette.primary};
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
        filter: drop-shadow(0 0 4px ${palette.secondary});
      `)}
        onMouseDown={() => void 0}
      >
        <div className={css`
          margin-left: 4px;
          margin-top: 4px;
          background: ${palette.primary};
          width: 16px;
          height: 16px;
          clip-path: polygon(calc(100% - 2px) 0px, 100% 0px, 100% 1px, 1px 100%, 0px 100%, 0px calc(100% - 2px));
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
        filter: drop-shadow(0 0 4px ${palette.secondary});
      `)}
        onMouseDown={() => void 0}
      >
        <div className={css`
          margin-bottom: 4px;
          margin-left: 4px;
          background: ${palette.primary};
          width: 16px;
          height: 16px;
          clip-path: polygon(0px 2px, 0px 0px, 1px 0px, 100% calc(100% - 1px), 100% 100%, calc(100% - 2px) 100%);
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
        filter: drop-shadow(0 0 4px ${palette.secondary});
      `)}
        onMouseDown={() => void 0}
      >
        <div className={css`
          margin-top: 4px;
          margin-right: 4px;
          background: ${palette.primary};
          width: 16px;
          height: 16px;
          clip-path: polygon(0px 1px, 0px 0px, 2px 0px, 100% calc(100% - 2px), 100% 100%, calc(100% - 1px) 100%);
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
        filter: drop-shadow(0 0 4px ${palette.secondary});
      `)}
        onMouseDown={() => void 0}
      >
        <div className={css`
          margin-bottom: 4px;
          margin-right: 4px;
          background: ${palette.primary};
          width: 16px;
          height: 16px;
          clip-path: polygon(calc(100% - 1px) 0px, 100% 0px, 100% 2px, 2px 100%, 0px 100%, 0px calc(100% - 1px));
        `} />
      </div>
    </div>
  </Draggable>
}