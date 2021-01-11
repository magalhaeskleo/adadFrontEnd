import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../../service/api';

const AuthContextData = {
  signed: false,
  token: '',
  user: {},
  loadingPage: false,
  setLoadingPage: () => {},
  singIn: () => {},
  logout: () => {},
  register: () => {},
  reset: () => {},
  edit: () => {},
  profile: {},
  alterStorageAndUser: () => {},
  route: '',
};

const AuthContext = createContext(AuthContextData);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [profile, setProfile] = useState();

  useEffect(() => {
    setLoadingPage(true);
    async function loadStorageData() {
      const storagedUser = localStorage.getItem('@ADADAuth:user');
      const storagedToken = localStorage.getItem('@ADADAuth:token');
      // await new Promise((resolve) => setTimeout(resolve, 2000));

      if (storagedUser && storagedToken) {
        const userParse = JSON.parse(storagedUser);
        // const {}

        getProfile(userParse);
        setUser(userParse);
        api.defaults.headers.authorization = `Bearer ${storagedToken}`;
      }
    }
    loadStorageData();
    setLoadingPage(false);
  }, []);

  /*
  async function reset(form) {
    const { user, token } = form;
    setUser(user);

    api.defaults.headers.authorization = `Bearer ${token}`;

    await Asynstorage.setItem('@RPZAuth:user', JSON.stringify(user));
    await Asynstorage.setItem('@RPZAuth:token', token);
  }
*/

  async function alterStorageAndUser(id, email, password) {
    const resp = await api.get(`/personalData/${user.id}`);
    const admin = resp.data.perfilid === 0 || resp.data.perfilid === 8;
    setProfile({ ...resp.data, admin });

    const userForm = { ...resp.data, admin };

    localStorage.setItem('@ADADAuth:user', JSON.stringify(userForm));
    setUser(userForm);
  }

  async function getProfile(user) {
    const resp = await api.get(`/personalData/${user.id}`);
    const admin = resp.data.perfilid === 0 || resp.data.perfilid === 8;
    setProfile({ ...resp.data, admin });
  }

  async function singIn(form) {
    const { data } = await api.post('/login', form);

    if (data.error) {
      return data.error;
    } else {
      const { user, token } = data;

      api.defaults.headers.authorization = `Bearer ${token}`;
      const admin = user.perfilid === 0 || user.perfilid === 8;

      const userForm = { ...user, admin };

      localStorage.setItem('@ADADAuth:user', JSON.stringify(userForm));
      localStorage.setItem('@ADADAuth:token', token);

      setUser(userForm);
      const resp = await api.get(`/personalData/${user.id}`);
      setProfile({ ...resp.data, admin });
    }
    return data;
  }

  function logout() {
    localStorage.clear();
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loadingPage,
        singIn,
        logout,
        setLoadingPage,
        profile,
        alterStorageAndUser,
        //reset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
