import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { css } from '@emotion/css';
import Icon from '@mdi/react';
import {
  mdiMenuRight,
  mdiMenuDown,
  mdiDotsHorizontal,
  mdiFolderOutline,
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
import { Button, IconButton } from '../../../utils/frontend/components/button';

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
  return <Button className={css`
    margin: 4px;
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
        text-transform: none;
      `}>
        {title}
      </p>
    </div>
  </Button>;
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
    <Button className={css`
      margin: 16px;
      padding: 8px;
      display: inline-block;
    `}>
      <Typography variant='h4' className={css`
        text-transform: none;
      `}>
        {baseName}
      </Typography>
    </Button>
    <div className={css`
      margin: 8px;
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-shrink: 0;
    `}>
      {parts.filter(n => n !== '')
        .splice(
          parts.filter(n => n !== '').length > 3 ?
            parts.filter(n => n !== '').length - 3 : 0
        ).map(n => (
          <Button>
            <div className={css`
              text-transform: none;
            `}>
              {n}
            </div>
          </Button>
        )).reduceRight(
          (arr, next) => [
            ...arr,
            next,
            <IconButton path={mdiMenuRight} size={0.8} />
          ],
          [
            <IconButton path={mdiMenuDown} size={0.8} />
          ]
        ).reverse().splice(1).reverse().concat(
          parts.filter(n => n !== '').length > 3 ?
            [
              <IconButton path={mdiDotsHorizontal} size={0.8} />
            ] : []
        ).reverse()}
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
