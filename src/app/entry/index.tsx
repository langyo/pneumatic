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

import { Explorer } from "./explorer";
import { Monitor } from "./monitor";

const IconButton = ({ iconPath, onClick }) => (
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
    onClick={onClick}
  >
    <Icon path={iconPath} size={0.8} color="#fff" />
  </button>
);

const Tag = ({ title, iconPath, isActive, onToggle, onClose }) => (
  <div
    className={css`
      margin: 0px 2px 0px 0px;
      padding: 0px;
      width: 220px;
      min-width: 50px;
      ${isActive && "background: rgba(0.5, 0.5, 0.5, 0.1);"}
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      &:hover {
        background: rgba(0.5, 0.5, 0.5, 0.1);
      }
      &:active {
        background: rgba(0.5, 0.5, 0.5, 0.2);
      }
    `}
    onClick={onToggle}
  >
    <div
      className={css`
        display: flex;
        flex-direction: row;
        overflow-x: hidden;
      `}
    >
      <div
        className={css`
          margin: 2px 4px;
          padding: 2px;
          width: 20px;
          height: 20px;
        `}
      >
        <Icon path={iconPath} size={0.8} color="#fff" />
      </div>
      <div
        className={css`
          margin: 0px 4px;
          line-height: 28px;
          white-space: nowrap;
          overflow-x: hidden;
          text-overflow: ellipsis;
          user-select: none;
        `}
      >
        {title}
      </div>
    </div>
    <IconButton
      iconPath={mdiClose}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    />
  </div>
);

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
            left: 0px;
            margin: 0px;
            padding: 0px 4px;
            font-size: 14px;
            color: #fff;
            display: flex;
            flex-direction: row;
            width: calc(100% - 56px);
          `}
        >
          <div
            className={css`
              display: flex;
              flex-direction: row;
              max-width: calc(100% - 28px);
              overflow-x: hidden;
            `}
          >
            {tags.map(({ type }, index) => (
              <Tag
                title={tagMap[type].title}
                iconPath={tagMap[type].iconPath}
                isActive={index === activeTag}
                onToggle={() => setActiveTag(index)}
                onClose={() => {
                  if (tags.length === 1) {
                    setActiveTag(-1);
                  } else if (activeTag !== 0 && activeTag >= index) {
                    setActiveTag(activeTag - 1);
                  }
                  setTags(tags.filter((_name, i) => i !== index));
                }}
              />
            ))}
            {activeTag === -1 && (
              <div
                className={css`
                  margin: 0px 2px 0px 0px;
                  padding: 0px;
                  width: 220px;
                  display: flex;
                  flex-direction: row;
                `}
              >
                <div
                  className={css`
                    margin: 2px 4px;
                    padding: 2px;
                    width: 20px;
                    height: 20px;
                  `}
                >
                  <Icon path={mdiApplication} size={0.8} color="#fff" />
                </div>
                <div
                  className={css`
                    margin: 0px 4px;
                    line-height: 28px;
                    user-select: none;
                  `}
                >
                  {tagMap.guide.title}
                </div>
              </div>
            )}
          </div>
          {activeTag !== -1 && (
            <IconButton
              onClick={() => {
                const tagId = tags.length;
                setTags([...tags, { type: "guide" }]);
                setActiveTag(tagId);
              }}
              iconPath={mdiPlus}
            />
          )}
        </div>
        <div
          className={css`
            position: absolute;
            right: 28px;
            top: 0px;
          `}
        >
          <IconButton iconPath={mdiViewCarouselOutline} />
        </div>
        <div
          className={css`
            position: absolute;
            right: 2px;
            top: 0px;
          `}
        >
          <IconButton iconPath={mdiUnfoldMoreVertical} />
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
        {(activeTag === -1 || tags[activeTag].type === "guide") && (
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
              {[
                "explorer",
                "monitor",
                "plan",
                "console",
                "browser",
                "database",
                "theme",
                "market"
              ].map((type) => (
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
                  onClick={() => {
                    if (activeTag === -1) {
                      setTags([{ type }]);
                      setActiveTag(0);
                    } else {
                      let temp = [...tags];
                      temp[activeTag] = { type };
                      setTags(temp);
                    }
                  }}
                >
                  <Icon path={tagMap[type].iconPath} size={2} />
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
                    {tagMap[type].title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTag !== -1 && (
          <div>
            {tags[activeTag].type === "explorer" && <Explorer />}
            {tags[activeTag].type === "monitor" && <Monitor />}
          </div>
        )}
      </div>
    </div>
  );
}
