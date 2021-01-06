import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../../../service/api';
import { useAuth } from '../../auth';

const PeopleContextData = {
  setDataList: [],
  setLoadingData: false,
  getDataServer: () => {},
  getDataUser: () => {},
  getAdadsFilter: () => {},
  itemSelected: {},
  setItemSelected: () => {},
  dataListServer: [],
  loadingData: false,
  total: 0,
  getDataUser: () => {},
  getUserFilter: () => {},
  totalUser: 0,
  setCarregar: () => {},
  carregar: false,
};

const PeopleContext = createContext(PeopleContextData);

export const PeopleProvider = ({ children }) => {
  const [loadingData, setLoadingData] = useState(true);
  const [itemSelected, setItemSelected] = useState(true);
  const [dataListServer, setDataListServer] = useState([]);
  const [dataListUser, setDataListUser] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [carregar, setCarregar] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    async function buscar() {
      await getDataServer(1);
    }
    buscar();
  }, []);

  async function getDataServer(page) {
    let response = [];

    if (user.admin) {
      response = await api.get('/allAdads', {
        headers: {
          page: Number(page),
          userid: user.id,
        },
      });
    } else {
      response = await api.get('/personalData/allAdadsForNucleo', {
        headers: {
          page: Number(page),
          userid: user.id,
          nucleoid: user.nucleoid,
        },
      });
    }

    setTotal(response.data.total);

    if (!response.data.error) {
      setDataListServer(response.data.list);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoadingData(false);
      setCarregar(false);
      return response.data.list;
    }

    setLoadingData(false);
    setCarregar(false);
    return [];
  }
  async function getDataUser(page) {
    let response = [];

    response = await api.get('/allUsers', {
      headers: {
        page: Number(page),
      },
    });

    setTotalUser(response.data.total);

    if (!response.data.error) {
      setDataListUser(response.data.list);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoadingData(false);
      setCarregar(false);
      return response.data.list;
    }

    setLoadingData(false);
    setCarregar(false);
    return [];
  }

  async function getUserFilter(filter) {
    const response = await api.get('/filterUsers', {
      headers: {
        filter,
      },
    });

    setTotal(response.data.total);

    if (!response.data.error) {
      setDataListServer(response.data.list);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCarregar(false);
      setLoadingData(false);
      return response.data.list;
    }
    setCarregar(false);
    setLoadingData(false);
    return [];
  }

  async function getAdadsFilter(filter) {
    const response = await api.get('/filterAdads', {
      headers: {
        admin: user.admin,
        nucleoid: user.nucleoid,
        filter,
      },
    });

    setTotal(response.data.total);

    if (!response.data.error) {
      setDataListServer(response.data.list);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCarregar(false);
      setLoadingData(false);
      return response.data.list;
    }
    setCarregar(false);
    setLoadingData(false);
    return [];
  }

  return (
    <PeopleContext.Provider
      value={{
        loadingData,
        getDataServer,
        setLoadingData,
        itemSelected,
        getDataUser,
        getAdadsFilter,
        setItemSelected,
        getUserFilter,
        dataListServer,
        total,
        totalUser,
        carregar,
        setCarregar,
        //reset,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};

export function usePeople() {
  return useContext(PeopleContext);
}
