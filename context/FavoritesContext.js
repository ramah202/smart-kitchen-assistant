import React, { createContext, useState, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../services/apiConfig';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoritesMap, setFavoritesMap] = useState({}); // { recipeId: true/false }

  // Add to favorites
  const addFavorite = useCallback(async (recipeId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return false;

      const response = await fetch(`${API_BASE_URL}/user/my-favorite-recipes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_recipe: recipeId }),
      });

      const data = await response.json();
      
      if (data.success) {
        setFavoritesMap(prev => ({ ...prev, [recipeId]: true }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding favorite:", error);
      return false;
    }
  }, []);

  // Remove from favorites
  const removeFavorite = useCallback(async (recipeId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return false;

      const response = await fetch(`${API_BASE_URL}/user/my-favorite-recipes/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setFavoritesMap(prev => ({ ...prev, [recipeId]: false }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error removing favorite:", error);
      return false;
    }
  }, []);

  // Check if favorite
  const isFavorite = useCallback((recipeId) => {
    return favoritesMap[recipeId] || false;
  }, [favoritesMap]);

  // Initialize favorites from backend
  const initializeFavorites = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/user/my-favorite-recipes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        const newMap = {};
        data.data.forEach(recipe => {
          newMap[recipe.id] = true;
        });
        setFavoritesMap(newMap);
      }
    } catch (error) {
      console.error("Error initializing favorites:", error);
    }
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback(async (recipeId) => {
    if (isFavorite(recipeId)) {
      return await removeFavorite(recipeId);
    } else {
      return await addFavorite(recipeId);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return (
    <FavoritesContext.Provider
      value={{
        favoritesMap,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        initializeFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};