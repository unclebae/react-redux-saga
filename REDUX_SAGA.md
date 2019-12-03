# Redux Saga 이용하기. 

이번에는 Saga 에 대해서 알아보겠습니다. 

## Saga 패턴을 간단히 말하면

saga 는 각각 서비스의 로컬 트랜잭션의 시퀀스를 말합니다. 각 로컬 트랜잭션은 자신이 담당하고 있는 데이터베이스를 수정하고, 메시지를 발생시키거나, 이벤트가 다음 로컬 트랜잭션에 트리거 됩니다. 이로인해서 연관된 트랜잭션 처리가 수행이 됩니다. 

만약 로컬 트랜잭션이 실패하면, saga 는 보상 트랜잭션이 동작하는 방식입니다. 

## react 에서 saga 

react 에서 redux 를 이용하여 상태를 관리합니다. 이러한 상태 관리를 수행할때 리덕스만 사용하여도 문제없이 개발을 진행할 수 있으나, redux 상태는 synchronous 하게 관리됩니다. 즉, 요청에 대해서 블록이 일어나고, 원하는 처리를 동시에 처리할 수 없는 현상이 발생합니다. 

서버에서 데이터를 가져와서 화면을 그려줄때, 서버응답이 느려진다면 상태 반영시 대기 상태가 발생됩니다. 

이럴때 redux-thunk 나 redux-saga 를 이용하면 비동기 이벤트 처리를 수행할 수 있는 장점이 생깁니다. 

특히 redux-saga 는 이벤트를 발생하는경우 saga 에 저장되고, 모든 이벤트를 처리할지, 마지막 이벤트를 처리할지 등을 구분해서 처리할 수 있습니다. 

## redux saga 설치하기. 

```
npm install redux-saga 
```

## axios 설치하기. 

axios 는 서버로부터 데이터를 fetch 해올 때 주로 이용하는 도구로 최근 인기가 많습니다. 

이를 설치하는 이유는 보통 서버에서 데이터를 패치해와서 화면에 노출할때 fetch 시간이 가장 많이 소요되므로 이 부분을 주로 동기화 해주면 됩니다. 

샘플을 위해서 다음과 같이 설치 해주세요. 

```
npm install axios
```

## ReduxSaga 이용하기

redux-saga 는 미들웨어라고 부릅니다. 미들웨어는 다음과 같이 동작합니다. 

```action dispatch --> 미들웨어 --> 미들웨어 2 --> Reducer --> Store ```

위와 같이 액션이 발생하면, redux 에서 보았듯이 dispatch 를 수행하여 이벤트를 리듀서를 전달합니다. 

미들웨어를 사용하지 않으면 바로 리듀서로 액션이 전달되지만, 미들웨어를 사용하면 전달된 이벤트는 미들웨어가 받습니다. 그리고 미들웨어에서 필요한 처리를 수행하고, 다음 미들웨어로 전달합니다. 

그리고 액션이 리듀서에 전달되면 최종적으로 스토어에 있는 상태가 변경이 됩니다. 

이런 미들웨어인 redux-saga 는 이벤트를 받고 받은 이벤트가 자신이 워치 하고 있는 액션인지 확인합니다. 

확인이 완료되면 내부적으로 스레드를 새로 만들어서 비동기로 특정 메소드를 수행합니다. 

메소드가 수행되고 나면 결과를 리듀서에 전달합니다. 

## 적용해보기. 

이전에 수행했던 Counter 예제를 그대로 사용합니다. 

### 액션 타입 생성하기. 

actions/actionTypes.js 에 다음과 같이 코드를 추기해줍니다. 

```
...
// 비동기 처리
export const INCREMENT_10_ASYNC = "INCREMENT_10_ASYNC";
export const INCREMENT_10_DONE = "INCREMENT_10_DONE";
export const DECREMENT_10_ASYNC = "DECREMENT_10_ASYNC";
export const DECREMENT_10_DONE = "DECREMENT_10_DONE";
```

위 코드에서 ASYNC 는 카운터 숫자를 증가/감소 시키는 ACTION 타입입니다. 그리고 DONE은 saga 를 이용하고 난뒤 액션이 완료 되었음을 알려주는 액션이 됩니다. 

### 액션 수정

이제 비동기 액션을 생성해 보겠습니다. 

actions/index.js 코드를 아래와 같이 수정합니다. 

```
import {
  INCREMENT,
  INCREMENT_10,
  DECREMENT,
  DECREMENT_10,
  INCREMENT_10_ASYNC,
  DECREMENT_10_ASYNC
} from "./actionTypes";

export const increment = () => ({ type: INCREMENT, payload: 1 });
export const increment_10 = () => ({ type: INCREMENT_10, payload: 10 });
export const decrement = () => ({ type: DECREMENT, payload: -1 });
export const decrement_10 = () => ({ type: DECREMENT_10, payload: -10 });

// 새로 추가된 부분 
export const increment_10_async = () => ({ type: INCREMENT_10_ASYNC, payload: 10 });
export const decrement_10_async = () => ({ type: DECREMENT_10_ASYNC, payload: -10 });

```

