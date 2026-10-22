import './App.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Posts from './components/Posts/Posts';
import Profile from './pages/Profile/Profile';
import Notfiction from './pages/Notfiction/Notfiction';
import AuthLayout from './Layout/AuthLayout/AuthLayout';
import MainLayout from './Layout/MainLayout/MainLayout';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Feed from './pages/Feed/Feed';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from './context/AuthContext';
import UserDataProvider from './context/userDataContext';
import ProtectMain from './components/protectRouts/ProtectMain';
import AuthProtect from './components/AuthProtect/AuthProtect';
import PostDetails from './pages/postDetails/PostDetails';
import Setting from './pages/Setting/Setting';
import ThemeProvider from './context/ThemeContext';

function App() {
  const routers = createBrowserRouter([
    {
      path: 'auth',
      element: <AuthProtect><AuthLayout /></AuthProtect>,
      children: [
        { index: true, element: <Navigate to="login" replace /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
      ],
    },
    {
      path: '',
      element: <ProtectMain><MainLayout /> </ProtectMain>,
      children: [
        { index: true, element: <Feed />},
        { path: 'feed', element: <Feed /> },
        { path: 'posts', element: <Posts /> },
        { path: 'profile', element: <Profile /> },
        { path: 'notfiction', element: <Notfiction /> },
        { path: 'PostDetails/:postId', element: <PostDetails />},
        { path: 'setteing', element: <Setting />}
      ],
    },
  ]);

  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <UserDataProvider>
            <RouterProvider router={routers} />
            <ToastContainer position="top-right" autoClose={3000} />
          </UserDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
