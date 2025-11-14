import {lazy, Suspense} from 'react'
import { BrowserRouter as Router, Routes,Route ,Navigate } from 'react-router-dom';
import Signup from "./signUp.jsx"
import App from './App.jsx';
import Cart from "./Cart.jsx"
import Login from "./Login.jsx"
import MyPosts from './MyDashBoard/MyPosts.jsx';
import AddPost from './AddPost.jsx';
import PostInfo from './postInfo.jsx';
import Dashboard from './MyDashBoard/Dashboard.jsx';
import AgentPostInfo from './agentPostInfo.jsx'
import Lease from './lease.jsx';
import LeaseRequestSent from './leaseRequestSent.jsx';
import MyRequests from './MyDashBoard/MyRequests.jsx';
import Pay from './Pay.jsx';
import MyLeased from './MyDashBoard/MyLeased.jsx';

export default function ARoutes() {
  return (
    <Router>
      <Suspense fallback={<div className="container">Loading...</div>}>
      <Routes>
        <Route path='/'  element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<Signup />} />
        <Route path="/cart" element={<Cart />}/>
        <Route path="/posts" element={<MyPosts />}/>
        <Route path="/posts/:id" element={<PostInfo />}/>
        <Route path="/posts/agent/:id" element={<AgentPostInfo />}/>
        <Route path="/addPost" element={<AddPost />}/>
        <Route path="/admin" element={<admin />}/>
        <Route path="/Dashboard" element={<Dashboard/>}/>
        <Route path="/request/:id" element={<Lease/>}/>
        <Route path="/requestSent" element={<LeaseRequestSent/>}/>
        <Route path="/myRequests" element={<MyRequests/>}/>
        <Route path="/myLeased" element={<MyLeased/>}/>
        <Route path="/pay/:propertyId/:personId/:amount" element={<Pay/>}/>
      </Routes>
      </Suspense>
    </Router>
  );
}