늘 보는것과 같이 액션을 2개 추가했습니다. 

ASYNC 이벤트에 대한 액션만 추가했고, DONE 은 액션을 만들 필요가 없습니다. 왜냐하면 saga 에서 사용할 것이기 때문입니다. 

### 리듀서 추가하기. 

이제는 액션을 만들었으니 리듀서를 추가해 보겠습니다. 

결국 리듀서가 상태를 변경할 것이기 때문에 우리가 만든 액션에 대한 리듀서가 추가되어야 합니다. 

```
import {
  INCREMENT,
  INCREMENT_10,
  DECREMENT,
  DECREMENT_10,
  INCREMENT_10_ASYNC,
  INCREMENT_10_DONE,
  DECREMENT_10_ASYNC,
  DECREMENT_10_DONE
} from "../actions/actionTypes";

// loading 상태를 추가합니다. 
const initialState = {
  num: 0,
  loading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT:
      return { num: state.num + action.payload };
    case INCREMENT_10:
      return { num: state.num + action.payload };
    case DECREMENT:
      return { num: state.num + action.payload };
    case DECREMENT_10:
      return { num: state.num + action.payload };

    //   새로 추가된 부분 
    case INCREMENT_10_ASYNC:
      return { ...state, loading: true };
    case INCREMENT_10_DONE:
      return { num: state.num + action.payload, loading: false };
    case DECREMENT_10_ASYNC:
      return { ...state, loading: true };
    case DECREMENT_10_DONE:
      return { num: state.num + action.payload, loading: false };
    default:
      return state;
  }
};

export default reducer;

```

state 값으로 loading 을 추가 했습니다. 이 용도는 비동기 처리시에 시간이 오래걸리는 경우 프로그래스를 알려주는 스피너를 노출해주기 위함입니다 .

![spinner](./imgs/Loading_spinner.gif)

위와 같은 스피너가 나타날 것입니다. 

그리고 다음으로 4개의 리듀서를 작성했습니다. 

ASYNC 계열 액션은 버튼을 클릭했다는 상태를 처리하기 위한 것이며, 스피너가 나타나게 하기 위해서 loading:true 로 기존 상태값을 추가해 주었습니다. 

참고로 ...state 는 state 상태를 새롭게 복사한다는 의미입니다. 

DONE 계열 액션은 실제로 saga 미들웨어에서 생성한 이벤트를 발생시키고, 리듀서가 받게 됩니다. 그리고 최종적으로 카운트를 증가 시키고, loading:false 로 스피너를 감추게 됩니다. 

지금까지 이야기를 들어보면 이해 가시죠? 

1. 버튼클릭: INCREMENT_10_ASYNC 액션이 dispatch 됩니다. 
2. dispatch 된 액션을 saga 미들웨어가 받습니다. 
    받은 액션은 비동기로 수행이 되며, INCREMENT_10_ASYNC 도 리듀서로 전달됩니다. 리듀서는 스피너를 노출 시킵니다. 
3. saga 가 처리를 마치면 액션을 새로 만들어서 Reducer 전달합니다. 
4. 리듀서가 최종적으로 카운트를 증가시키고, 스피너를 닫도록 상태를 바꿉니다. 

### saga 코드 작성하기 

이제 드디어 saga 코드를 작성할 때입니다. 

sagas/index.js 에 다음과 같이 작성해줍니다. 

```
import {
  INCREMENT_10_ASYNC,
  INCREMENT_10_DONE,
  DECREMENT_10_ASYNC,
  DECREMENT_10_DONE
} from "../actions/actionTypes";

// 서버로부터 데이터를 패치해오는 역할을 하는 axios 를 임포트 합니다. 
import axios from "axios";

// saga 에서 put, get, takeLatest, takeEvery, all 등 다양한 메소드를 이용할 수 있습니다. 
// https://redux-saga.js.org/docs/api/ 에서 참고하시면 좋습니다. 
import { put, takeLatest, all } from "redux-saga/effects";

// 10을 더하는 액션이 들어오면 Watcher 가 동작합니다. 
// yield* 는 전체 이벤트 시퀀스를 만들어주는 역할을 하는 saga 입니다. 
function* add10Watcher() {
  // takeLatest 는 동일한 액션이 동시에 여러번 들어오는 경우라도 마지막 하나만 수행하도록 합니다. 
  yield takeLatest(INCREMENT_10_ASYNC, add10Async);
}

// 아래 함수는 takeLatest 가 액션을 감지하고 나서 수행할 함수입니다. 
// 이것도 saga 에 추가해주어야 하기 대문에 yield* 를 사용했습니다. 
function* add10Async() {
  yield axiosTest();
  yield put({ type: INCREMENT_10_DONE, payload: 10 });
}

// 아래 코드들은 위와 동일합니다. 
function* sub10Watcher() {
  yield takeLatest(DECREMENT_10_ASYNC, sub10Async);
}

function* sub10Async() {
   yield axiosTest();
  yield put({ type: DECREMENT_10_DONE, payload: -10 });
}

// 사가를 하나로 취합하여 rootSaga 를 만듭니다. 
export default function* rootSaga() {
  yield all([add10Watcher(), sub10Watcher()]);
}

// 시간이 오래 걸리는 작업을 해주기 위해서 axios 를 이용하여 
function* axiosTest() {
  const json = yield axios
    .get(
      "https://newsapi.org/v1/articles?source=cnn&apiKey=c39a26d9c12f48dba2a5c00e35684ecc"
    )
    .then(response => {
        console.log(response);
        return response;
    });
}

```

