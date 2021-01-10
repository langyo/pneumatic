import React, { useState } from "react";
import { css } from "@emotion/css";
import Icon from "@mdi/react";
import {
  mdiFolderOutline,
  mdiFileOutline,
  mdiFileDocumentOutline,
  mdiFolder,
  mdiMemory
} from "@mdi/js";

function ContentItem({ iconPath, title, onClick }) {
  return (
    <div
      className={css`
        width: 96px;
        height: 96px;
        margin: 8px;
        padding-top: 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &:hover {
          background: rgba(0.5, 0.5, 0.5, 0.2);
        }
      `}
      onClick={onClick}
    >
      <Icon path={iconPath} size={2} />
      <p
        className={css`
          margin: 0px;
          line-height: 24px;
          font-size: 14px;
          height: 48px;
          width: 92px;
          word-break: break-all;
          text-align: center;
          user-select: none;
        `}
      >
        {title}
      </p>
    </div>
  );
}

export function Guide({ pushNewTag }) {
  return (
    <div
      className={css`
        margin: 0px;
        height: 100%;
        width: 100%;
        background: rgba(0.5, 0.5, 0.5, 0.1);
      `}
    >
      <div
        className={css`
          font-size: 32px;
          margin: 16px 32px;
          height: 36px;
          line-height: 36px;
          padding: 4px;
          display: inline-block;
          user-select: none;
        `}
      >
        {"导航"}
      </div>
      <div
        className={css`
          width: 90%;
          margin: 8px;
          display: flex;
          flex-wrap: wrap;
        `}
      >
        <ContentItem
          iconPath={mdiFolder}
          title="资源管理"
          onClick={() => pushNewTag("explorer")}
        />
        <ContentItem
          iconPath={mdiMemory}
          title="状态监控"
          onClick={() => pushNewTag("monitor")}
        />
      </div>
    </div>
  );
}
