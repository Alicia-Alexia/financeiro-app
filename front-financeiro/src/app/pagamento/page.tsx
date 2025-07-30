'use client'; // Indica que este é um Client Component

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchPagamentos,
  addPagamento,
  updatePagamento,
  deletePagamento,
  Pagamento,
} from '../../features/pagamentoSlice';
import { fetchEmpenhos } from '../../features/empenhoSlice';
import PagamentoForm from '@/components/pagamento/PagamentoForm';
import PagamentoTable from '@/components/pagamento/PagamentoTable';
import Link from 'next/link';

const PagamentoPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pagamentos, status, error } = useSelector((state: RootState) => state.pagamento);
  const { empenhos, status: empenhosStatus } = useSelector((state: RootState) => state.empenho); // Pega os empenhos do store

  const [editingPagamento, setEditingPagamento] = useState<Pagamento | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPagamentos());
    }
    if (empenhosStatus === 'idle') {
      dispatch(fetchEmpenhos());
    }
  }, [status, empenhosStatus, dispatch]);

  const handleAddOrUpdatePagamento = async (pagamento: Omit<Pagamento, 'id'> | Pagamento) => {
    try {
      if (editingPagamento) {
        await dispatch(updatePagamento(pagamento as Pagamento)).unwrap();
      } else {
        await dispatch(addPagamento(pagamento as Omit<Pagamento, 'id'>)).unwrap();
      }
      setEditingPagamento(null);
      setShowForm(false);
      dispatch(fetchPagamentos());
    } catch (err) {
      console.error('Failed to save pagamento:', err);
    }
  };

  const handleDeletePagamento = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este pagamento?')) {
      try {
        await dispatch(deletePagamento(id)).unwrap();
        dispatch(fetchPagamentos());
      } catch (err) {
        console.error('Failed to delete pagamento:', err);
      }
    }
  };

  const handleEditClick = (pagamento: Pagamento) => {
    setEditingPagamento(pagamento);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setEditingPagamento(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-inter">
      <header className="bg-indigo-700 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciador de Pagamentos</h1>
        <nav className="flex gap-x-4">
          <Link href="/" passHref>
            <button className="px-5 py-2 rounded-lg bg-white text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-75 transition-all duration-200 font-semibold shadow-sm">
              Ir para Despesas
            </button>
          </Link>
          <Link href="/empenho" passHref>
            <button className="px-5 py-2 rounded-lg bg-white text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-75 transition-all duration-200 font-semibold shadow-sm">
              Ir para Empenhos
            </button>
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto">
        {status === 'loading' && (
          <div className="text-center text-indigo-600 mb-4">Carregando pagamentos...</div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Erro: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          {!showForm && (
            <h2 className="text-2xl font-bold text-gray-800">Lista de Pagamentos</h2>
          )}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Adicionar Novo Pagamento
            </button>
          )}
        </div>

        {showForm && (
          <PagamentoForm
            initialData={editingPagamento}
            onSubmit={handleAddOrUpdatePagamento}
            onCancel={handleCancelForm}
          />
        )}

        {!showForm && (
          <PagamentoTable
            pagamentos={pagamentos}
            empenhos={empenhos}
            onEdit={handleEditClick}
            onDelete={handleDeletePagamento}
          />
        )}
      </main>

      <footer className="text-center mt-10 text-gray-500 text-sm">
        Desenvolvido por Alicia
      </footer>
    </div>
  );
};

export default PagamentoPage;