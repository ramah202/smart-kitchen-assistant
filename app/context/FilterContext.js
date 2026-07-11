import React, { createContext, useState, useContext, useMemo } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    category: null,      // Single selection
    time: null,          // Single selection  
    area: null,          // Single selection
    moods: [],           // Multiple selection - array
    mealTime: [],        // Multiple selection - array
  });

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      category: null,
      time: null,
      area: null,
      moods: [],
      mealTime: [],
    });
  };

  const contextValue = useMemo(() => ({
    filters,
    updateFilters,
    clearFilters,
  }), [filters]);

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};