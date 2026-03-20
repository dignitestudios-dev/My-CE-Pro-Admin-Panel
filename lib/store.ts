// store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // ✅ uses localStorage

import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import notificationReducer from './slices/notificationSlice';
import professionReducer from './slices/professionSlice';
import reportsReducer from './slices/reportsSlice';
import dashboardReducer from './slices/dashboardSlice';
import chatReducer from './slices/chatSlice';

// ─── Per-slice persist configs ────────────────────────────────────────────────

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  // only persist the fields you actually need across sessions
  whitelist: ['token', 'isAuthenticated', 'user'],
};

const userPersistConfig = {
  key: 'users',
  storage: storage,
  whitelist: ['currentUser', 'preferences'],
};

// Slices you DON'T want to persist at all – just leave them out of a
// persistReducer wrapper and they'll reset on every app launch.
// e.g. notifications, dashboard live data, chat drafts, etc.

// ─── Root reducer ─────────────────────────────────────────────────────────────

const rootReducer = combineReducers({
  auth:         persistReducer(authPersistConfig, authReducer),
  users:        persistReducer(userPersistConfig, userReducer),
  // ↓ these slices are intentionally NOT persisted
  notification: notificationReducer,
  profession:   professionReducer,
  reports:      reportsReducer,
  dashboard:    dashboardReducer,
  chat:         chatReducer,
});

// ─── Store ────────────────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist dispatches these non-serializable actions internally
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;