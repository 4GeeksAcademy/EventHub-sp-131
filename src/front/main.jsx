import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'  // Global styles for your application
import { RouterProvider } from "react-router-dom";  // Import RouterProvider to use the router
import { router } from "./routes";  // Import the router configuration
import { StoreProvider } from './hooks/useGlobalReducer';  // Import the StoreProvider for global state management
import { BackendURL } from './components/BackendURL';
import "bootstrap-icons/font/bootstrap-icons.css";
const Main = () => {

    if (! import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL == "") return (
        <BackendURL />

    );
    return (
        <StoreProvider>
            {/* Set up routing for the application */}
            <RouterProvider router={router}>
            </RouterProvider>
        </StoreProvider>
    );
}

// Render the Main component into the root DOM element.
ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
