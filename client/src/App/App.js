import { Routes, Route } from 'react-router-dom';
import { navigationApi } from '../apis';

import { Trainings, Home } from '../screens';
import './App.css';

export function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={navigationApi.routes.home} element={<Home />} />
        <Route path={navigationApi.routes.trainings} element={<Trainings />} />
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
