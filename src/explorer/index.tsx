import React, { useState } from "react";
import { css } from "@emotion/css";
import Icon from "@mdi/react";
import {
  mdiServerNetwork,
  mdiFolderOutline,
  mdiMenuRight,
  mdiMenuDown,
  mdiFileOutline,
  mdiFileDocumentOutline
} from "@mdi/js";

function ToolbarItem({ iconPath, title }) {
  return (
    <div
      className={css`
        width: 80%;
        height: 32px;
        margin: 2px;
        padding: 4px;
        display: flex;
        &:hover {
          background: rgba(0.5, 0.5, 0.5, 0.1);
        }
        &:active {
          background: rgba(0.5, 0.5, 0.5, 0.2);
        }
      `}
    >
      <div
        className={css`
          margin: 4px;
        `}
      >
        <Icon path={iconPath} size={1} />
      </div>
      <div
        className={css`
          margin: 0px 8px;
          line-height: 32px;
          user-select: none;
        `}
      >
        {title}
      </div>
    </div>
  );
}

function ContentItem({ iconPath, title }) {
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

export function Explorer({}) {
  return [
    // Sidebar
    <div
      className={css`
        margin: 0px;
        padding-top: 8px;
        height: calc(100% - 8px);
        width: 200px;
        background: rgba(0.5, 0.5, 0.5, 0.2);
        position: absolute;
        top: 0px;
        left: 0px;
        display: flex;
        flex-direction: column;
        justify-content: top;
        align-items: center;
        align-content: flex-start;
      `}
    >
      <div
        className={css`
          width: 80%;
          height: 24px;
          margin: 4px 0px;
        `}
      >
        {"设备"}
      </div>
      <ToolbarItem iconPath={mdiServerNetwork} title="硬盘 0 (sda)" />
      <div
        className={css`
          width: 90%;
          height: 2px;
          margin: 4px 0px;
          background: rgba(0.5, 0.5, 0.5, 0.1);
        `}
      />
      <div
        className={css`
          width: 80%;
          height: 24px;
          margin: 4px 0px;
        `}
      >
        {"快速访问"}
      </div>
      <ToolbarItem iconPath={mdiFolderOutline} title="~" />
      <ToolbarItem iconPath={mdiFolderOutline} title="nickelcat" />
      <ToolbarItem iconPath={mdiFolderOutline} title="pneumatic" />
    </div>,
    // Content
    <div
      className={css`
        margin: 0px;
        height: 100%;
        width: calc(100% - 200px);
        background: rgba(0.5, 0.5, 0.5, 0.1);
        position: absolute;
        top: 0px;
        left: 200px;
      `}
    >
      <div
        className={css`
          font-size: 32px;
          margin: 8px 16px;
          height: 36px;
          line-height: 36px;
          padding: 4px;
          &:hover {
            background: rgba(0.5, 0.5, 0.5, 0.2);
          }
          display: inline-block;
          user-select: none;
        `}
      >
        {"nickelcat"}
      </div>
      <div
        className={css`
          font-size: 16px;
          height: 20px;
          margin: 4px 16px;
          display: flex;
          flex-direction: row;
        `}
      >
        {["~", "git", "nickelcat"]
          .map((n) => (
            <div
              className={css`
                height: 20px;
                line-height: 20px;
                margin: 4px;
                padding: 4px;
                &:hover {
                  background: rgba(0.5, 0.5, 0.5, 0.2);
                }
                user-select: none;
              `}
            >
              {n}
            </div>
          ))
          .reduceRight(
            (arr, next) => [
              ...arr,
              next,
              <div
                className={css`
                  height: 20px;
                  margin: 6px 0px;
                  padding: 2px;
                  &:hover {
                    background: rgba(0.5, 0.5, 0.5, 0.2);
                  }
                `}
              >
                <Icon path={mdiMenuRight} size={0.8} />
              </div>
            ],
            [
              <div
                className={css`
                  height: 20px;
                  margin: 6px 0px;
                  padding: 2px;
                  &:hover {
                    background: rgba(0.5, 0.5, 0.5, 0.2);
                  }
                `}
              >
                <Icon path={mdiMenuDown} size={0.8} />
              </div>
            ]
          )
          .reverse()
          .splice(1)}
      </div>
      <div
        className={css`
          width: 90%;
          margin: 8px;
          display: flex;
          flex-wrap: wrap;
        `}
      >
        <ContentItem iconPath={mdiFolderOutline} title=".git" />
        <ContentItem iconPath={mdiFolderOutline} title="node_modules" />
        <ContentItem iconPath={mdiFolderOutline} title="packages" />
        <ContentItem iconPath={mdiFileOutline} title=".gitignore" />
        <ContentItem iconPath={mdiFileDocumentOutline} title="package.json" />
        <ContentItem iconPath={mdiFileDocumentOutline} title="README.md" />
      </div>
    </div>
  ];
}
