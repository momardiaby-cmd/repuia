import React, { createContext, useState, useContext, useEffect } from 'react';
import { generateMockReviews } from './data';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [restaurant, setRestaurant] = useState(null); // { name: '...', address: '...', id: '...' }
  const [reviews, setReviews] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('repuia_restaurant');
      if (stored) {
        const parsed = JSON.parse(stored);
        setRestaurant(parsed);
        // Load or generate mock reviews for this restaurant
        const storedReviews = localStorage.getItem('repuia_reviews');
        if (storedReviews) {
          setReviews(JSON.parse(storedReviews));
        } else {
          const freshReviews = generateMockReviews(parsed.name);
          setReviews(freshReviews);
          localStorage.setItem('repuia_reviews', JSON.stringify(freshReviews));
        }
      }
      setIsLoaded(true);
    }
  }, []);

  const loginRestaurant = (restData) => {
    setRestaurant(restData);
    localStorage.setItem('repuia_restaurant', JSON.stringify(restData));
    
    // Generate new reviews for the new restaurant
    const freshReviews = generateMockReviews(restData.name);
    setReviews(freshReviews);
    localStorage.setItem('repuia_reviews', JSON.stringify(freshReviews));
  };

  const updateReviewStatus = (id, newStatus) => {
    const updated = reviews.map(r => r.id === id ? { ...r, status: newStatus } : r);
    setReviews(updated);
    localStorage.setItem('repuia_reviews', JSON.stringify(updated));
  };

  return (
    <AppContext.Provider value={{ restaurant, reviews, loginRestaurant, updateReviewStatus, isLoaded }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
