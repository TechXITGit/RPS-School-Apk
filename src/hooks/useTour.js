import { useContext } from 'react';
import { TourContext } from '../context/TourContext';

/**
 * Access the global tour state and control methods
 */
export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}

export default useTour;
