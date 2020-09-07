interface Action<Payload> {
  type: string
  payload?: Payload
  error?: boolean
}

interface ModelPromise {
  resolve: Function
  reject: Function
  then: Function
}

interface ModelAction0 extends Action<any>, ModelPromise {}

interface ModelAction<Payload> extends Action<Payload>, ModelPromise {}

export { ModelAction0, ModelAction }
