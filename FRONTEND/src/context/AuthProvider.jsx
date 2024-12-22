import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Create the AuthContext
export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  const [profile, setProfile] = useState(null); 
  const [userData, setUserData] = useState(null); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData)); 
      } catch (parseError) {
        console.error("Error parsing stored user data:", parseError);
        setUserData(null);
      }
    }

    const fetchData = async () => {
      setLoading(true); // Set loading to true before API calls

      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch profile
        const profileResponse = await axios.get("http://localhost:3000/api/users/getMyProfile", { headers });
        setProfile(profileResponse.data);

        // Fetch blogs
        const blogsResponse = await axios.get("http://localhost:3000/api/blogs/getAllBlog", { headers });
        setBlogs(blogsResponse.data);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Set loading to false after API calls
      }
    };

    fetchData();
  }, []);

  return (
    <AuthContext.Provider value={{ blogs, profile, userData, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuth = () => {
  const { blogs, profile, userData, error, loading } = useContext(AuthContext);
  return { blogs, profile, userData, error, loading };
};
