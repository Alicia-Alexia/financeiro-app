import React from 'react';
import { Empenho } from '@/features/empenhoSlice';
import { Despesa } from '@/features/despesaSlice';

interface EmpenhoTableProps {
  empenhos: Empenho[];
  despesas: Despesa[];
  onEdit: (empenho: Empenho) => void;
  onAttemptDelete: (empenho: Empenho) => void;
}

const EmpenhoTable: React.FC<EmpenhoTableProps> = ({ empenhos, despesas, onEdit, onAttemptDelete }) => {
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

  const getDespesaDetails = (despesaId: number) => {
    const despesa = despesas.find((d) => d.id === despesaId);
    return despesa ? `${despesa.numeroProtocolo} - ${despesa.descricao}` : 'Despesa não encontrada';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {empenhos.length === 0 ? (
        <p className="text-gray-600">Nenhum empenho encontrado.</p>
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
                  Número Empenho
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Data Empenho
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Valor Empenho
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
                  Despesa Associada
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
              {empenhos.map((empenho) => (
                <tr key={empenho.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {empenho.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {empenho.numeroEmpenho}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(empenho.dataEmpenho)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(empenho.valorEmpenho)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {empenho.observacao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getDespesaDetails(empenho.despesaId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        if (empenho.id !== undefined && empenho.id !== null) {
                          onEdit(empenho);
                        } else {
                          console.error("Tentativa de editar empenho com ID indefinido ou nulo:", empenho);
                        }
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (empenho.id !== undefined && empenho.id !== null) {
                          onAttemptDelete(empenho);
                        } else {
                          console.error("Tentativa de excluir empenho com ID indefinido ou nulo:", empenho);
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

export default EmpenhoTable;