우선 추가한 액션타입을 임포트 합니다. 

그리고 axios 를 이용하여 서버에서 데이터를 패치해 올 수 있도록 임포트 해줍니다. 

import axios from 'axois';

redux-saga 에서 사용할 함수들을 임포트 합니다. 이 함수들은 redux-saga/effects 로부터 가져옵니다. 

자세한 정보는 [saga api](https://redux-saga.js.org/docs/api/) 에서 확인합니다 .

그리고 이제는 액션이 디스패치되면 해당 액션을 워치하도록 워치를 등록합니다. 

```
function* add10Watcher() {
  // takeLatest 는 동일한 액션이 동시에 여러번 들어오는 경우라도 마지막 하나만 수행하도록 합니다. 
  yield takeLatest(INCREMENT_10_ASYNC, add10Async);
}
```

takeLetest 는 특정 액션이 동시에 어려번 들어오더라도 마지막 한번만 인식되도록 합니다. 그리고 add10Async 는 미들웨어 처리를 수행할 함수를 기술해 줍니다. 

takeEvery 를 이용한다면 누른 모든 액션을 캐치하고 미들웨어 처리 할 수 있게 됩니다. 

더하기를 했다면 빼기도 동일하게 작업해 주면 됩니다. 

#### 오래 걸리는 작업 알아보기. 

```
function* add10Async() {
  yield axiosTest();
  yield put({ type: INCREMENT_10_DONE, payload: 10 });
}

function* axiosTest() {
  const json = yield axios
    .get(
      "https://newsapi.org/v1/articles?source=cnn&apiKey=c39a26d9c12f48dba2a5c00e35684ecc"
    )
    .then(response => {
        console.log(response);
        return response;
    });
}

```

위 함수를 보면 axiosTest() 함수를 호출하며, 이 함수는 axios 를 이용하여 newsapi.org 에서 뉴스 하나를 읽어옵니다. 이 뉴스를 읽어오는 것은 약간의 시간이 걸리기 때문에 saga 를 이용하기 좋은 예가 될것입니다. 

그리고 해당 과정이 끝나고 나면 yield put() 을 이용하여, 완료되었음을 알리는 액션을 다음 미들웨어나, 리듀서로 전달해줍니다. 

#### 루트 사가 생성하기

```
export default function* rootSaga() {
  yield all([add10Watcher(), sub10Watcher()]);
}
```

all 함수를 이용하여 워쳐를 등록해 줍니다. 이렇게 되면 saga 에 대한 정의를 모두 수행한 것입니다. 

## 통합해서 사용하기. 

이제는 saga 도 만들고, 액션, 리듀서도 만들었으니 이것을 모두 합쳐서 루트 엘리먼트에서 통합해줍니다. 

src/index.js 파일을 다음과 같이 작업해줍니다. 

```
...

import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { logger } from "redux-logger";

import reducer from "./reducers";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducer, applyMiddleware(sagaMiddleware, logger));

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

...

```

sagaMiddleware 를 createSagaMiddleware 를 생성했습니다. 

그리고 applyMiddleware 를 이용하여 saga 미들웨어를 등록합니다. 

sagaMiddleware.run(rootSaga) 를 이용하여 saga를 동작하도록 만들어 줍니다. 

## 컴포넌트 생성하고 이용하기. 

그리고 axios 를 이용할때 스피닝이 나타날 수 있도록 LoadingContainer 를 만들어 줍니다. 

containers/LoadingContainer.js 파일을 다음과 같이 만들어 줍니다. 

```
import React from "react";
import { connect } from "react-redux";
import spinner from "../imgs/Loading_spinner.gif";

const Loading = ({ loading }) =>
  loading ? (
    <div>
      <img src={spinner} alt="loading spinner" />
      <span>Loading....</span>
    </div>
  ) : null;

const mapStateToProps = state => ({
  loading: state.counter.loading
});

export default connect(mapStateToProps, null)(Loading);

```

이 컨테이너를 사용하기 위해서 다음과 같이 app.js 를 수정해줍니다. 

src/App.js 

```
import React from "react";
import ButtonContainer from "./containers/ButtonContainer";
import CountContainer from "./containers/CountContainer";
import LoadingContainer from "./containers/LoadingContainer";

function App() {
  return (
    <div>
      <ButtonContainer />
      <hr />
      <LoadingContainer />
      <CountContainer />
    </div>
  );
}

export default App;
```

## 결론

지금까지 redux-saga 를 살펴보았습니다. 

saga를 이용하면 비동기로 state 를 변경할 수 있고, 이렇게 비동기를 이용하여 SPA 를 더욱 SPA 답게 만들어줄 수 있습니다. 
