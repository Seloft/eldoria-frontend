import Sidebar from './components/sidebar/sidebar'
import Loading from './components/loading/loading'
import './index.css';

import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Navigate, Routes, useLocation } from "react-router-dom";
import { ModsProvider } from './context/context';
import Pagination from './components/pagination/pagination';
import SearchBar from './components/search/search';
import PaginationOptions from './components/pagination_options/pagination_options';

const Server = lazy(() => import('./pages/server/server'));
const Terminal = lazy(() => import('./pages/terminal/terminal'));
const Mods = lazy(() => import('./pages/mods/mods'));
const ModDetails = lazy(() => import('./pages/mod_details/mod_details'));

function AppContent() {
  const location = useLocation();

  return (
    <>
      <Sidebar />

      {location.pathname === "/mods" && (
        <div className="header-area">
          <SearchBar />
          <div className='pagination-row'>
            <PaginationOptions 
              title="Items per page"
              textItems="24"
              dropDownItems={["24", "48", "72", "96"]}
            />
            <PaginationOptions 
              title="Sort by"
              textItems="Relevance"
              dropDownItems={["Relevance", "Downloads", "Follows", "Newest", "Updated"]}
            />
            <Pagination />
          </div>
        </div>
      )}

      <Routes>
        <Route path="*" element={<Navigate to="/mods" replace />} />
        <Route path="/mods" element={<Mods />} />
        <Route path="/mod/:id" element={<ModDetails />} />
        <Route path="/server" element={<Server />} />
        <Route path="/terminal" element={<Terminal />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ModsProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading fullScreen />}>
          <AppContent />
        </Suspense>
      </BrowserRouter>
    </ModsProvider>
  )
}

export default App;