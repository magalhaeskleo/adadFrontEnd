import React from 'react';
import { AuthProvider } from './context/auth';
import Routes from './routes/index.routes';

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </div>
  );
}

export default App;
