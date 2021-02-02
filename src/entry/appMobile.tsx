import React, { useState } from "react";
import { css } from "@emotion/css";
import Icon from "@mdi/react";
import {
  mdiUnfoldMoreVertical,
  mdiClose,
  mdiPlus,
  mdiFolderOutline,
  mdiMemory,
  mdiApplication,
  mdiViewCarouselOutline,
  mdiWeb,
  mdiDatabase,
  mdiFormatListChecks,
  mdiConsole,
  mdiPaletteOutline,
  mdiApps
} from "@mdi/js";

import { Explorer } from "../explorer/index";
import { Monitor } from "../monitor/index";

const tagMap = {
  guide: {
    iconPath: mdiApplication,
    title: "导航"
  },
  explorer: {
    iconPath: mdiFolderOutline,
    title: "资源管理"
  },
  monitor: {
    iconPath: mdiMemory,
    title: "状态监控"
  },
  browser: {
    iconPath: mdiWeb,
    title: "代理浏览器"
  },
  database: {
    iconPath: mdiDatabase,
    title: "数据库管理"
  },
  plan: {
    iconPath: mdiFormatListChecks,
    title: "计划任务"
  },
  console: {
    iconPath: mdiConsole,
    title: "命令行终端"
  },
  theme: {
    iconPath: mdiPaletteOutline,
    title: "主题配置"
  },
  market: {
    iconPath: mdiApps,
    title: "应用市场"
  }
};

export default function () {
  const [activeTag, setActiveTag] = useState(-1);
  const [tags, setTags] = useState([]);

  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
        left: 0px;
        top: 0px;
        margin: 0px;
        &::after {
          filter: blur(2px);
        }
        background: linear-gradient(to right, #39c, #6cf, #39c);
        position: absolute;
      `}
    >
      {/* Tag bar */}
      <div
        className={css`
          height: 28px;
          width: 100%;
          position: absolute;
          top: 0;
          backdrop-filter: blur(2px);
          background: rgba(0.5, 0.5, 0.5, 0.1);
          margin: 0px 0px 2px 0px;
          padding: 0px 0px;
        `}
      >
        <div
          className={css`
            position: absolute;
            right: 28px;
            top: 0px;
          `}
        >
          <button
            className={css`
              border: none;
              outline: none;
              background: none;
              width: 24px;
              height: 24px;
              margin: 2px;
              padding: 2px;
              &:hover {
                background: rgba(0.5, 0.5, 0.5, 0.2);
              }
              &:active {
                background: rgba(0.5, 0.5, 0.5, 0.4);
              }
            `}
          >
            <Icon path={mdiViewCarouselOutline} size={0.8} color="#fff" />
          </button>
        </div>
        <div
          className={css`
            position: absolute;
            right: 2px;
            top: 0px;
          `}
        >
          <button
            className={css`
              border: none;
              outline: none;
              background: none;
              width: 24px;
              height: 24px;
              margin: 2px;
              padding: 2px;
              &:hover {
                background: rgba(0.5, 0.5, 0.5, 0.2);
              }
              &:active {
                background: rgba(0.5, 0.5, 0.5, 0.4);
              }
            `}
          >
            <Icon path={mdiUnfoldMoreVertical} size={0.8} color="#fff" />
          </button>
        </div>
      </div>
      {/* App area */}
      <div
        className={css`
          margin: 30px 0px 0px 0px;
          height: calc(100% - 30px);
          width: 100%;
          position: relative;
          color: white;
        `}
      >
      </div>
    </div>
  );
}
