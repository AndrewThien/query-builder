"use client";
import React, { createContext, useContext, useState } from "react";
import { ReviewData } from "@/types";

interface GlobalStateContextType {
  reviewData: ReviewData;
  setReviewData: (data: ReviewData) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

export function GlobalStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reviewData, setReviewData] = useState<ReviewData>({} as ReviewData);

  return (
    <GlobalStateContext.Provider value={{ reviewData, setReviewData }}>
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
