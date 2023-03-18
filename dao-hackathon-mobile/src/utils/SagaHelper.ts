import { ACTION } from '@src/redux';
import { all, call, put, race, take, takeEvery } from 'redux-saga/effects';

export function success(type: string) {
  return `${type}_success`;
}
export function fail(type: string) {
  return `${type}_fail`;
}
function* APINetwork(request: any, action: any): Generator<any> {
  const act = action;
  try {
    const res: any = yield race({
      task: call(request, act.payload),
      cancel: take(ACTION.CANCEL),
    });
    if (res.cancel) {
    } else {
      yield put({
        type: success(act.type),
        payload: res.task.data,
        params: act.payload,
      });
    }
  } catch (error) {
    console.log('saga', error);
    yield put({ type: fail(act.type), payload: act.payload, error: error });
  }
}

function* APINetworkAll(request: any, action: any): Generator<any> {
  const act = action;
  if (!act.payload || act.payload.length === 0) {
    act.payload = [{}, {}];
  }
  try {
    const res: any = yield all(
      request.map((req: any, idx: number) => call(req, act.payload[idx])),
    );
    yield put({
      type: success(act.type),
      payload: res.map((e: any) => e.data),
      params: act.payload,
    });
  } catch (error) {
    console.log('saga', error);
    yield put({ type: fail(act.type), payload: act.payload, error: error });
  }
}

export function SagaHelper(action: any, request: any) {
  return takeEvery(action, APINetwork, request);
}

export function SagaHelperAll(action: any, ...request: any) {
  return takeEvery(action, APINetworkAll, request);
}
