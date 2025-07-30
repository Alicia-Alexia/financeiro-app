'use client'; // Indica que este é um Client Component

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchEmpenhos,
  addEmpenho,
  updateEmpenho,
  deleteEmpenho,
  Empenho,
} from '../../features/empenhoSlice';
import { fetchDespesas } from '@/features/despesaSlice';
import { fetchPagamentosByEmpenhoId, Pagamento } from '../../features/pagamentoSlice'; 
import EmpenhoForm from '../../components/empenho/EmpenhoForm';
import EmpenhoTable from '../../components/empenho/EmpenhoTable';
import PaymentWarningModal from '../../components/pagamento/PaymentWarningModal';
import Link from 'next/link';

const EmpenhoPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { empenhos, status, error } = useSelector((state: RootState) => state.empenho);
  const { despesas, status: despesasStatus } = useSelector((state: RootState) => state.despesa);

  const { pagamentos: pagamentosAssociados, status: pagamentosStatus } = useSelector((state: RootState) => state.pagamento);


  const [editingEmpenho, setEditingEmpenho] = useState<Empenho | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPaymentWarningModal, setShowPaymentWarningModal] = useState(false);
  const [empenhoToDelete, setEmpenhoToDelete] = useState<Empenho | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEmpenhos());
    }
    if (despesasStatus === 'idle') {
      dispatch(fetchDespesas());
    }
  }, [status, despesasStatus, dispatch]);

  const handleAddOrUpdateEmpenho = async (empenho: Omit<Empenho, 'id'> | Empenho) => {
    try {
      if (editingEmpenho) {
        await dispatch(updateEmpenho(empenho as Empenho)).unwrap();
      } else {
        await dispatch(addEmpenho(empenho as Omit<Empenho, 'id'>)).unwrap();
      }
      setEditingEmpenho(null);
      setShowForm(false);
      dispatch(fetchEmpenhos());
    } catch (err) {
      console.error('Failed to save empenho:', err);
    }
  };

  const handleAttemptDeleteEmpenho = async (empenho: Empenho) => {
    if (empenho.id === undefined || empenho.id === null) {
      console.error("Não é possível tentar excluir um empenho com ID indefinido ou nulo.");
      return;
    }

    const resultAction = await dispatch(fetchPagamentosByEmpenhoId(empenho.id));
    const payments = resultAction.payload as Pagamento[]; 

    if (payments && payments.length > 0) {
      setEmpenhoToDelete(empenho); 
      setShowPaymentWarningModal(true); 
    } else {
      if (window.confirm('Tem certeza que deseja excluir este empenho?')) {
        try {
          await dispatch(deleteEmpenho(empenho.id)).unwrap();
          dispatch(fetchEmpenhos()); 
        } catch (err) {
          console.error('Failed to delete empenho:', err);
        }
      }
    }
  };

  const handleClosePaymentWarningModal = () => {
    setShowPaymentWarningModal(false);
    setEmpenhoToDelete(null);
  };

  const handleEditClick = (empenho: Empenho) => {
    setEditingEmpenho(empenho);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setEditingEmpenho(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-inter">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Gerenciador de Empenhos</h1>
        <p className="text-lg text-gray-600">
          CRUD de empenhos com Next.js, Redux Toolkit e Tailwind CSS
        </p>
        <nav className="mt-4 flex justify-center space-x-4">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Ir para Despesas
          </Link>
          <Link href="/pagamento" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Ir para Pagamentos
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto">
        {status === 'loading' && (
          <div className="text-center text-indigo-600 mb-4">Carregando empenhos...</div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Erro: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          {!showForm && (
            <h2 className="text-2xl font-bold text-gray-800">Lista de Empenhos</h2>
          )}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Adicionar Novo Empenho
            </button>
          )}
        </div>

        {showForm && (
          <EmpenhoForm
            initialData={editingEmpenho}
            onSubmit={handleAddOrUpdateEmpenho}
            onCancel={handleCancelForm}
          />
        )}

        {!showForm && (
          <EmpenhoTable
            empenhos={empenhos}
            despesas={despesas}
            onEdit={handleEditClick}
            onAttemptDelete={handleAttemptDeleteEmpenho}
          />
        )}
      </main>

      <footer className="text-center mt-10 text-gray-500 text-sm">
        Desenvolvido por Alicia
      </footer>

      {showPaymentWarningModal && empenhoToDelete && (
        <PaymentWarningModal
          empenho={empenhoToDelete}
          pagamentos={pagamentosAssociados} 
          pagamentosStatus={pagamentosStatus} 
          onClose={handleClosePaymentWarningModal}
        />
      )}
    </div>
  );
};

export default EmpenhoPage;