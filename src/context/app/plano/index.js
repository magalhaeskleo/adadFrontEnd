import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '../../auth/';

const PlanoContextData = {
  // setDataList: () => {},
  // setLoading: () => {},
  // getDataServer: () => {},
  itemSelected: {},
  setItemSelected: () => {},
  edit: false,
  setEdit: () => {},
  user: {},
  // dataList: [],
  // loading: true,
  //  total: 0,
  // user: {},
};

const PlanoContext = createContext(PlanoContextData);

export const PlanoProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [dataList, setDataList] = useState([]);
  const [itemSelected, setItemSelected] = useState('');
  const [edit, setEdit] = useState(false);

  const [total, setTotal] = useState(0);
  const { user } = useAuth();

  return (
    <PlanoContext.Provider
      value={{
        //loading,
        //getDataServer,
        //setLoading,
        itemSelected,
        user,
        setItemSelected,
        edit,
        setEdit,
        //dataList,
        //total,
        //user,
      }}
    >
      {children}
    </PlanoContext.Provider>
  );
};

export function usePlano() {
  return useContext(PlanoContext);
}
