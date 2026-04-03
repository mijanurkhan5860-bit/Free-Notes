import { useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index.tsx";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    CapApp.addListener('backButton', () => {
      if (window.location.pathname === '/') {
        CapApp.exitApp();
      } else {
        window.history.back();
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
export default App;
