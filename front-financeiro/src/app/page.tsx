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
      <header className="bg-indigo-700 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciador de Despesas</h1>
        <nav className="flex gap-x-4">
          <Link href="/empenho" passHref>
            <button className="px-5 py-2 rounded-lg bg-white text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-75 transition-all duration-200 font-semibold shadow-sm">
              Ir para Empenhos
            </button>
          </Link>
          <Link href="/pagamento" passHref>
            <button className="px-5 py-2 rounded-lg bg-white text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-75 transition-all duration-200 font-semibold shadow-sm">
              Ir para Pagamentos
            </button>
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
