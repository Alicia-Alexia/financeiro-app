'use client'; 

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  fetchDespesas,
  addDespesa,
  updateDespesa,
  deleteDespesa,
  Despesa,
} from '../features/despesaSlice';
import DespesaForm from '../components/despesa/DespesaForm';
import DespesaTable from '../components/despesa/DespesaTable';
import Link from 'next/link';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { despesas, status, error } = useSelector((state: RootState) => state.despesa);

  const [editingDespesa, setEditingDespesa] = useState<Despesa | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDespesas());
    }
  }, [status, dispatch]);

  const handleAddOrUpdateDespesa = async (despesa: Omit<Despesa, 'id'> | Despesa) => {
    try {
      if (editingDespesa) {
        await dispatch(updateDespesa(despesa as Despesa)).unwrap();
      } else {
        await dispatch(addDespesa(despesa as Omit<Despesa, 'id'>)).unwrap();
      }
      setEditingDespesa(null);
      setShowForm(false);
      dispatch(fetchDespesas());
    } catch (err) {
      console.error('Failed to save expense:', err);
    }
  };

  const handleDeleteDespesa = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      try {
        await dispatch(deleteDespesa(id)).unwrap();
        dispatch(fetchDespesas());
      } catch (err) {
        console.error('Failed to delete expense:', err);
      }
    }
  };

  const handleEditClick = (despesa: Despesa) => {
    setEditingDespesa(despesa);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setEditingDespesa(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-inter">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Gerenciador de Despesas</h1>
        <nav className="mt-4 flex justify-center space-x-4"> 
          <Link href="/empenho" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Ir para Empenhos
          </Link>
          <Link href="/pagamento" className="text-indigo-600 hover:text-indigo-800 font-medium"> 
            Ir para Pagamentos
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto">
        {status === 'loading' && (
          <div className="text-center text-indigo-600 mb-4">Carregando despesas...</div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Erro: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          {!showForm && (
            <h2 className="text-2xl font-bold text-gray-800">Lista de Despesas</h2>
          )}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Adicionar Nova Despesa
            </button>
          )}
        </div>

        {showForm && (
          <DespesaForm
            initialData={editingDespesa}
            onSubmit={handleAddOrUpdateDespesa}
            onCancel={handleCancelForm}
          />
        )}

        {!showForm && <DespesaTable despesas={despesas} onEdit={handleEditClick} onDelete={handleDeleteDespesa} />}
      </main>

      <footer className="text-center mt-10 text-gray-500 text-sm">
        Desenvolvido por Alicia
      </footer>
    </div>
  );
};

export default Home;
