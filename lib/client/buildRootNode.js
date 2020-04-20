import React, { createElement, Component } from 'react';
import {
  getAllState,
  setGlobalState,
  registerListener,
  createModel
} from './globalState';
import {
  loadComponent,
  getModelList,
  getClientStream,
  _storageViewController
} from '../lib/modelStore';
import createStream from './createStream';
import { clientTranslator } from '../lib/translator';

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = getAllState();
    registerListener(this.setState.bind(this));
  }

  render() {
    return <>
      {createElement(this.props.component, {
        key: '$view',
        ...this.state.modelState.$view.$view,
        ...this.state.globalState,
        ...((stream => Object.keys(stream).reduce(
          (obj, key) => ({
            ...obj,
            [key]: createStream({
              tasks: stream[key],
              path: '$view'
            }, {
              modelType: '$view',
              modelID: '$view'
            })
          }), {}
        ))(clientTranslator(this.props.controller))),
        $models: getModelList().map(
          modelType => this.state.modelState[modelType] ? Object.keys(this.state.modelState[modelType]).map(
            modelID => createElement(loadComponent(modelType), {
              key: `${modelType}-${modelID}`,
              ...this.state.modelState[modelType][modelID],
              ...this.state.globalState,
              ...((stream => Object.keys(stream).reduce(
                (obj, key) => ({
                  ...obj,
                  [key]: createStream({
                    tasks: stream[key],
                    path: `${modelType}[${modelID}]`
                  }, {
                    modelType,
                    modelID
                  })
                }), {}
              ))(getClientStream(modelType)))
            })
          ) : []
        ).reduce((arr, item) => arr.concat(item), [])
      })}
    </>
  }
}

export default (viewComponent = () => <></>, viewController = {}, initGlobalState = {}) => {
  setGlobalState(initGlobalState);
  _storageViewController(viewController);
  createModel('$view', { /* preload data */} , '$view');
  return <Root component={viewComponent} controller={viewController} />;
};
