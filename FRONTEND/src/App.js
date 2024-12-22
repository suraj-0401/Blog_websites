import React from 'react';
import Navbar from '../src/components/Navbar';
import Home from '../src/components/Home';
import Footer from '../src/components/Footer';
import Blogs from '../src/pages/Blogs';
import Contact from '../src/pages/Contact';
import Creators from '../src/pages/Creators';
import Dashboard from '../src/pages/Dashboard';
import Login from '../src/pages/Login';
import Signup from '../src/pages/Signup';
import { Toaster } from 'react-hot-toast';
import { Route, Routes, useLocation } from 'react-router-dom';
import BlogDetail from './pages/BlogDetails';
import MyBlogs from './dashboard/MyBlogs';
import PageNotFound from './pages/PageNotFound';
import ChatApp from './chatapp/ChatApp';
import Search from './pages/Search';
import Summarizer from './ai/Summarize';
import UpdateBlog from './dashboard/UpdateBlog';

function App() {
  const location = useLocation();
  const hideNavbarFooter = ['/login', '/signup', '/dashboard'].includes(location.pathname);

  return (
    <div>
      {!hideNavbarFooter && <Navbar />}
      
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/chat' element={<ChatApp />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/creators' element={<Creators />} />
        
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/search' element={<Search />} />
        <Route path='/blogs/:id' element={<BlogDetail />} />
        <Route path='/my-blogs/:id' element={<MyBlogs />} />
        <Route path="/update-blog/:id" element={<UpdateBlog />} /> 


        <Route path='*' element={<PageNotFound />} />
      </Routes>
      
      {!hideNavbarFooter && <Footer />}
      <Toaster />
    </div>
  );
}

export default App;