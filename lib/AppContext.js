import React, { createContext, useState, useContext, useEffect } from 'react';
import { generateMockReviews } from './data';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [restaurant, setRestaurant] = useState(null); // { name: '...', address: '...', id: '...' }
  const [reviews, setReviews] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [demoMode, setDemoModeState] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedDemo = localStorage.getItem('repuia_demo');
      const isDemo = storedDemo === 'true';
      setDemoModeState(isDemo);

      const stored = localStorage.getItem('repuia_restaurant');
      if (stored) {
        const parsed = JSON.parse(stored);
        setRestaurant(parsed);
        
        const storedReviews = localStorage.getItem('repuia_reviews');
        if (storedReviews) {
          setReviews(JSON.parse(storedReviews));
        } else if (isDemo) {
          const freshReviews = generateMockReviews(parsed.name);
          setReviews(freshReviews);
          localStorage.setItem('repuia_reviews', JSON.stringify(freshReviews));
        } else {
          setReviews([]);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  const setDemoMode = (active) => {
    setDemoModeState(active);
    localStorage.setItem('repuia_demo', active);
    
    if (restaurant) {
      if (active) {
        const freshReviews = generateMockReviews(restaurant.name);
        setReviews(freshReviews);
        localStorage.setItem('repuia_reviews', JSON.stringify(freshReviews));
      } else {
        setReviews([]);
        localStorage.removeItem('repuia_reviews');
      }
    }
  };

  const loginRestaurant = (restData) => {
    setRestaurant(restData);
    localStorage.setItem('repuia_restaurant', JSON.stringify(restData));
    
    if (demoMode) {
      const freshReviews = generateMockReviews(restData.name);
      setReviews(freshReviews);
      localStorage.setItem('repuia_reviews', JSON.stringify(freshReviews));
    } else {
      setReviews([]);
      localStorage.removeItem('repuia_reviews');
    }
  };

  const updateReviewStatus = (id, newStatus) => {
    const updated = reviews.map(r => r.id === id ? { ...r, status: newStatus } : r);
    setReviews(updated);
    localStorage.setItem('repuia_reviews', JSON.stringify(updated));
  };

  return (
    <AppContext.Provider value={{ restaurant, reviews, loginRestaurant, updateReviewStatus, isLoaded, demoMode, setDemoMode }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
