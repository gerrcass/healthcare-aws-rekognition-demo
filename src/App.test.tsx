import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders healthcare EHR system', async () => {
  render(<App />);
  
  // Wait for loading to complete and login form to appear
  await waitFor(() => {
    expect(screen.getByText(/Healthcare EHR System/i)).toBeInTheDocument();
  });
});
