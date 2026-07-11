import React, { createContext, useState, useContext, useMemo } from 'react';

const IngredientsContext = createContext();

export const IngredientsProvider = ({ children }) => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const contextValue = useMemo(() => ({
    selectedIngredients,
    updateSelectedIngredients: (ingredients) => {
      setSelectedIngredients(ingredients);
    },
    clearSelectedIngredients: () => {
      setSelectedIngredients([]);
    },
    addSelectedIngredient: (ingredient) => {
      setSelectedIngredients(prev => [...prev, ingredient]);
    },
    removeSelectedIngredient: (id) => {
      setSelectedIngredients(prev => prev.filter(ing => ing.id !== id));
    },
  }), [selectedIngredients]);

  return (
    <IngredientsContext.Provider value={contextValue}>
      {children}
    </IngredientsContext.Provider>
  );
};

export const useIngredients = () => {
  const context = useContext(IngredientsContext);
  if (!context) {
    throw new Error('useIngredients must be used within an IngredientsProvider');
  }
  return context;
};