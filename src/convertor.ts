import { all, call } from 'redux-saga/effects'
import { handleActions } from 'redux-actions'
import { ActionExtend } from './model'
import { SagaIterator } from 'redux-saga'
import { ModelAction } from './type'

const sagaWrapper = (
  saga: (action: ModelAction<any>) => void,
  errorHandler?: (error: any) => void
) =>
  function* (action: ModelAction<any>) {
    try {
      const res = yield call(saga, action)
      action.resolve(res)
    } catch (error) {
      console.error('error occurred in saga', action)
      yield errorHandler && call(errorHandler, error)
      action.reject(error)
    }
  }

export function generateSagas(
  sagaModels: any,
  errorHandler?: (error: any) => void
): SagaIterator[] {
  const _actionTypeCache: string[] = []
  const _modelNameCache: string[] = []

  const sagas = []
  for (const key in sagaModels) {
    const model = sagaModels[key]
    const watchList: any = []
    let currentModelName
    for (const key in model) {
      const actionExtend = model[key].actionExtend as ActionExtend
      if (actionExtend && actionExtend.type === 'Saga') {
        const { method, modelName, actionType, takeFunction } = actionExtend
        if (_modelNameCache.includes(modelName)) {
          throw `throw by duplicate saga model name: ${modelName}, add a different model name :)`
        }
        if (_actionTypeCache.includes(actionType)) {
          throw `throw by duplicate action type: ${actionType}, add a different generator name in createAction :)`
        } else {
          _actionTypeCache.push(actionType)
        }
        currentModelName = modelName

        const wrapper = function* () {
          yield takeFunction(actionType, sagaWrapper(method, errorHandler))
        }
        watchList.push(call(wrapper))
      }
    }
    currentModelName && _modelNameCache.push(currentModelName)

    const saga = function* () {
      yield all(watchList)
    }
    sagas.push(saga)
  }

  return sagas
}

export function generateReducers(reducerModels: object): object {
  const _actionTypeCache: string[] = []
  const _modelNameCache: string[] = []
  const reducers: any = {}
  for (const reducerKey in reducerModels) {
    const reducerModel = (reducerModels as any)[reducerKey]
    reducers[reducerKey] = generateReducer(
      reducerModel,
      _modelNameCache,
      _actionTypeCache
    )
  }
  return reducers
}

export function generateReducer(
  reducerModel: any,
  _modelNameCache?: string[],
  _actionTypeCache?: string[]
) {
  const initState = reducerModel.initState
  if (!initState) {
    throw `throw by lost init state in reducer model`
  }
  const reducerMap = {}
  let currentModelName
  for (const key in reducerModel) {
    const actionExtend = reducerModel[key].actionExtend as ActionExtend
    if (actionExtend && actionExtend.type === 'Reducer') {
      const { method, modelName, actionType } = actionExtend
      if (_modelNameCache) {
        if (_modelNameCache.includes(modelName)) {
          throw `throw by duplicate reducer model name: ${modelName}, add a different model name :)`
        }
      }
      if (_actionTypeCache) {
        if (_actionTypeCache.includes(actionType)) {
          throw `throw by duplicate action type: ${actionType}, add a different generator name in createAction :)`
        } else {
          _actionTypeCache.push(actionType)
        }
      }
      currentModelName = modelName
      ;(reducerMap as any)[actionType] = method
    }
  }
  currentModelName && _modelNameCache && _modelNameCache.push(currentModelName)
  return handleActions(reducerMap, initState)
}
