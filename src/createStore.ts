import {
  createStore as createReduxStore,
  applyMiddleware,
  combineReducers
} from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'
import { extendSagaWithPromise } from './sagaPromise'
import { generateSagas, generateReducers } from './convertor'

let storeCache = null
export const dispatch = (action: any) => {
  return storeCache.dispatch(action)
}

const createReducers = (reducerModels: Object): any => {
  const reducers = generateReducers(reducerModels)
  return combineReducers(reducers)
}

export default (
  sagaModels: any,
  errorHandler: (error: any) => void,
  disableDevTool: boolean,
  otherMiddlewares: any[]
) => {
  const sagaMiddleware = createSagaMiddleware()
  let middleware = applyMiddleware(
    extendSagaWithPromise,
    ...otherMiddlewares,
    sagaMiddleware
  )
  if (!disableDevTool) {
    middleware = composeWithDevTools(middleware)
  }
  const reducers = createReducers(sagaModels)
  const store = createReduxStore(reducers, middleware)
  const sagas = generateSagas(sagaModels, errorHandler)
  sagas.forEach((saga) => (sagaMiddleware as any).run(saga))

  storeCache = store
  return store
}
