import React, { useState, useEffect } from 'react';
import { css, cx, keyframes } from '@emotion/css';

const fadeIn = `animation: ${keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`} 0.5s ease 1`;
const fadeOut = `animation: ${keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`} 0.55s ease 1`;

export function useTranslationState(
  defaultVal: boolean
): [{ exist: boolean, show: boolean }, (val: boolean) => void] {
  const [exist, setExist] = useState(defaultVal);
  const [show, setShow] = useState(defaultVal);

  useEffect(() => {
    if (show) {
      setExist(true);
    } else {
      setTimeout(() => setExist(false), 500);
    }
  }, [show]);

  return [{ exist, show }, (val: boolean) => {
    setShow(val);
  }];
}

export function Fade({ children, translationState: { exist, show } }: {
  children?: any, translationState: { exist: boolean, show: boolean }
}) {
  return <div className={cx(
    css`${exist ? '' : 'display: none;'}`,
    css`${show ? fadeIn : fadeOut}`
  )}>
    {children}
  </div>
}