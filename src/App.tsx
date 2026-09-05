import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Locations from "./pages/Locations";
import LocationDetail from "./pages/LocationDetail";
import Agents from "./pages/Agents";
import AgentDetail from "./pages/AgentDetail";
import Favorites from "./pages/Favorites";
import Compare from "./pages/Compare";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import ListProperty from "./pages/ListProperty";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import ErrorBoundary from "./components/layout/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <Toaster />
                    <Sonner position="bottom-right" theme="dark" />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/properties" element={<Properties />} />
                            <Route path="/property/:slug" element={<PropertyDetail />} />
                            <Route path="/locations" element={<Locations />} />
                            <Route path="/locations/:slug" element={<LocationDetail />} />
                            <Route path="/agents" element={<Agents />} />
                            <Route path="/agents/:id" element={<AgentDetail />} />
                            <Route path="/favorites" element={<Favorites />} />
                            <Route path="/compare" element={<Compare />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/dashboard" element={
                                <ProtectedRoute roles={["admin", "supervisor"]}>
                                    <Dashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/about" element={<About />} />
                            <Route path="/list-property" element={
                                <ProtectedRoute roles={["admin", "supervisor"]}>
                                    <ListProperty />
                                </ProtectedRoute>
                            } />
                            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </TooltipProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    </ThemeProvider>
);

export default App;
