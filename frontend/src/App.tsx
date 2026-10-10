import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './design/ThemeContext';
import { DefangProvider } from './design/DefangContext';
import { SidebarProvider } from './context/SidebarContext';
import { DrawerProvider } from './context/DrawerContext';
import { CommandPaletteProvider } from './context/CommandPaletteContext';
import { ToastProvider } from './components/primitives/Toast';
import { CopyWarningBridge } from './components/shell/CopyWarningBridge';
import { ErrorBoundary } from './components/shell/ErrorBoundary';
import { AppShell } from './components/shell/AppShell';

const LandingPage = React.lazy(() =>
  import('./pages/LandingPage').then(m => ({ default: m.LandingPage }))
);

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <DefangProvider>
          <SidebarProvider>
            <DrawerProvider>
              <CommandPaletteProvider>
                <ToastProvider>
                  <CopyWarningBridge />
                  <BrowserRouter>
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)]" />}>
                            <LandingPage />
                          </Suspense>
                        }
                      />
                      <Route path="/*" element={<AppShell />} />
                    </Routes>
                  </BrowserRouter>
                </ToastProvider>
              </CommandPaletteProvider>
            </DrawerProvider>
          </SidebarProvider>
        </DefangProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
