import React, { useState, useEffect } from 'react';
import { Empenho } from '@/features/empenhoSlice';
import { Despesa, fetchDespesas } from '@/features/despesaSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';

interface EmpenhoFormProps {
  initialData?: Empenho | null;
  onSubmit: (empenho: Omit<Empenho, 'id'> | Empenho) => void;
  onCancel: () => void;
}

const EmpenhoForm: React.FC<EmpenhoFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { despesas, status: despesasStatus } = useSelector((state: RootState) => state.despesa);

  const [formData, setFormData] = useState<Omit<Empenho, 'id'> | Empenho>({
    numeroEmpenho: '',
    dataEmpenho: '',
    valorEmpenho: 0,
    observacao: '',
    despesaId: 0,
    ...(initialData || {}),
  });

  useEffect(() => {
    if (despesasStatus === 'idle') {
      dispatch(fetchDespesas());
    }

    if (initialData) {
      const formattedDataEmpenho = initialData.dataEmpenho ? new Date(initialData.dataEmpenho).toISOString().split('T')[0] : '';
      setFormData({
        ...initialData,
        dataEmpenho: formattedDataEmpenho,
      });
    } else {
      setFormData({
        numeroEmpenho: '',
        dataEmpenho: '',
        valorEmpenho: 0,
        observacao: '',
        despesaId: despesas.length > 0 ? despesas[0].id || 0 : 0,
      });
    }
  }, [initialData, despesasStatus, dispatch, despesas.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'valorEmpenho') {
        let newValue = value;
        if (prev.valorEmpenho === 0 && value !== '' && !isNaN(parseFloat(value)) && parseFloat(value) !== 0) {
          newValue = value.replace(/^0+/, '');
        }
        return {
          ...prev,
          [name]: parseFloat(newValue) || 0,
        };
      }
      if (name === 'despesaId') {
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
    const dataEmpenhoFormatted = formData.dataEmpenho ? new Date(formData.dataEmpenho).toISOString().split('T')[0] : '';

    onSubmit({
      ...formData,
      dataEmpenho: dataEmpenhoFormatted,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {initialData ? 'Editar Empenho' : 'Adicionar Novo Empenho'}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="numeroEmpenho" className="block text-sm font-medium text-gray-700 mb-1">
            Número do Empenho
          </label>
          <input
            type="text"
            id="numeroEmpenho"
            name="numeroEmpenho"
            value={formData.numeroEmpenho}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="dataEmpenho" className="block text-sm font-medium text-gray-700 mb-1">
            Data do Empenho
          </label>
          <input
            type="date"
            id="dataEmpenho"
            name="dataEmpenho"
            value={formData.dataEmpenho}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="valorEmpenho" className="block text-sm font-medium text-gray-700 mb-1">
            Valor do Empenho
          </label>
          <input
            type="number"
            id="valorEmpenho"
            name="valorEmpenho"
            value={formData.valorEmpenho}
            onChange={handleChange}
            step="0.01"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="despesaId" className="block text-sm font-medium text-gray-700 mb-1">
            Despesa Associada
          </label>
          <select
            id="despesaId"
            name="despesaId"
            value={formData.despesaId}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Selecione uma Despesa</option>
            {despesasStatus === 'loading' && <option>Carregando Despesas...</option>}
            {despesas.map((despesa) => (
              <option key={despesa.id} value={despesa.id}>
                {despesa.numeroProtocolo} - {despesa.descricao}
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
            {initialData ? 'Atualizar Empenho' : 'Adicionar Empenho'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmpenhoForm;
