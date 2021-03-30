import React, {
  forwardRef, useRef, useEffect, useState, useCallback, useImperativeHandle
} from 'react';
import { TransitionGroup } from 'react-transition-group';
import { css, cx, keyframes } from '@emotion/css';

function Ripple({
  rippleX, rippleY, rippleSize, timeout, key
}: {
  rippleX: number, rippleY: number, rippleSize: number, timeout: number, key: string
}) {
  const [leaving, setLeaving] = useState(false);

  const rippleStyles = {
    width: rippleSize,
    height: rippleSize,
    top: -(rippleSize / 2) + rippleY,
    left: -(rippleSize / 2) + rippleX
  };

  useEffect(() => {
    setLeaving(true);
  }, [timeout]);

  return (
    <span
      className={css`
        opacity: 0;
        position: absolute;
        opacity: .3;
        transform: scale(1);
        animation: ${keyframes`
          0% {
            transform: scale(0);
            opacity: .1;
          }
          100% {
            transform: scale(1);
            opacity: .3;
          }
        `} .5s;
      `}
      style={rippleStyles}
    >
      <span
        className={cx(css`
          opacity: 1;
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: currentColor;
        `,
          leaving && css`
          opacity: 0;
          animation: ${keyframes`
            0% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          `} .5s;
        `)}
      />
    </span>
  );
}

export const TouchRipple = forwardRef(function ({ className }: {
  className?: string
}, ref) {
  const [ripples, setRipples] = useState([]);
  const nextKey = useRef(0);
  const container = useRef(undefined);

  const startCommit = useCallback(
    (params) => {
      const { rippleX, rippleY, rippleSize } = params;
      setRipples((oldRipples) => [
        ...oldRipples,
        <Ripple
          key={nextKey.current}
          timeout={500}
          rippleX={rippleX}
          rippleY={rippleY}
          rippleSize={rippleSize}
        />
      ]);
      nextKey.current += 1;
    }, []
  );

  const start = useCallback(
    (event: MouseEvent & TouchEvent) => {
      const element = container.current;
      const rect = element
        ? element.getBoundingClientRect()
        : {
          width: 0,
          height: 0,
          left: 0,
          top: 0
        };

      let rippleX =
        (event.clientX === 0 && event.clientY === 0) ||
          (!event.clientX && !event.touches)
          ? Math.round(rect.width / 2)
          : Math.round(
            (event.clientX ? event.clientX : event.touches[0].clientX) -
            rect.left
          );
      let rippleY =
        (event.clientX === 0 && event.clientY === 0) ||
          (!event.clientY && !event.touches)
          ? Math.round(rect.height / 2)
          : Math.round(
            (event.clientY ? event.clientY : event.touches[0].clientY) -
            rect.top
          );
      let rippleSize = Math.sqrt(
        (Math.max(
          Math.abs((element ? element.clientWidth : 0) - rippleX),
          rippleX
        ) *
          2 +
          2) **
        2 +
        (Math.max(
          Math.abs((element ? element.clientHeight : 0) - rippleY),
          rippleY
        ) *
          2 +
          2) **
        2
      );

      startCommit({ rippleX, rippleY, rippleSize });
    },
    [startCommit]
  );

  const stop = useCallback(() => {
    setRipples((oldRipples) => {
      if (oldRipples.length > 0) {
        return oldRipples.slice(1);
      }
      return oldRipples;
    });
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      start,
      stop
    }),
    [start, stop]
  );

  return (
    <span
      ref={container}
      className={cx(
        css`
          overflow: hidden;
          pointer-events: none;
          position: absolute;
          z-index: 0;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;
        `,
        className
      )}
    >
      <TransitionGroup>{ripples}</TransitionGroup>
    </span>
  );
});
