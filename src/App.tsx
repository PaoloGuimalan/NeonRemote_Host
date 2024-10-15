import React from 'react';
import PrivateRoutes from './app/routes/PrivateRoutes';

function App() {
  const renderRoutes = () => {
    return <PrivateRoutes />;
  };

  return <div className="flex flex-col h-screen w-full">{renderRoutes()}</div>;
}

export default App;
