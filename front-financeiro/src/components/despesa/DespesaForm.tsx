import React, { useState, useEffect } from 'react';
import { Despesa } from '../../features/despesaSlice';

interface DespesaFormProps {
  initialData?: Despesa | null;
  onSubmit: (despesa: Omit<Despesa, 'id'> | Despesa) => void;
  onCancel: () => void;
}

const DespesaForm: React.FC<DespesaFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Despesa, 'id'> | Despesa>({
    numeroProtocolo: '',
    dataProtocolo: '',
    dataVencimento: '',
    credor: '',
    descricao: '',
    valorDespesa: 0,
    tipoDespesa: '', 
    ...(initialData || {}), 
  });

  useEffect(() => {
    if (initialData) {
      const formattedDataProtocolo = initialData.dataProtocolo ? new Date(initialData.dataProtocolo).toISOString().split('T')[0] : '';
      const formattedDataVencimento = initialData.dataVencimento ? new Date(initialData.dataVencimento).toISOString().split('T')[0] : '';

      setFormData({
        ...initialData,
        dataProtocolo: formattedDataProtocolo,
        dataVencimento: formattedDataVencimento,
      });
    } else {
      setFormData({
        numeroProtocolo: '',
        dataProtocolo: '',
        dataVencimento: '',
        credor: '',
        descricao: '',
        valorDespesa: 0,
        tipoDespesa: '', 
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'valorDespesa') {
        let newValue = value;
        if (prev.valorDespesa === 0 && value !== '' && !isNaN(parseFloat(value)) && parseFloat(value) !== 0) {
          newValue = value.replace(/^0+/, ''); 
        }
        return {
          ...prev,
          [name]: parseFloat(newValue) || 0,
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
    const dataProtocoloFormatted = formData.dataProtocolo ? new Date(formData.dataProtocolo).toISOString() : '';
    const dataVencimentoFormatted = formData.dataVencimento ? new Date(formData.dataVencimento).toISOString().split('T')[0] : ''; // Manter YYYY-MM-DD para data

    onSubmit({
      ...formData,
      dataProtocolo: dataProtocoloFormatted,
      dataVencimento: dataVencimentoFormatted,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {initialData ? 'Editar Despesa' : 'Adicionar Nova Despesa'}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="numeroProtocolo" className="block text-sm font-medium text-gray-700 mb-1">
            Número de Protocolo
          </label>
          <input
            type="text"
            id="numeroProtocolo"
            name="numeroProtocolo"
            value={formData.numeroProtocolo}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="credor" className="block text-sm font-medium text-gray-700 mb-1">
            Credor
          </label>
          <input
            type="text"
            id="credor"
            name="credor"
            value={formData.credor}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="dataProtocolo" className="block text-sm font-medium text-gray-700 mb-1">
            Data de Protocolo
          </label>
          <input
            type="date"
            id="dataProtocolo"
            name="dataProtocolo"
            value={formData.dataProtocolo.split('T')[0]}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="dataVencimento" className="block text-sm font-medium text-gray-700 mb-1">
            Data de Vencimento
          </label>
          <input
            type="date"
            id="dataVencimento"
            name="dataVencimento"
            value={formData.dataVencimento.split('T')[0]} 
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows={3}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <div>
          <label htmlFor="valorDespesa" className="block text-sm font-medium text-gray-700 mb-1">
            Valor da Despesa
          </label>
          <input
            type="number"
            id="valorDespesa"
            name="valorDespesa"
            value={formData.valorDespesa}
            onChange={handleChange}
            step="0.01"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="tipoDespesa" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Despesa
          </label>
          <input
            type="text"
            id="tipoDespesa"
            name="tipoDespesa"
            value={formData.tipoDespesa}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
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
            {initialData ? 'Atualizar Despesa' : 'Adicionar Despesa'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DespesaForm;
