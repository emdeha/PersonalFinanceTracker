import {screen, render} from '@testing-library/react';
import App from './App.tsx';

describe('App', () => {
  it('renders Home', () => {
    render(<App />)

    expect(screen.getByText(/home/i)).toBeInTheDocument()
  })
})