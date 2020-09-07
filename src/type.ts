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

export interface ModelAction0 extends Action<any>, ModelPromise {}

export interface ModelAction<Payload> extends Action<Payload>, ModelPromise {}
