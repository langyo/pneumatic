import React, { useState } from "react";
import { css } from "@emotion/css";
import Icon from "@mdi/react";
import {
  mdiUnfoldMoreVertical,
  mdiClose,
  mdiPlus,
  mdiFolderOutline,
  mdiMemory,
  mdiApplication
} from "@mdi/js";

import { Guide } from "./guide";
import { Explorer } from "../explorer";
import { Monitor } from "../monitor";

const Tag = ({ title, iconPath, isActive, onToggle, onClose }) => (
  <div
    className={css`
      margin: 0px 2px 0px 0px;
      padding: 0px;
      width: 220px;
      ${isActive && "background: rgba(0.5, 0.5, 0.5, 0.1);"}
      display: flex;
      flex-direction: row;
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
        user-select: none;
      `}
    >
      {title}
    </div>
    <button
      className={css`
        border: none;
        outline: none;
        background: none;
        width: 24px;
        height: 24px;
        margin: 2px;
        margin-left: auto;
        margin-right: 4px;
        padding: 2px;
        &:hover {
          background: rgba(0.5, 0.5, 0.5, 0.2);
        }
        &:active {
          background: rgba(0.5, 0.5, 0.5, 0.4);
        }
      `}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <Icon path={mdiClose} size={0.8} color="#fff" />
    </button>
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
          {activeTag !== -1 && (
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
              onClick={() => {
                const tagId = tags.length;
                setTags([...tags, { type: "guide" }]);
                setActiveTag(tagId);
              }}
            >
              <Icon path={mdiPlus} size={0.8} color="#fff" />
            </button>
          )}
        </div>
        <button
          className={css`
            position: absolute;
            right: 2px;
            top: 0px;
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
          <Guide
            pushNewTag={(type) => {
              if (activeTag === -1) {
                setTags([{ type }]);
                setActiveTag(0);
              } else {
                let temp = [...tags];
                temp[activeTag] = { type };
                setTags(temp);
              }
            }}
          />
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
