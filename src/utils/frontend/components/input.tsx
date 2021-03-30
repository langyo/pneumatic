import React, { ChangeEventHandler, useRef, useContext } from 'react';
import { cx, css } from '@emotion/css';
import { ThemeProviderContext } from '../themeProviderContext';

export function Input({
  className, placeholder, type, value, inputRef, onChange
}: {
  className?: string,
  label?: string, placeholder?: string, type?: HTMLInputElement['type'], value?: string,
  inputRef?: React.RefObject<HTMLInputElement>,
  onChange?: ChangeEventHandler<HTMLInputElement>
}) {
  const { palette } = useContext(ThemeProviderContext);
  const ref = inputRef || useRef();

  return <div className={cx(css`
    position: relative;
    padding: 4px;
    font-size: 16px;
    user-select: none;
    border-radius: 4px;
  `, className || '')}
  >
    <input className={css`
      height: 32px;
      margin: 4px;
      padding: 4px;
      line-height: 32px;
      font-size: 16px;
      text-align: center;
      color: ${palette.text};
      outline: none;
      border: none;
      border-radius: 4px;
      background: ${palette(.2).textReverse};
      transition: .2s;
      &:hover {
        background: ${palette(.4).textReverse};
      }
      &::placeholder {
        color: ${palette(.4).text};
      }
    `}
      placeholder={placeholder}
      type={type || 'text'}
      ref={ref}
      onChange={onChange}
      value={value}
    />
  </div>
}
