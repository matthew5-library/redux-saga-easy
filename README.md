# redux-saga-easy

A simple and easy way for redux-saga

### Usage

check the demo here

https://github.com/matthew5-template/react-ts-app/tree/redux-saga-easy

### 1. create a saga model include sagaAction and reducerAction

```javascript
import {
  createSaga,
  createReducer,
  SagaModel,
  ModelAction
} from 'redux-saga-easy'
import {
  all,
  call,
  put,
  takeEvery,
  takeLatest,
  select,
  take
} from 'redux-saga/effects'
import reducer from '@/redux/reducers/contacts'

const delay = (second: number) => {
  return new Promise((resolve) => setTimeout(resolve, 1000 * second))
}

class Contacts extends SagaModel {
  initState: IStore.IContacts = {
    contact: 0
  }

  setContacts = createReducer(function setContacts(
    state: IStore.IContacts,
    action: ModelAction<number>
  ) {
    return {
      contact: action.payload
    }
  })

  calculateContacts = createSaga(function* calculateContacts(
    action: ModelAction<number>
  ) {
    yield call(delay, 1)
    const result = action.payload * 2
    return result
  })

  updateContacts = createSaga(function* updateContacts(
    this: Contacts,
    action: ModelAction<number>
  ) {
    const result = yield yield put(this.calculateContacts(action.payload))
    yield put(this.setContacts(result))
  })
}

export default new Contacts()
```

### 2. create store by sagaModels

```javascript
import { createStore } from 'redux-saga-easy'
import contacts from '@/redux/saga/contacts'

const sagaModels = {
  contacts
}

const store = createStore(
  sagaModels,
  errorHandler,
  disableDevTool,
  otherMiddlewares
)
```

### 3. dispatch action on pages

```javascript
import contactsSaga from '@/redux/saga/contacts'

onChange = async () => {
  await contactsSaga.updateContacts(100, true)
  await contactsSaga.setContacts(100, true)
}
```
