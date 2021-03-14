import React, { useState } from 'react';
import { css, cx } from '@emotion/css';
import Draggable, { DraggableData } from 'react-draggable';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { Scrollbars } from 'react-custom-scrollbars';

const loadingComponent = <div className={css`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`}>
  <p className={css`
    height: 32px;
    line-height: 32px;
    font-size: 28px;
    color: rgba(0, 0, 0, 0.8);
  `}>
    {`Loading`}
  </p>
</div>;

type IDragType = 'none' | 'move' |
  'dragLeftTop' | 'dragLeftBottom' |
  'dragRightTop' | 'dragRightBottom' |
  'dragLeft' | 'dragRight' |
  'dragTop' | 'dragBottom'

export function Dialog({
  width, height, left, top, priority,
  icon, title, subTitle,
  bodyComponent, drawerComponent,
  setWindowInfo, setActive
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
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.8);
      z-index: ${5000 + priority * 2};
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
            `}>
              <Icon path={mdiClose} size={1} color='rgba(0, 0, 0, 1)' />
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
            {drawerComponent || loadingComponent}
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
            {bodyComponent || loadingComponent}
          </Scrollbars>
        </div>
      </div>
      <div className={cx(css`
        position: absolute;
        top: 4px;
        left: -4px;
        height: calc(100% - 8px);
        width: 8px;
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
        cursor: se-resize;
      `)}
        onMouseDown={() => void 0}
      />
    </div>
  </Draggable>
}