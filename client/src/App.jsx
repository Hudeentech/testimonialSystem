
import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Dashboard, Testimonial } from './components';
function App() {


  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<Testimonial />} />
            <Route path="/dashboard" element={<Dashboard />} />

          </Routes>
        </Router>
    </>
  )
}

export default App
