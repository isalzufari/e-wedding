import { useState, useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// Component
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Page
import Main from './pages/Main';
import Detail from './pages/Detail';

// Admin Page
import Index from './pages/admin/Index';
import Login from './pages/Login';
import Register from './pages/Register';

import { logoutAction } from './utils/action';
import api from './utils/api';

// Catalogues Pages
import AddCatalogues from './pages/admin/Catalogues/AddCatalogues';
import GetAllCatalogues from './pages/admin/Catalogues/GetAllCatalogues';
import UpdateCatalogue from './pages/admin/Catalogues/UpdateCatalogue';
import AdminGetAllOrders from './pages/admin/Orders/GetAllOrders';
import GetAllOrders from './pages/app/Orders/GetAllOrders';

const AppLayout = () => (
  <>
    <div className="container mt-5">
      <Outlet />
    </div>
  </>
)

function App() {
  const [authUser, setauthUser] = useState(null);

  useEffect(() => {
    const asyncPreloadProcess = async () => {
      const authUser = await api.getOwnProfile();
      if (authUser.status !== 'success') {
        if (authUser.error === "Unauthorized" && authUser.message === "Token maximum age exceeded") {
          if (window.confirm('Sesi kamu udah habis. Perpanjang sesi?')) {
            await api.refreshToken();
            const userRefresh = await api.getOwnProfile();
            setauthUser(userRefresh.data)
          } else {
            return onSignOut();
          };
        }
      } else {
        setauthUser(authUser.data);
      }
    }
    asyncPreloadProcess();
  }, []);

  const onSignOut = () => {
    setauthUser(null);
    logoutAction();
  }

  return (
    <>
      <header>
        <Navigation authUser={authUser} onSignOut={onSignOut} />
      </header>
      <main>
        <Routes>
          <Route path='/' element={<AppLayout />}>
            <Route index element={<Main />} />
            <Route path='login' element={<Login setauthUser={setauthUser} />} />
            <Route path='register' element={<Register />} />
            <Route path=':slug' element={<Detail />} />
          </Route>

          <Route path='admin' element={<AppLayout />}>
            <Route index element={<Index />} />
            <Route path='catalogues'>
              <Route index element={<GetAllCatalogues />} />
              <Route path='add' element={<AddCatalogues />} />
              <Route path='update/:id' element={<UpdateCatalogue />} />
            </Route>
            <Route path='orders'>
              <Route index element={<AdminGetAllOrders />} />
            </Route>
          </Route>

          <Route path='app' element={<AppLayout />}>
            <Route path='orders'>
              <Route index element={<GetAllOrders />} />
            </Route>
          </Route>
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default App;
