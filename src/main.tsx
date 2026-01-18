import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrentUserProvider } from "@/contexts/CurrentUserContext";
import { BranchProvider } from "@/contexts/BranchContext";
import { ShiftProvider } from "@/contexts/ShiftContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Provider } from "react-redux";
import { store } from "./store/store";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <CurrentUserProvider>
              <BranchProvider>
                <ShiftProvider>
                  <TooltipProvider>
                    <App />
                    <Toaster />
                    <Sonner />
                  </TooltipProvider>
                </ShiftProvider>
              </BranchProvider>
            </CurrentUserProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
