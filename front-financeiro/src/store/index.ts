import { configureStore } from '@reduxjs/toolkit';
import despesaReducer from '../features/despesaSlice';


export const store = configureStore({
  reducer: {
    despesa: despesaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;