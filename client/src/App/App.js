import { Routes, Route } from 'react-router-dom';
import { Navigator } from '../components';

import { Trainings } from '../screens';
import { Home } from '../screens';
import './App.css';

export function App() {
  return (
    <div className="App">
      <Navigator />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="trainings" element={<Trainings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

// TODO REFACTOR
function NotFound() {
  return (
    <div>
      Oops! This page doesn't exist.
    </div>
  );
}
