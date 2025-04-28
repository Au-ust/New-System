import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 使用本地存储
import collapsedReducer from './reducers/CollapsedReducer';
import loadingReducer from './reducers/LoadingReducer';
import { combineReducers } from 'redux';

//合并所有 reducer
const rootReducer = combineReducers({
   collapsed: collapsedReducer,
    loadingReducer: loadingReducer,
});
//配置持久化
const persistConfig = {
  key: 'change_loading',
  storage,
  blacklist: ['loadingReducer'], // 不需要持久化的 reducer放黑名单里
};

//生成持久化 reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

//创建 store
export const store = configureStore({
  reducer: persistedReducer,
  //防止控制台报错
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
});

//创建 persistor
export const persistor = persistStore(store);
