import React from 'react';
import { Pagamento } from '@/features/pagamentoSlice'; 
import { Empenho } from '@/features/empenhoSlice'; 
interface PaymentWarningModalProps {
  empenho: Empenho | null;
  pagamentos: Pagamento[];
  pagamentosStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  onClose: () => void;
}

const PaymentWarningModal: React.FC<PaymentWarningModalProps> = ({
  empenho,
  pagamentos,
  pagamentosStatus,
  onClose,
}) => {
  if (!empenho) return null; // Não renderiza se não houver empenho selecionado

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full m-4">
        <h3 className="text-2xl font-bold mb-4 text-red-700">Atenção: Empenho com Pagamentos Associados</h3>
        <p className="mb-4 text-gray-700">
          O empenho "<strong>{empenho.numeroEmpenho}</strong>" possui pagamentos associados. Para excluí-lo, você deve **primeiro excluir todos os pagamentos relacionados**.
        </p>

        {pagamentosStatus === 'loading' && (
          <p className="text-indigo-600 mb-4">Carregando pagamentos...</p>
        )}
        {pagamentosStatus === 'failed' && (
          <p className="text-red-500 mb-4">Erro ao carregar pagamentos.</p>
        )}

        {pagamentos.length > 0 && pagamentosStatus === 'succeeded' && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2 text-gray-800">Pagamentos Associados:</h4>
            <ul className="list-disc list-inside text-gray-600 max-h-48 overflow-y-auto border border-gray-200 p-3 rounded-md">
              {pagamentos.map((pagamento) => (
                <li key={pagamento.id} className="mb-1">
                  **Número:** {pagamento.numeroPagamento} | **Data:** {formatDate(pagamento.dataPagamento)} | **Valor:** {formatCurrency(pagamento.valorPagamento)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {pagamentos.length === 0 && pagamentosStatus === 'succeeded' && (
          <p className="text-green-600 mb-4">Não há pagamentos associados a este empenho.</p>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentWarningModal;
