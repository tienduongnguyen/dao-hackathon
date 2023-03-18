/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Reactotron from '@src/utils/ReactotronConfig';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import { ACTION } from './actions';
import reducers from './reducers';
import rootSaga from './sagas';

const sagaMonitor = Reactotron.createSagaMonitor!();
const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
const composeEnhancers = composeWithDevTools({
  // Specify here name, actionsBlacklist, actionsCreators and other options
});
const appReducer = combineReducers(reducers);
const connectReducer = (state: any, action: any) => {
  if (action.type === ACTION.RESET) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};
const store = createStore(
  connectReducer,
  {},
  composeEnhancers(
    applyMiddleware(sagaMiddleware),
    Reactotron.createEnhancer!(),
  ),
);
sagaMiddleware.run(rootSaga);

export default store;

export type RootState = ReturnType<typeof appReducer>;
