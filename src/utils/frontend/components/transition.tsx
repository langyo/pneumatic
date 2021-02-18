import React from 'react';
import { css } from '@emotion/css';
import { CSSTransition } from 'react-transition-group';

const fadeIn = css`
  opacity: 0;
`;
const fadeInActive = css`
  opacity: 1;
  transition: opacity .2s;
`;
const fadeOut = css`
  opacity: 1;
`;
const fadeOutActive = css`
  opacity: 0;
  transition: opacity .2s;
`;

export function Fade({ children, on }: {
  children?: any, on: boolean
}) {
  return <CSSTransition unmountOnExit in={on} timeout={200} classNames={{
      enter: fadeIn,
      enterActive: fadeInActive,
      exit: fadeOut,
      exitActive: fadeOutActive
    }}>
      <>
        {children}
      </>
    </CSSTransition>;
}

const growIn = css`
  opacity: 0;
  transform: scale(0.9);
`;
const growInActive = css`
  opacity: 1;
  transform: scale(1);
  transition: opacity .2s, transform .2s;
`;
const growOut = css`
  opacity: 1;
`;
const growOutActive = css`
  opacity: 0;
  transform: scale(0.9);
  transition: opacity .2s, transform .2s;
`;

export function Grow({ children, on }: {
  children?: any, on: boolean
}) {
  return <CSSTransition unmountOnExit in={on} timeout={200} classNames={{
      enter: growIn,
      enterActive: growInActive,
      exit: growOut,
      exitActive: growOutActive
    }}>
      <>
        {children}
      </>
    </CSSTransition>;
}