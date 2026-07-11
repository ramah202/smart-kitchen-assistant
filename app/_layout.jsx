// app/_layout.jsx

import { Slot } from "expo-router";
import SafeScreen from "../components/SafeScreen";
import { useEffect, useState } from "react";
import SplashScreen from "./splash";
import { IngredientsProvider } from './context/IngredientsContext';
import { FilterProvider } from './context/FilterContext'; // Add this
import { FavoritesProvider } from '../context/FavoritesContext'; // Add this

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <IngredientsProvider>
      <FilterProvider>
        <FavoritesProvider>
        <SafeScreen>
          {showSplash ? <SplashScreen /> : <Slot />}
        </SafeScreen>
        </FavoritesProvider>
      </FilterProvider>
    </IngredientsProvider>
  );
}


