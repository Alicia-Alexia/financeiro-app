import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';

export interface Empenho {
  id?: number; 
  numeroEmpenho: string;
  dataEmpenho: string; 
  valorEmpenho: number;
  observacao: string;
  despesaId: number; 
}

interface EmpenhoState {
  empenhos: Empenho[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EmpenhoState = {
  empenhos: [],
  status: 'idle',
  error: null,
};

export const fetchEmpenhos = createAsyncThunk('empenho/fetchEmpenhos', async () => {
  const response = await api.get<Empenho[]>('/empenho');
  return response.data;
});

export const addEmpenho = createAsyncThunk(
  'empenho/addEmpenho',
  async (newEmpenho: Omit<Empenho, 'id'>) => {
    const response = await api.post<Empenho>('/empenho', newEmpenho);
    return response.data;
  }
);

export const updateEmpenho = createAsyncThunk(
  'empenho/updateEmpenho',
  async (updatedEmpenho: Empenho) => {
    const response = await api.put<Empenho>(`/empenho/${updatedEmpenho.id}`, updatedEmpenho);
    return response.data;
  }
);

export const deleteEmpenho = createAsyncThunk(
  'empenho/deleteEmpenho',
  async (id: number) => {
    await api.delete(`/empenho/${id}`);
    return id; 
  }
);

const empenhoSlice = createSlice({
  name: 'empenho',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Empenhos
      .addCase(fetchEmpenhos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEmpenhos.fulfilled, (state, action: PayloadAction<Empenho[]>) => {
        state.status = 'succeeded';
        state.empenhos = action.payload;
        state.error = null;
      })
      .addCase(fetchEmpenhos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Falha ao buscar empenhos';
      })
      // Add Empenho
      .addCase(addEmpenho.fulfilled, (state, action: PayloadAction<Empenho>) => {
        state.empenhos.push(action.payload);
        state.error = null;
      })
      .addCase(addEmpenho.rejected, (state, action) => {
        state.error = action.error.message || 'Falha ao adicionar empenho';
      })
      // Update Empenho
      .addCase(updateEmpenho.fulfilled, (state, action: PayloadAction<Empenho>) => {
        const index = state.empenhos.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.empenhos[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateEmpenho.rejected, (state, action) => {
        state.error = action.error.message || 'Falha ao atualizar empenho';
      })
      // Delete Empenho
      .addCase(deleteEmpenho.fulfilled, (state, action: PayloadAction<number>) => {
        state.empenhos = state.empenhos.filter((e) => e.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteEmpenho.rejected, (state, action) => {
        state.error = action.error.message || 'Falha ao deletar empenho';
      });
  },
});

export default empenhoSlice.reducer;