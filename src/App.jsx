import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './components/Layout';
import HomePage from '@/components/pages/HomePage';
import NotFound from './pages/NotFound';
import { routes, routeArray } from './config/routes';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
<Route index element={<HomePage />} />
            {routeArray.map(route => (
              <Route 
                key={route.id} 
                path={route.path} 
                element={<route.component />} 
              />
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-[9999]"
          toastClassName="bg-white shadow-lg rounded-lg"
          bodyClassName="text-gray-700"
          progressClassName="bg-primary"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;