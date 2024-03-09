import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ListaCotizaciones from './components/ListaCotizaciones';
import DetalleCotizacion from './components/DetalleCotizacion';
import Logo from '../src/assets/Cotizacion.jpg';
import './App.css';

function App() {
  return (
  <> 
    <section className="logo-section">
        <div className="logo-container">
          <img src={Logo} className="logo" alt="Vite logo" />
        </div>
      </section>
      <section className="content-section">
        <Router>
          <Routes>
            <Route path="/" element={<ListaCotizaciones />} />
            <Route path="/cotizaciones/:id/:tipoMoneda" element={<DetalleCotizacion />} />
          </Routes>
        </Router>
      </section>
   </>
  );
}

export default App;
