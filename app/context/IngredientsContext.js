import React, { createContext, useState, useContext, useMemo } from 'react';

const IngredientsContext = createContext();

export const IngredientsProvider = ({ children }) => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const contextValue = useMemo(() => ({
    selectedIngredients,
    
    // Update selected ingredients (used when navigating to filter)
    updateSelectedIngredients: (ingredients) => {
      console.log('Updating selected ingredients:', ingredients);
      setSelectedIngredients(ingredients);
    },
    
    // Clear all selected ingredients
    clearSelectedIngredients: () => {
      console.log('Clearing selected ingredients');
      setSelectedIngredients([]);
    },
    
    // Add a single ingredient
    addSelectedIngredient: (ingredient) => {
      setSelectedIngredients(prev => {
        if (!prev.some(ing => ing.id === ingredient.id)) {
          return [...prev, ingredient];
        }
        return prev;
      });
    },
    
    // Remove a single ingredient
    removeSelectedIngredient: (id) => {
      setSelectedIngredients(prev => prev.filter(ing => ing.id !== id));
    },
    
    // Check if ingredient is selected
    isIngredientSelected: (id) => {
      return selectedIngredients.some(ing => ing.id === id);
    },
    
    // Get selected ingredient IDs only (for backend API)
    getSelectedIngredientIds: () => {
      return selectedIngredients.map(ing => ing.id);
    },
    
    // Get selected ingredient names (for display)
    getSelectedIngredientNames: () => {
      return selectedIngredients.map(ing => ing.name);
    },
    
    // Count selected ingredients
    getSelectedCount: () => {
      return selectedIngredients.length;
    },
    
    // Reset to initial state
    resetIngredients: () => {
      setSelectedIngredients([]);
    }
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