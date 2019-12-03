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
