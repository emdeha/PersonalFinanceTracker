import {screen, render} from '@testing-library/react';
import App from './App.tsx';

describe('App', () => {
  it('renders Personal Finance Tracker', () => {
    render(<App />);

    expect(screen.getByText(/personal finance tracker/i)).toBeInTheDocument();
  })
})