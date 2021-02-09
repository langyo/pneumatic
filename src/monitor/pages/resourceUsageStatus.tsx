import React, { useState } from "react";
import { css } from "@emotion/css";

export function ResourceUsgaeStatus({ }) {
  return <div className={css`
    color: #fff;
  `}>
    <div
      className={css`
        font-size: 32px;
        margin: 8px 16px;
        height: 36px;
        line-height: 36px;
        padding: 4px;
        display: inline-block;
        user-select: none;
      `}
    >
      {"Resource Usage"}
    </div>
    <div
      className={css`
        width: calc(100% - 16px);
        margin: 8px;
        display: flex;
        flex-wrap: wrap;
      `}
    ></div>
  </div>;
}
