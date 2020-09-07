import { AnyAction, Dispatch } from 'redux'

const createExposedPromise = () => {
  let resolve: (res: any) => void = null as any
  let reject: (res: any) => void = null as any
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })
  return [promise, resolve, reject]
}

export const extendSagaWithPromise: any = () => (next: Dispatch<any>) => (
  action: AnyAction
) => {
  const [promise, resolve, reject] = createExposedPromise()
  const newActions = {
    ...action,
    resolve,
    reject
  }
  next(newActions)
  return promise
}
