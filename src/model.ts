import { createAction as createAction_by_redux_actions } from 'redux-actions'
import { takeLatest, takeEvery } from 'redux-saga/effects'
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

export function createSaga0(
  generator: ModelGenerator0,
  takeFunction?: typeof takeEvery
): Dispatcher0<ModelAction0> {
  return createAction(generator, () => {}, takeFunction, true)
}
export function createSaga<Payload>(
  generator: ModelGenerator1<ModelAction<Payload>>,
  takeFunction?: typeof takeEvery
): Dispatcher<Payload, ModelAction0> {
  return createAction(
    generator,
    (payload: Payload) => payload,
    takeFunction,
    true
  )
}

export function createReducer0(
  reducer: ModelReducer1<ModelAction<any>>
): Dispatcher0<ModelAction0> {
  return createAction(reducer, () => {})
}
export function createReducer<Payload>(
  reducer: ModelReducer2<any, ModelAction<Payload>>
): Dispatcher<Payload, ModelAction0> {
  return createAction(reducer, (payload: Payload) => payload)
}

function createAction<Payload>(
  method: Function,
  payloadCreator: (payload?: Payload) => Payload,
  takeFunction?: typeof takeEvery,
  isCreateSaga?: boolean
) {
  const type = isCreateSaga ? 'Saga' : 'Reducer'
  const actionType = _getActionType(
    model.name,
    `${type}.${method.name || (model.anonymousGeneratorIndex++).toString()}`
  )
  const actionCreator = createAction_by_redux_actions(
    actionType,
    payloadCreator
  ) as any
  const actionExtend: ActionExtend = {
    method,
    modelName: model.name,
    actionType,
    takeFunction: takeFunction || takeLatest,
    type
  }

  // saga put is not effect, you can't use put(action) here
  const dispatcher = function (params, dispatch) {
    // for createSaga0
    if (typeof params === 'boolean' && dispatch === undefined) {
      dispatch = params
      params = undefined
    }
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
type Dispatcher0<R> = (dispatch?: boolean) => R
type Dispatcher<T1, R> = (t1: T1, dispatch?: boolean) => R

export type ActionExtend = {
  method: any
  modelName: string
  actionType: string
  takeFunction?: typeof takeEvery
  type: 'Saga' | 'Reducer'
}

export class SagaModel {
  constructor() {
    model.name = this.constructor.name
    this.createReducers()
    this.createSagas()
  }

  createReducers() {
    // this.reducers
  }
  createSagas() {
    // this.sagas
  }
}
