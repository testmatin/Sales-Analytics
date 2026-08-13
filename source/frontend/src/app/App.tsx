import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { UIProvider } from '../context/UIContext';
import { router } from './router';

export default function App() {
  return <AuthProvider><UIProvider><RouterProvider router={router}/></UIProvider></AuthProvider>;
}
