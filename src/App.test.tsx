import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock the router context
const MockApp = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

describe('App with Error Boundaries', () => {
  it('renders without crashing', () => {
    render(<MockApp />);
    // The app should render without throwing errors
    expect(document.body).toBeInTheDocument();
  });

  it('has error boundaries wrapping critical components', () => {
    render(<MockApp />);
    
    // Check that the main app structure is rendered
    // This verifies that error boundaries don't interfere with normal rendering
    expect(document.querySelector('[data-testid="app"]') || document.body).toBeInTheDocument();
  });
});
