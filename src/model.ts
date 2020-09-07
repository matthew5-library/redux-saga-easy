import { createAction as _createAction_by_redux_actions } from 'redux-actions'
import { takeLatest, takeEvery, put } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { ModelAction0, ModelAction } from './type'
import { dispatch as globalDispatch } from './createStore'

const _getActionType = (modelName: string, generatorName: string): string => {
  return modelName + '.' + generatorName
}

let _name = 'default'
export let model: {
  name: string
  anonymousGeneratorIndex: number
} = {
  name: _name,
  anonymousGeneratorIndex: 0
}
Object.defineProperty(model, 'name', {
  get: function () {
    return _name
  },
  set: function (newValue) {
    _name = newValue
    this.anonymousGeneratorIndex = 0
  }
})

export function createAction0(
  generator: ModelGenerator0,
  takeFunction?: typeof takeEvery
): Dispatcher0<ModelAction0>
export function createAction0(
  reducer: ModelReducer1<ModelAction<any>>
): Dispatcher0<ModelAction0>
export function createAction0(
  method: Function,
  takeFunction?: typeof takeEvery
): Dispatcher0<ModelAction0> {
  return _createAction(method, () => {}, takeFunction)
}

export function createAction<Payload>(
  generator: ModelGenerator1<ModelAction<Payload>>,
  takeFunction?: typeof takeEvery
): Dispatcher<Payload, ModelAction0>
export function createAction<Payload>(
  reducer: ModelReducer2<any, ModelAction<Payload>>
): Dispatcher<Payload, ModelAction0>
export function createAction<Payload>(
  method: Function,
  takeFunction?: typeof takeEvery
): Dispatcher<Payload, ModelAction0> {
  return _createAction(method, (payload: Payload) => payload, takeFunction)
}

function _createAction<Payload>(
  method: Function,
  payloadCreator: (payload?: Payload) => Payload,
  takeFunction?: typeof takeEvery
) {
  const actionType = _getActionType(
    model.name,
    method.name || (model.anonymousGeneratorIndex++).toString()
  )
  const actionCreator = _createAction_by_redux_actions(
    actionType,
    payloadCreator
  ) as any
  const actionExtend: ActionExtend = {
    method,
    modelName: model.name,
    actionType,
    takeFunction: takeFunction || takeLatest
  }

  // saga put is not effect, you can't use put(action) here
  const dispatcher = function (params, dispatch) {
    const action = actionCreator(params)
    if (dispatch) {
      globalDispatch(action)
    } else {
      return action
    }
  } as any
  dispatcher.actionExtend = actionExtend
  return dispatcher
}

export function getGenerator0(
  actionCreator: Dispatcher0<ModelAction0>
): ModelGenerator0 {
  return _getActionExtendMethod(actionCreator)
}
export function getGenerator<Payload>(
  actionCreator: Dispatcher<Payload, ModelAction0>
): ModelGenerator1<ModelAction<Payload>> {
  return _getActionExtendMethod(actionCreator)
}

export function getReducer0(
  actionCreator: Dispatcher0<ModelAction0>
): ModelReducer1<any> {
  return _getActionExtendMethod(actionCreator)
}
export function getReducer<Payload>(
  actionCreator: Dispatcher<Payload, ModelAction0>
): ModelReducer2<any, ModelAction<any>> {
  return _getActionExtendMethod(actionCreator)
}

export function getActionType(actionCreator: any): string {
  return _getActionExtend(actionCreator).actionType
}

function _getActionExtendMethod(actionCreator: any) {
  return _getActionExtend(actionCreator).method
}

function _getActionExtend(actionCreator: any): ActionExtend {
  if (!actionCreator.actionExtend) {
    throw 'this is not actionCreator'
  }
  return actionCreator.actionExtend
}

type ModelGenerator0 = () => SagaIterator
type ModelGenerator1<Action> = (a: Action) => SagaIterator
type ModelReducer1<State> = (s: State) => State
type ModelReducer2<State, Action> = (s: State, a: Action) => State
type Dispatcher0<R> = () => R
type Dispatcher<T1, R> = (t1: T1, dispatch?: boolean) => R

export type ActionExtend = {
  method: any
  modelName: string
  actionType: string
  takeFunction?: typeof takeEvery
}

export class BaseSaga {
  constructor() {
    model.name = 'SAGA_' + this.constructor.name
  }
}

export class BaseReducer {
  constructor() {
    model.name = 'REDUCER_' + this.constructor.name
  }
}
