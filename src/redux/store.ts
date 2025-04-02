import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice';
import storage from "redux-persist/lib/storage/session"; // Use session storage
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const persistedCartReducer = persistReducer(persistConfig, cartReducer);

// Create store instance rather than factory function
const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    // other reducers...
  },
})

export const persistor = persistStore(store);

export type AppStore = typeof store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;