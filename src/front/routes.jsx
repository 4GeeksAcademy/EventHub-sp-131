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
import { Comments } from "./pages/Comments/Comments";
import { CreateComment } from "./pages/Comments/CreateComment";
import { Friend } from "./pages/Friend/Friend"
import { FriendDetail } from "./pages/Friend/FriendDetail"
import { CreateFriend } from "./pages/Friend/CreateFriend";
import { DeleteFriend } from "./pages/Friend/DeleteFriend";
import { CreatePromotorCategory } from "./pages/Promotor-categories/CreatePromotorCategory";
import { PromotorCategoryList } from "./pages/Promotor-categories/PromotorCategoryList";
import { EditPromotorCategory } from "./pages/Promotor-categories/EditPromotorCategory";
import { Discussion } from "./pages/Discussion/Discussion";
import { CreateDiscussion } from "./pages/Discussion/CreateDiscussion";
import { DeleteDiscussion } from "./pages/Discussion/DeleteDiscussion";
import { DiscussionDetail } from "./pages/Discussion/DiscussionDetail";
import { SavedEvent } from "./pages/SavedEvent/SavedEvent";
import { SavedEventDetail } from "./pages/SavedEvent/SavedEventDetails";
import { CreateSavedEvent } from "./pages/SavedEvent/CreateSavedEvent";
import { DeleteSavedEvent } from "./pages/SavedEvent/DeleteSavedEvent";
import { UserCategory } from "./pages/UserCategory/UserCategory";
import { UserCategoryDetail } from "./pages/UserCategory/UserCategoryDetails";
import { CreateUserCategory } from "./pages/UserCategory/CreateUserCategory";
import { DeleteUserCategory } from "./pages/UserCategory/DeleteUserCategory";
import { GroupCategoryList } from "./pages/Group-categories/GroupCategoryList";
import { AddGroupCategory } from "./pages/Group-categories/AddGroupCategory";
import { EditGroupCategory } from "./pages/Group-categories/EditGroupCategory";
import { GroupEventList } from "./pages/Group-event/GroupEventList";
import { CreateGroupEvent } from "./pages/Group-event/CreateGroupEvent";
import { EditGroupEvent } from "./pages/Group-event/EditGroupEvent";
import { EventCategory } from "./pages/EventCategory/EventCategory";
import { EventCategoryDetail } from "./pages/EventCategory/EventCategoryDetails"
import { DeleteEventCategory } from "./pages/EventCategory/DeleteEventCategory";
import { CreateEventCategory } from "./pages/EventCategory/CreateEventCategory";
import EventAssistUser from "./pages/EventAssist/EventAssistUser";
import CreateEventAssist from "./pages/EventAssist/CreateEventAssist";
import DeleteEventAssist from "./pages/EventAssist/DeleteEventAssist";
import { LoginUser } from "./pages/AuthUser/LoginUser";
import { PrivateUser } from "./pages/AuthUser/PrivateUser";
import { LoginPromotor } from "./pages/AuthPromotor/LoginPromotor";
import { PrivatePromotor } from "./pages/AuthPromotor/PrivatePromotor";
import { EventPromotor } from "./pages/Event-promotor/EventPromotor";
import { CreateEventPromotor } from "./pages/Event-promotor/CreateEventPromotor";
import { EditEventPromotor } from "./pages/Event-promotor/EditEventPromotor";
import { DeleteEventPromotor } from "./pages/Event-promotor/DeleteEventPromotor";
import { LoginAdmin } from "./pages/AuthAdmin/LoginAdmin";
import { PrivateAdmin } from "./pages/AuthAdmin/PrivateAdmin";
import { MySavedEvents } from "./pages/SavedEvent/MySavedEvents";
import { MyAssistingEvents } from "./pages/EventAssist/MyAssistingEvents";
import { RegisterUser } from "./pages/AuthUser/RegisterUser";
import { UserEvents } from "./pages/AuthUser/UserEvents";
import { UserProfiles } from "./pages/AuthUser/UserProfiles";
import { UserGroups } from "./pages/AuthUser/UserGroups";
import { UserGroupDetail } from "./pages/AuthUser/UserGroupDetail";
import { EventDetails} from "./pages/Event/EventDetails";
import { EventDetail } from "./pages/EventDetail";
import { Chat } from "./pages/Chat.jsx";
import { SearchByImage } from "./pages/SearchByImage.jsx";
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
      <Route path="/promotor/:theId/detail" element={<PromotorDetail />} />
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
      <Route path="/group/:theId/detail" element={<GroupDetail />} />
      <Route path="/comments" element={<Comments />} />
      <Route path="/create-comment" element={<CreateComment />} />
      <Route path="/friend" element={<Friend />} />
      <Route path="/friend-create" element={<CreateFriend />} />
      <Route path="/friend-delete/:theId" element={<DeleteFriend />} />
      <Route path="/friend/:theId/detail" element={<FriendDetail />} />
      <Route path="/promotor-category/create" element={<CreatePromotorCategory />} />
      <Route path="/promotor-category/list" element={<PromotorCategoryList />} />
      <Route path="/promotor-category/edit/:id" element={<EditPromotorCategory />} />
      <Route path="/discussion" element={<Discussion />} />
      <Route path="/discussion-create" element={<CreateDiscussion />} />
      <Route path="/discussion-delete/:theId" element={<DeleteDiscussion />} />
      <Route path="/discussion/:theId/detail" element={<DiscussionDetail />} />
      <Route path="/saved-event" element={<SavedEvent />} />
      <Route path="/saved-event-create" element={<CreateSavedEvent />} />
      <Route path="/saved-event-delete/:theId" element={<DeleteSavedEvent />} />
      <Route path="/saved-event/:theId/detail" element={<SavedEventDetail />} />
      <Route path="/user-category" element={<UserCategory />} />
      <Route path="/user-category/:theId/detail" element={<UserCategoryDetail />} />
      <Route path="/user-category-create" element={<CreateUserCategory />} />
      <Route path="/user-category-delete/:theId" element={<DeleteUserCategory />} />
      <Route path="/group-category" element={<GroupCategoryList />} />
      <Route path="/add-group-category" element={<AddGroupCategory />} />
      <Route path="/edit-group-category/:id" element={<EditGroupCategory />} />
      <Route path="/user/login" element={<LoginUser />} />
      <Route path="/user/private" element={<PrivateUser />} />
      <Route path="/group-event" element={<GroupEventList />} />
      <Route path="/create-group-event" element={<CreateGroupEvent />} />
      <Route path="/edit-group-event/:id" element={<EditGroupEvent />} />
      <Route path="/event-category" element={<EventCategory/>} />
      <Route path="/event-category/:theId/detail" element={<EventCategoryDetail/>} />
      <Route path="/event-category-delete/:theId" element={<DeleteEventCategory/>} />
      <Route path="/event-category-create" element={<CreateEventCategory/>} />
      <Route path="/event-assists" element={<EventAssistUser />} />
      <Route path="/create-event-assist" element={<CreateEventAssist />} />
      <Route path="/delete-event-assist/:id" element={<DeleteEventAssist />} />
      <Route path="/promotor/login" element={<LoginPromotor />} />
      <Route path="/promotor/private" element={<PrivatePromotor />} />
      <Route path="/event-promotor" element={<EventPromotor />} />
      <Route path="/create-event-promotor" element={<CreateEventPromotor />} />
      <Route path="/edit-event-promotor/:id" element={<EditEventPromotor />} />
      <Route path="/delete-event-promotor/:id" element={<DeleteEventPromotor />} />
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route path="/admin/private" element={<PrivateAdmin />} />
      <Route path="/user/saved-events" element={<MySavedEvents />} />
      <Route path="/user/assisting-events" element={<MyAssistingEvents />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/:type/private/:ownerId/event/:id" element={<EventDetail />} />
      <Route path="/user/register" element={<RegisterUser />} />
      <Route path="/user/events" element={<UserEvents />} />
      <Route path="/user/profiles" element={<UserProfiles />} />
      <Route path="/user/groups" element={<UserGroups />} />
      <Route path="/user/group/:theId" element={<UserGroupDetail />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/search-by-image" element={<SearchByImage />} />
    </Route>
  )
);