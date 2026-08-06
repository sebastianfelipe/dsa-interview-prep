import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './theme-context';
import { AppShell } from './components/AppShell';
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { ProblemPage } from './pages/ProblemPage';
import { ListsPage } from './pages/ListsPage';
import { ReferencePage } from './pages/ReferencePage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="browse" element={<BrowsePage />} />
            <Route path="problems/:topic/:slug" element={<ProblemPage />} />
            <Route path="lists" element={<ListsPage />} />
            <Route path="reference/*" element={<ReferencePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
