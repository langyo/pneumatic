import React, { useState } from 'react';
import { css } from '@emotion/css';
import Icon from '@mdi/react';
import {
  mdiFolderOutline,
  mdiMenuRight,
  mdiMenuDown,
  mdiFileOutline,
  mdiFileDocumentOutline,
  mdiFileCogOutline,
  mdiFileClockOutline,
  mdiFileImageOutline,
  mdiPackage,
  mdiFileVideoOutline,
  mdiFileMusicOutline,
  mdiFileExcelOutline,
  mdiFilePowerpointOutline,
  mdiFileLinkOutline,
  mdiDisc,
  mdiFileCodeOutline,
  mdiCogs
} from '@mdi/js';

const fileTypeIconMap = {
  'folder': mdiFolderOutline,
  'process': mdiFileCogOutline,
  'shell': mdiFileClockOutline,
  'image': mdiDisc,
  'picture': mdiFileImageOutline,
  'audio': mdiFileMusicOutline,
  'video': mdiFileVideoOutline,
  'document': mdiFileDocumentOutline,
  'excel': mdiFileExcelOutline,
  'powerpoint': mdiFilePowerpointOutline,
  'webpage': mdiFileLinkOutline,
  'package': mdiPackage,
  'code': mdiFileCodeOutline,
  'configure': mdiCogs,
  'file': mdiFileOutline
};

function ContentItem({ iconPath, title }) {
  return <div className={css`
    width: 96px;
    height: 96px;
    margin: 8px;
    padding-top: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    &:hover {
      background: rgba(0.5, 0.5, 0.5, 0.2);
    }
  `}>
    <Icon path={iconPath} size={2} color='rgba(0, 0, 0, 1)' />
    <p className={css`
      margin: 0px;
      line-height: 24px;
      font-size: 14px;
      height: 48px;
      width: 92px;
      word-break: break-all;
      text-align: center;
      user-select: none;
    `}>
      {title}
    </p>
  </div>;
}

export function Content({ sharedState }) {
  const parts: string[] = sharedState?.path.split(/[\\\/]/) || [];
  const { files, baseName }: {
    files: {
      [name: string]: {
        media: 'folder' | 'process' | 'shell' | 'image' |
        'picture' | 'audio' | 'video' |
        'document' | 'excel' | 'powerpoint' |
        'webpage' | 'package' | 'code' | 'configure' | 'normal'
      }
    },
    baseName: string
  } = sharedState;

  return <div className={css`
    color: rgba(0, 0, 0, 1);
  `}>
    <div className={css`
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
      border-radius: 4px;
    `}>
      {baseName}
    </div>
    <div className={css`
      font-size: 16px;
      height: 20px;
      margin: 4px 16px;
      display: flex;
      flex-direction: row;
    `}>
      {parts.map(n => (
        <div className={css`
          height: 20px;
          line-height: 20px;
          margin: 4px;
          padding: 4px;
          &:hover {
            background: rgba(0.5, 0.5, 0.5, 0.2);
          }
          user-select: none;
          border-radius: 4px;
        `}>
          {n}
        </div>
      ))
        .reduceRight(
          (arr, next) => [
            ...arr,
            next,
            <div className={css`
              height: 20px;
              margin: 6px 0px;
              padding: 2px;
              border-radius: 4px;
              &:hover {
                background: rgba(0.5, 0.5, 0.5, 0.2);
              }
            `}>
              <Icon path={mdiMenuRight} size={0.8} color='rgba(0, 0, 0, 1)' />
            </div>
          ],
          [
            <div className={css`
              height: 20px;
              margin: 6px 0px;
              padding: 2px;
              border-radius: 4px;
              &:hover {
                background: rgba(0.5, 0.5, 0.5, 0.2);
              }
            `}>
              <Icon path={mdiMenuDown} size={0.8} color='rgba(0, 0, 0, 1)' />
            </div>
          ]
        )
        .reverse()
        .splice(1)}
    </div>
    <div className={css`
      width: 90%;
      margin: 8px;
      display: flex;
      flex-wrap: wrap;
    `}>
      {Object.keys(files).map(name => <ContentItem
        iconPath={fileTypeIconMap[files[name].media || 'file']}
        title={name}
      />)}
    </div>
  </div>;
}
