import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';

export interface Despesa {
  id?: number;
  numeroProtocolo: string;
  dataProtocolo: string; 
  dataVencimento: string; 
  credor: string;
  descricao: string;
  valorDespesa: number;
  tipoDespesa: string; 
}

interface DespesaState {
  despesas: Despesa[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DespesaState = {
  despesas: [],
  status: 'idle',
  error: null,
};

export const fetchDespesas = createAsyncThunk('despesa/fetchDespesas', async () => {
  const response = await api.get<Despesa[]>('/despesa');
  return response.data;
});

export const addDespesa = createAsyncThunk(
  'despesa/addDespesa',
  async (newDespesa: Omit<Despesa, 'id'>) => {
    const response = await api.post<Despesa>('/despesa', newDespesa);
    return response.data;
  }
);

export const updateDespesa = createAsyncThunk(
  'despesa/updateDespesa',
  async (updatedDespesa: Despesa) => {
    const response = await api.put<Despesa>(`/despesa/${updatedDespesa.id}`, updatedDespesa);
    return response.data;
  }
);

export const deleteDespesa = createAsyncThunk(
  'despesa/deleteDespesa',
  async (id: number) => {
    await api.delete(`/despesa/${id}`);
    return id; 
  }
);

const despesaSlice = createSlice({
  name: 'despesa',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Despesas
      .addCase(fetchDespesas.pending, (state) => {
        state.status = 'loading';
        state.error = null; 
      })
      .addCase(fetchDespesas.fulfilled, (state, action: PayloadAction<Despesa[]>) => {
        state.status = 'succeeded';
        state.despesas = action.payload;
        state.error = null; 
      })
      .addCase(fetchDespesas.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Falha ao buscar despesas';
      })
      // Add Despesa
      .addCase(addDespesa.fulfilled, (state, action: PayloadAction<Despesa>) => {
        state.despesas.push(action.payload);
        state.error = null; 
      })
      .addCase(addDespesa.rejected, (state, action) => {
        state.error = action.error.message || 'Falha ao adicionar despesa';
      })
      // Update Despesa
      .addCase(updateDespesa.fulfilled, (state, action: PayloadAction<Despesa>) => {
        const index = state.despesas.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.despesas[index] = action.payload;
        }
        state.error = null; 
      })
      .addCase(updateDespesa.rejected, (state, action) => {
        state.error = action.error.message || 'Falha ao atualizar despesa';
      })
      // Delete Despesa
      .addCase(deleteDespesa.fulfilled, (state, action: PayloadAction<number>) => {
        state.despesas = state.despesas.filter((d) => d.id !== action.payload);
        state.error = null; 
      })
      .addCase(deleteDespesa.rejected, (state, action) => {
        state.error = action.error.message || 'Falha ao deletar despesa';
      });
  },
});

export default despesaSlice.reducer;