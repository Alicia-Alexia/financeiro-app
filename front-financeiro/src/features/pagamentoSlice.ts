import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';

export interface Pagamento {
  id?: number; 
  numeroPagamento: string;
  dataPagamento: string; // Usaremos string para facilitar a manipulação de data
  valorPagamento: number;
  observacao: string;
  empenhoId: number; // Chave estrangeira para Empenho
}

// Definição do estado inicial do slice
interface PagamentoState {
  pagamentos: Pagamento[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PagamentoState = {
  pagamentos: [],
  status: 'idle',
  error: null,
};

export const fetchPagamentos = createAsyncThunk('pagamento/fetchPagamentos', async () => {
  const response = await api.get<Pagamento[]>('/pagamento');
  return response.data;
});

export const fetchPagamentosByEmpenhoId = createAsyncThunk(
  'pagamento/fetchPagamentosByEmpenhoId',
  async (empenhoId: number) => {
    const response = await api.get<Pagamento[]>(`/pagamento/empenho/${empenhoId}`);
    return response.data;
  }
);

export const addPagamento = createAsyncThunk(
  'pagamento/addPagamento',
  async (newPagamento: Omit<Pagamento, 'id'>) => {
    const response = await api.post<Pagamento>('/pagamento', newPagamento);
    return response.data;
  }
);

export const updatePagamento = createAsyncThunk(
  'pagamento/updatePagamento',
  async (updatedPagamento: Pagamento) => {
    const response = await api.put<Pagamento>(`/pagamento/${updatedPagamento.id}`, updatedPagamento);
    return response.data;
  }
);

export const deletePagamento = createAsyncThunk(
  'pagamento/deletePagamento',
  async (id: number) => {
    await api.delete(`/pagamento/${id}`);
    return id; 
  }
);

const pagamentoSlice = createSlice({
  name: 'pagamento',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Pagamentos
      .addCase(fetchPagamentos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPagamentos.fulfilled, (state, action: PayloadAction<Pagamento[]>) => {
        state.status = 'succeeded';
        state.pagamentos = action.payload;
        state.error = null;
      })
      .addCase(fetchPagamentos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Falha ao buscar pagamentos';
      })
      // Fetch Pagamentos By Empenho ID
      .addCase(fetchPagamentosByEmpenhoId.pending, (state) => {
        state.status = 'loading'; 
        state.error = null;
      })
      .addCase(fetchPagamentosByEmpenhoId.fulfilled, (state, action: PayloadAction<Pagamento[]>) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchPagamentosByEmpenhoId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Falha ao buscar pagamentos por empenho';
      })
      // Add Pagamento
      .addCase(addPagamento.fulfilled, (state, action: PayloadAction<Pagamento>) => {
        state.pagamentos.push(action.payload);
        state.error = null;
      })
      .addCase(addPagamento.rejected, (state, action) => {
        state.error = action.error.message || 'Falha ao adicionar pagamento';
      })
      // Update Pagamento
      .addCase(updatePagamento.fulfilled, (state, action: PayloadAction<Pagamento>) => {
        const index = state.pagamentos.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.pagamentos[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePagamento.rejected, (state, action) => {
        state.error = action.error.message || 'Falha ao atualizar pagamento';
      })
      // Delete Pagamento
      .addCase(deletePagamento.fulfilled, (state, action: PayloadAction<number>) => {
        state.pagamentos = state.pagamentos.filter((p) => p.id !== action.payload);
        state.error = null;
      })
      .addCase(deletePagamento.rejected, (state, action) => {
        state.error = action.error.message || 'Falha ao deletar pagamento';
      });
  },
});

export default pagamentoSlice.reducer;