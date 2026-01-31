import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SukhdeviVihar from "./pages/SukhdeviVihar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Get base URL from environment variable
  // Remove trailing slash if present (React Router doesn't need it)
  const baseUrl = import.meta.env.VITE_BASE_URL || "";
  const basename = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sukhdevvihar" element={<SukhdeviVihar />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
