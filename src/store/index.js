import {combineReducers, createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {createLogger} from 'redux-logger';

import {createPermissionControlMiddleware} from './middlewares';
import rootSaga from './sagas';
import {user} from './user';
import {product} from './product';
import {home} from './home';
import {search} from './search';
import {order} from './order';
import {others} from './others';
import {address} from './address';
import {config} from './config';
import {store} from './store';
import {system} from './system';
import {video} from './video';
import {timer, types} from './timer';


const sagaMiddleware = createSagaMiddleware();

const permissionControlMiddleware = createPermissionControlMiddleware();

const logger = createLogger({
  predicate: (_, action) => (
    action.type !== types.UPDATE_TIMER
  ),
  collapsed: true,
});


export let reducers = combineReducers({
  user,
  product,
  search,
  order,
  others,
  address,
  config,
  store,
  system,
  home,
  timer,
  video,
});


export default createStore(
  reducers,
  applyMiddleware(
    permissionControlMiddleware,
    sagaMiddleware,
    logger,
  ),
);


sagaMiddleware.run(rootSaga);
