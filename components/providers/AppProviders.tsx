"use client";

import React from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { SavingsProvider } from "@/contexts/SavingsContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <SavingsProvider>{children}</SavingsProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
