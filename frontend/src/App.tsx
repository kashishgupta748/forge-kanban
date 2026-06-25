import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import BoardList from './pages/BoardList';
import BoardView from './pages/BoardView';
import Members from './pages/Members';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="boards" element={<BoardList />} />
          <Route path="boards/:id" element={<BoardView />} />
          <Route path="members" element={<Members />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
