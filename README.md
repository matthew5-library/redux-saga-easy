# Usage

### create reducer

```javascript
import { createAction, BaseReducer, ModelAction } from 'redux-saga-easy'

class Contacts extends BaseReducer {
  initState: IStore.IContacts = {
    contact: ''
  }

  updateContacts = createAction(function updateContacts(
    state: IStore.IContacts,
    action: ModelAction<string>
  ) {
    return {
      contact: action.payload
    }
  })
}

export default new Contacts()
```

### create saga

```js
import { createAction, BaseSaga, ModelAction } from 'redux-saga-easy'
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

class Contacts extends BaseSaga {
  calculateContacts = createAction(function* get(action: ModelAction<string>) {
    yield call(delay, 1)
    yield put(reducer.updateContacts(action.payload))
  })
}

export default new Contacts()

```

### create store

```js
import { createStore } from 'redux-saga-easy'

const sagaModels = [mySaga]
const reducerModels = {
  myReducer
}

const store = createStore(
  sagaModels,
  reducerModels,
  errorHandler,
  disableDevTool,
  otherMiddlewares
)
```

##### call in page

```js
import contactsSaga from '@/redux/saga/contacts'
import contactsReducer from '@/redux/reducers/contacts'

 onChange = async () => {
    await contactsSaga.calculateContacts('18511112222', true)
    await contactsReducer.updateContacts('13022223333', true)
 }
```