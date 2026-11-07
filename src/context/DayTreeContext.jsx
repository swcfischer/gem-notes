import { createContext, useContext, useState } from "react";

const DayTreeContext = createContext(null);

export function DayTreeProvider({ children }) {
  const [openDays, setOpenDays] = useState(() => new Set());

  function setDayOpen(day, isOpen) {
    setOpenDays((currentOpenDays) => {
      const nextOpenDays = new Set(currentOpenDays);
      if (isOpen) {
        nextOpenDays.add(day);
      } else {
        nextOpenDays.delete(day);
      }
      return nextOpenDays;
    });
  }

  return (
    <DayTreeContext.Provider value={{ openDays, setDayOpen }}>
      {children}
    </DayTreeContext.Provider>
  );
}

export function useDayTree() {
  const context = useContext(DayTreeContext);
  if (!context) {
    throw new Error("useDayTree must be used within a DayTreeProvider.");
  }
  return context;
}
