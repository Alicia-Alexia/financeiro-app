import React, { useState, useEffect } from 'react';
import { Pagamento } from '@/features/pagamentoSlice';
import { Empenho, fetchEmpenhos } from '@/features/empenhoSlice'; // Importa Empenho e fetchEmpenhos
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';

interface PagamentoFormProps {
  initialData?: Pagamento | null;
  onSubmit: (pagamento: Omit<Pagamento, 'id'> | Pagamento) => void;
  onCancel: () => void;
}

const PagamentoForm: React.FC<PagamentoFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { empenhos, status: empenhosStatus } = useSelector((state: RootState) => state.empenho);

  const [formData, setFormData] = useState<Omit<Pagamento, 'id'> | Pagamento>({
    numeroPagamento: '',
    dataPagamento: '',
    valorPagamento: 0,
    observacao: '',
    empenhoId: 0, // Inicializa com 0 ou null
    ...(initialData || {}),
  });

  useEffect(() => {
    // Carrega os empenhos quando o componente é montado
    if (empenhosStatus === 'idle') {
      dispatch(fetchEmpenhos());
    }

    if (initialData) {
      const formattedDataPagamento = initialData.dataPagamento ? new Date(initialData.dataPagamento).toISOString().split('T')[0] : '';
      setFormData({
        ...initialData,
        dataPagamento: formattedDataPagamento,
      });
    } else {
      setFormData({
        numeroPagamento: '',
        dataPagamento: '',
        valorPagamento: 0,
        observacao: '',
        empenhoId: empenhos.length > 0 ? empenhos[0].id || 0 : 0, // Seleciona o primeiro empenho como padrão
      });
    }
  }, [initialData, empenhosStatus, dispatch, empenhos.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'valorPagamento') {
        let newValue = value;
        if (prev.valorPagamento === 0 && value !== '' && !isNaN(parseFloat(value)) && parseFloat(value) !== 0) {
          newValue = value.replace(/^0+/, '');
        }
        return {
          ...prev,
          [name]: parseFloat(newValue) || 0,
        };
      }
      if (name === 'empenhoId') {
        return {
          ...prev,
          [name]: parseInt(value, 10) || 0,
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataPagamentoFormatted = formData.dataPagamento ? new Date(formData.dataPagamento).toISOString().split('T')[0] : '';

    onSubmit({
      ...formData,
      dataPagamento: dataPagamentoFormatted,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {initialData ? 'Editar Pagamento' : 'Adicionar Novo Pagamento'}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="numeroPagamento" className="block text-sm font-medium text-gray-700 mb-1">
            Número do Pagamento
          </label>
          <input
            type="text"
            id="numeroPagamento"
            name="numeroPagamento"
            value={formData.numeroPagamento}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="dataPagamento" className="block text-sm font-medium text-gray-700 mb-1">
            Data do Pagamento
          </label>
          <input
            type="date"
            id="dataPagamento"
            name="dataPagamento"
            value={formData.dataPagamento}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="valorPagamento" className="block text-sm font-medium text-gray-700 mb-1">
            Valor do Pagamento
          </label>
          <input
            type="number"
            id="valorPagamento"
            name="valorPagamento"
            value={formData.valorPagamento}
            onChange={handleChange}
            step="0.01"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="empenhoId" className="block text-sm font-medium text-gray-700 mb-1">
            Empenho Associado
          </label>
          <select
            id="empenhoId"
            name="empenhoId"
            value={formData.empenhoId}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Selecione um Empenho</option>
            {empenhosStatus === 'loading' && <option>Carregando Empenhos...</option>}
            {empenhos.map((empenho) => (
              <option key={empenho.id} value={empenho.id}>
                {empenho.numeroEmpenho} - {empenho.observacao}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="observacao" className="block text-sm font-medium text-gray-700 mb-1">
            Observação
          </label>
          <textarea
            id="observacao"
            name="observacao"
            value={formData.observacao}
            onChange={handleChange}
            rows={3}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {initialData ? 'Atualizar Pagamento' : 'Adicionar Pagamento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PagamentoForm;