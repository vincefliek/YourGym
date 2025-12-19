import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { App } from './App';

test('renders App with navbar', () => {
  render(
    <HashRouter>
      <App apis={{} as any} appContext={{} as any} />
    </HashRouter>,
  );
  const homeBtn = screen.getByText(/Home/i, {
    selector: 'button',
  });
  const trainingsBtn = screen.getByText(/Trainings/i, {
    selector: 'button',
  });
  expect(homeBtn).toBeInTheDocument();
  expect(trainingsBtn).toBeInTheDocument();
});
