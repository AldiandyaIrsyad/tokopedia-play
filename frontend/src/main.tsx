import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes } from '@generouted/react-router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  //   <Routes />
  // </React.StrictMode>

  // non-strict mode
  <React.Fragment>
    <Routes />
  </React.Fragment>
);
