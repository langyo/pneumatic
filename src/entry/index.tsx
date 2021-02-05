import React from 'react';
import TaskManager from './taskManager';

export default function () {
  return <>
    <style>{`
      html, body {
        margin: 0px;
        padding: 0px;
      }
    `}</style>
    <TaskManager />
  </>;
}