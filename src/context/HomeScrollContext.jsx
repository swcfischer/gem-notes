import { createContext, useContext, useState } from "react";

const HomeScrollContext = createContext(null);

export function HomeScrollProvider({ children }) {
  const [scrollPosition, setScrollPosition] = useState(0);

  return (
    <HomeScrollContext.Provider value={[scrollPosition, setScrollPosition]}>
      {children}
    </HomeScrollContext.Provider>
  );
}

export function useHomeScrollPosition() {
  const context = useContext(HomeScrollContext);
  if (!context) {
    throw new Error(
      "useHomeScrollPosition must be used within a HomeScrollProvider.",
    );
  }
  return context;
}
