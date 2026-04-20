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
import User from "./pages/User/User";
import CreateUser from "./pages/User/CreateUser";
import EditUser from "./pages/User/EditUser";
import DeleteUser from "./pages/User/DeleteUser";
import { Admin } from "./pages/Admin/Admin";
import { CreateAdmin } from "./pages/Admin/CreateAdmin";
import { EditAdmin } from "./pages/Admin/EditAdmin";
import { AdminDetails } from "./pages/Admin/AdminDetails";
import { Promotor } from "./pages/Promotor/Promotor"
import { PromotorDetail } from "./pages/Promotor/PromotorDetail"
import { CreatePromotor } from "./pages/Promotor/CreatePromotor"
import { EditPromotor } from "./pages/Promotor/EditPromotor"
import { DeletePromotor } from "./pages/Promotor/DeletePromotor"
import { CategoryPanel } from "./pages/Categories/CategoryPanel";
import { CategoriesList } from "./pages/Categories/CategoriesList";
import { CategoryCreate } from "./pages/Categories/CategoryCreate";
import { CategoryEdit } from "./pages/Categories/CategoryEdit";
import { CategoryDetail } from "./pages/Categories/CategoryDetail";
import { Event } from "./pages/Event/Event";
import { CreateEvent } from "./pages/Event/CreateEvent";
import { EditEvent } from "./pages/Event/EditEvent";
import { DeleteEvent } from "./pages/Event/DeleteEvent";
import { Group } from "./pages/Group/Group";
import { CreateGroup } from "./pages/Group/CreateGroup"
import { EditGroup } from "./pages/Group/EditGroup"
import { DeleteGroup } from "./pages/Group/DeleteGroup"
import { GroupDetail } from "./pages/Group/GroupDetail"
import { CreatePromotorCategory } from "./pages/Promotor-categories/CreatePromotorCategory";
import { PromotorCategoryList } from "./pages/Promotor-categories/PromotorCategoryList";
import { EditPromotorCategory } from "./pages/Promotor-categories/EditPromotorCategory";
import { SavedEvent } from "./pages/SavedEvent/SavedEvent";
import { SavedEventDetail } from "./pages/SavedEvent/SavedEventDetails";
import { CreateSavedEvent } from "./pages/SavedEvent/CreateSavedEvent";
import { DeleteSavedEvent } from "./pages/SavedEvent/DeleteSavedEvent";


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
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />  {/* Dynamic route for single items */}
      <Route path="/demo" element={<Demo />} />
      <Route path="/user" element={<User />} />
      <Route path="/create-user" element={<CreateUser />} />
      <Route path="/edit-user/:id" element={<EditUser />} />
      <Route path="/delete-user/:id" element={<DeleteUser />} />
      <Route path="/promotor" element={<Promotor />} />
      <Route path="/promotor-create" element={<CreatePromotor />} />
      <Route path="/promotor-edit/:theId" element={<EditPromotor />} />
      <Route path="/promotor-delete/:theId" element={<DeletePromotor />} />
      <Route path="/promotor/:theId/detail" element={<PromotorDetail/>} />
      <Route path="/category-panel" element={<CategoryPanel />} />
      <Route path="/categories" element={<CategoriesList />} />
      <Route path="/categories/create" element={<CategoryCreate />} />
      <Route path="/categories/edit/:id" element={<CategoryEdit />} />
      <Route path="/categories/:id" element={<CategoryDetail />} />
      <Route path="/events" element={<Event />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/edit-event/:id" element={<EditEvent />} />
      <Route path="/delete-event/:id" element={<DeleteEvent />} />
      <Route path="/group" element={<Group />} />
      <Route path="/group-create" element={<CreateGroup />} />
      <Route path="/group-edit/:theId" element={<EditGroup />} />
      <Route path="/group-delete/:theId" element={<DeleteGroup />} />
      <Route path="/group/:theId/detail" element={<GroupDetail/>} /> 
      <Route path="/promotor-category/create" element={<CreatePromotorCategory />} />
      <Route path="/promotor-category/list" element={<PromotorCategoryList />} />
      <Route path="/promotor-category/edit/:id" element={<EditPromotorCategory />} />
      <Route path="/saved_event" element={<SavedEvent />} />
      <Route path="/saved_event-create" element={<CreateSavedEvent />} />
      <Route path="/saved_event-delete/:theId" element={<DeleteSavedEvent />} />
      <Route path="/saved_event/:theId/detail" element={<SavedEventDetail/>} /> 
    </Route>
  )
);