"use client";
import React, { createContext, useContext, useState } from "react";
import { TableMetaData } from "@/types/table";

interface GlobalStateContextType {
  csvData: TableMetaData[];
  setCsvData: (data: TableMetaData[]) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

export function GlobalStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [csvData, setCsvData] = useState<TableMetaData[]>([]);

  return (
    <GlobalStateContext.Provider value={{ csvData, setCsvData }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
}
