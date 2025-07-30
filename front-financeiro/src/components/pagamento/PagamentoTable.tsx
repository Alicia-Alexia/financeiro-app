import React from 'react';
import { Pagamento } from '@/features/pagamentoSlice';
import { Empenho } from '@/features/empenhoSlice'; // Importa Empenho para mapeamento

interface PagamentoTableProps {
  pagamentos: Pagamento[];
  empenhos: Empenho[]; // Recebe a lista de empenhos para mapear
  onEdit: (pagamento: Pagamento) => void;
  onDelete: (id: number) => void;
}

const PagamentoTable: React.FC<PagamentoTableProps> = ({ pagamentos, empenhos, onEdit, onDelete }) => {
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

  // Função para encontrar o empenho associado pelo ID
  const getEmpenhoDetails = (empenhoId: number) => {
    const empenho = empenhos.find((e) => e.id === empenhoId);
    return empenho ? `${empenho.numeroEmpenho} - ${empenho.observacao}` : 'Empenho não encontrado';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {pagamentos.length === 0 ? (
        <p className="text-gray-600">Nenhum pagamento encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Número Pagamento
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Data Pagamento
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Valor Pagamento
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Observação
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Empenho Associado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagamentos.map((pagamento) => (
                <tr key={pagamento.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {pagamento.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pagamento.numeroPagamento}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(pagamento.dataPagamento)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(pagamento.valorPagamento)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pagamento.observacao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getEmpenhoDetails(pagamento.empenhoId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(pagamento)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (pagamento.id !== undefined && pagamento.id !== null) {
                          onDelete(pagamento.id);
                        } else {
                          console.error("Tentativa de excluir pagamento com ID indefinido ou nulo:", pagamento);
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PagamentoTable;
