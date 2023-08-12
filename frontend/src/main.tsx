import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Routes } from '@generouted/react-router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  //   <Routes />
  // </React.StrictMode>

  // non-strict mode
  <React.Fragment>
    <Routes />
  </React.Fragment>
);
