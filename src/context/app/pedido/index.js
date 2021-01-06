import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../../../service/api';
import { useAuth } from '../../auth/';

const now = new Date();
const formatDate = `${now.getDate()}/${
  now.getMonth() + 1
}/${now.getFullYear()}`;

const statusPedido = [formatDate, '0', '0', '0', '0'];

const PedidoContextData = {
  setDataListPedido: () => {},
  setLoading: () => {},
  getDataServer: () => {},
  itemSelected: { pedido: { status: 1 }, list: [], statusPedido },
  setItemSelected: () => {},
  dataListPedido: [],
  loading: false,
  total: 0,
  edit: false,
  setEdit: () => {},
  user: {},
};

const PedidoContext = createContext(PedidoContextData);

export const PedidoProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [dataListPedido, setDataListPedido] = useState([]);
  const [itemSelected, setItemSelected] = useState('');
  const [total, setTotal] = useState(0);
  const [edit, setEdit] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    if (loading) {
      getDataServer(1);
    }
  }, [loading]);

  async function getDataServer(page) {
    let response = '';
    if (user.admin) {
      response = await api.get('pedido/all', {
        headers: {
          page: Number(page),
        },
      });
    } else {
      response = await api.get('pedido/allForNucleo', {
        headers: {
          page: Number(page),
          nucleoid: Number(user.nucleoid),
        },
      });
    }

    if (!response.data.error) {
      setTotal(response.data.total);
      setDataListPedido(response.data.listPedidos);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
      return response.data.listPedidos;
    }
    setLoading(false);
    return [];
  }

  return (
    <PedidoContext.Provider
      value={{
        loading,
        getDataServer,
        setLoading,
        itemSelected,
        setItemSelected,
        edit,
        setEdit,
        dataListPedido,
        total,
        user,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};

export function usePedido() {
  return useContext(PedidoContext);
}
