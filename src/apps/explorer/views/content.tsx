import React, { useState } from 'react';
import { ButtonBase, Typography } from '@material-ui/core';
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
  return <ButtonBase focusRipple className={css`
    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  `}>
    <div className={css`
      width: 96px;
      height: 96px;
      margin: 8px;
      padding-top: 16px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
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
    </div>
  </ButtonBase>;
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

  return <>
    <ButtonBase focusRipple className={css`
      margin: 16px;
      padding: 8px;
      display: inline-block;
      &:hover {
        background: rgba(0, 0, 0, 0.2);
      }
    `}>
      <div className={css`
        margin: 4px;
      `}>
        <Typography variant='h4'>
          {baseName}
        </Typography>
      </div>
    </ButtonBase>
    <div className={css`
      margin: 8px;
      display: flex;
      flex-direction: row;
      align-items: center;
    `}>
      {parts.map(n => (
        <ButtonBase focusRipple className={css`
          &:hover {
            background: rgba(0, 0, 0, 0.2);
          }
        `}>
          <div className={css`
            margin: 4px;
          `}>
            <Typography variant='body1'>
              {n}
            </Typography>
          </div>
        </ButtonBase>
      ))
        .reduceRight(
          (arr, next) => [
            ...arr,
            next,
            <div className={css`
              margin: 0px 4px;
            `}>
              <ButtonBase focusRipple className={css`
                &:hover {
                  background: rgba(0, 0, 0, 0.2);
                }
              `}>
                <div className={css`
                  margin: 4px;
                `}>
                  <Icon path={mdiMenuRight} size={0.8} color='rgba(0, 0, 0, 1)' />
                </div>
              </ButtonBase>
            </div>
          ],
          [
            <div className={css`
              margin: 0px 4px;
            `}>
              <ButtonBase focusRipple className={css`
                &:hover {
                  background: rgba(0, 0, 0, 0.2);
                }
              `}>
                <div className={css`
                  margin: 4px;
                `}>
                  <Icon path={mdiMenuDown} size={0.8} color='rgba(0, 0, 0, 1)' />
                </div>
              </ButtonBase>
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
  </>;
}
