import React, { useContext } from 'react';
import { cx, css } from '@emotion/css';
import { CSSTransition } from 'react-transition-group';
import { ThemeProviderContext } from '../themeProviderContext';

export function Drawer({
  anchor, on, onClose, children, className
}: {
  anchor?: 'left' | 'top' | 'right' | 'bottom',
  on: boolean,
  onClose?: () => void,
  children?: any,
  className?: string
}) {
  const { palette } = useContext(ThemeProviderContext);

  return <>
    <CSSTransition unmountOnExit timeout={200} in={on} classNames={{
      enter: css`
        transform: ${anchor === 'top' ? 'translate(0px, -100%)' :
          anchor === 'bottom' ? 'translate(0px, 200%)' :
            anchor === 'right' ? 'translate(200%, 0px)' :
              'translate(-100%, 0px)'};
      `,
      enterActive: css`
        transform: translate(0px 0px);
        transition: .2s;
      `,
      leave: css`
        transform: translate(0px 0px);
      `,
      leaveActive: css`
        transform: ${anchor === 'top' ? 'translate(0px, -100%)' :
          anchor === 'bottom' ? 'translate(0px, 200%)' :
            anchor === 'right' ? 'translate(200%, 0px)' :
              'translate(-100%, 0px)'};
        transition: .2s;
      `
    }}>
      <div className={cx(css`
        position: fixed;
        padding: 4px;
        background: ${palette(.8).primary};
        z-index: 10000;
      `, className || '',
        anchor === 'left' ? css`
          left: 0px;
          top: 0px;
          height: 100%;
          max-width: 60%;
          border-radius: 0px 4px 4px 0px;
        ` : '',
        anchor === 'right' ? css`
          right: 0px;
          top: 0px;
          height: 100%;
          max-width: 60%;
          border-radius: 4px 0px 0px 4px;
        ` : '',
        anchor === 'top' ? css`
          top: 0px;
          left: 0px;
          width: 100%;
          max-height: 60%;
          border-radius: 0px 0px 4px 4px;
        ` : '',
        anchor === 'bottom' ? css`
          bottom: 0px;
          left: 0px;
          width: 100%;
          max-height: 60%;
          border-radius: 4px 4px 0px 0px;
        ` : ''
      )}
        onClick={onClose}
      >
        {children}
      </div>
    </CSSTransition>
    <CSSTransition unmountOnExit timeout={200} in={on} classNames={{
      enter: css`
        opacity: 0;
      `,
      enterActive: css`
        opacity: 1;
        transition: .2s;
      `,
      exit: css`
        opacity: 1;
      `,
      exitActive: css`
        opacity: 0;
        transition: .2s;
      `,
      exitDone: css`
        display: none;
      `
    }}>
      <div className={css`
        height: 100%;
        width: 100%;
        position: fixed;
        left: 0px;
        top: 0px;
        background: ${palette(.4).textReverse};
        z-index: 9999;
      `}
        onClick={onClose}
      />
    </CSSTransition>
  </>;
}
