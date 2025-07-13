import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Navbar from "@/components/Navbar";
import NedenArtiklo from "./pages/NedenArtiklo";
import Yorumlar from "./pages/Yorumlar";
import Senaryolar from "./pages/Senaryolar";
import SSS from "./pages/SSS";
import Hakkimizda from "./pages/Hakkimizda";
import KullaniciSozlesmesi from "./pages/KullaniciSozlesmesi";
import KvkkAydinlatma from "./pages/KvkkAydinlatma";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/neden-artiklo" element={<NedenArtiklo />} />
          <Route path="/yorumlar" element={<Yorumlar />} />
          <Route path="/senaryolar" element={<Senaryolar />} />
          <Route path="/sss" element={<SSS />} />
          <Route path="/hakkimizda" element={<Hakkimizda />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/kullanici-sozlesmesi" element={<KullaniciSozlesmesi />} />
          <Route path="/kvkk-aydinlatma" element={<KvkkAydinlatma />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
