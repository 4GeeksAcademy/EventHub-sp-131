// Import necessary components and functions from react-router-dom.


import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Admin } from "./pages/Admin"
import { CreateAdmin } from "./pages/CreateAdmin"
import { EditAdmin} from "./pages/EditAdmin"
import { AdminDetails } from "./pages/AdminDetails"
import User from "./pages/User";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import DeleteUser from "./pages/DeleteUser";
import { Admin } from "./pages/Admin";
import { CreateAdmin } from "./pages/CreateAdmin";
import { EditAdmin } from "./pages/EditAdmin";
import { AdminDetails } from "./pages/AdminDetails";

export const router = createBrowserRouter(
    createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

      // Root Route: All navigation will start from here.
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

        {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/create" element={<CreateAdmin />} />
        <Route path="/admin/edit/:id" element={<EditAdmin />} />
        <Route path="/admin/details/:id" element={<AdminDetails />} />
        <Route path= "/" element={<Home />} />
        <Route path="/single/:theId" element={ <Single />} />  {/* Dynamic route for single items */}
        <Route path="/demo" element={<Demo />} />
        <Route path="/user" element={<User />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/edit-user/:id" element={<EditUser />} />
        <Route path="/delete-user/:id" element={<DeleteUser />} />
        <Route path="/promotor" element={<Promotor/>} />
        <Route path="/promotor-create" element={<CreatePromotor/>} />
        <Route path="/promotor-edit/:id" element={<EditarPromotor/>} />
        <Route path="/promotor-delete/:id" element={<DeletePromotor/>} />
        
        
      </Route>
    )
);