import { configureStore } from '@reduxjs/toolkit';
import despesaReducer from '../features/despesaSlice';
import empenhoReducer from '../features/empenhoSlice';
import pagamentoReducer  from '../features/pagamentoSlice';


export const store = configureStore({
  reducer: {
    despesa: despesaReducer,
    empenho: empenhoReducer,
    pagamento: pagamentoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;