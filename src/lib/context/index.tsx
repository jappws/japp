"use client";

import { createContext, FC, ReactNode } from "react";

interface AppStateContextType {}

export const AppContext = createContext({} as AppStateContextType);

interface Props {
  children: ReactNode;
}

export const AppContextProvider: FC<Props> = ({ children }) => {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};
