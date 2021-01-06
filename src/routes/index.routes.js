import React from 'react';
import { useAuth } from '../context/auth';
import App from './app.routes';
import Auth from './auth.routes';

export default function Routes() {
  const { signed } = useAuth();
  return signed ? <App /> : <Auth />;
}
