import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../../../service/api';
import { useAuth } from '../../auth/';

const NucleoContextData = {
  setNucleosList: false,
  setLoadingNucleos: () => {},
  getNucleos: () => {},
  nucleoSelected: {},
  setNucleoSelected: () => {},
  nucleosList: [],
  total: 0,
};

const NucleoContext = createContext(NucleoContextData);

export const NucleoProvider = ({ children }) => {
  const [loadingNucleos, setLoadingNucleos] = useState(true);
  const [nucleoSelected, setNucleoSelected] = useState(true);
  const [nucleosList, setNucleosList] = useState([]);
  const [total, setTotal] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    async function buscar() {
      await getNucleos(1);
    }
    buscar();
  }, []);

  async function getNucleos(page) {
    const response = await api.get('/allactivated', {
      headers: {
        page: page,
      },
    });

    setTotal(response.data.total);

    if (!response.data.error) {
      setNucleosList(response.data.list);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoadingNucleos(false);
      return response.data.list;
    }
    setLoadingNucleos(false);
    return [];
  }

  return (
    <NucleoContext.Provider
      value={{
        loadingNucleos,
        getNucleos,
        setLoadingNucleos,
        nucleoSelected,
        setNucleoSelected,
        nucleosList,
        total,
        //reset,
      }}
    >
      {children}
    </NucleoContext.Provider>
  );
};

export function useNucleo() {
  return useContext(NucleoContext);
}
