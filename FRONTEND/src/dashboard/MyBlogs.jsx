import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Corrected import for navigation

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Correct usage of useNavigate()

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3000/api/blogs/getMyBlog/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.blogs && Array.isArray(response.data.blogs)) {
          setBlogs(response.data.blogs);
        } else {
          setError("No blogs found.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Handle delete functionality
  const handleDelete = async (blogId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    try {
      // Make the DELETE request with the correct blogId
      await axios.delete(`http://localhost:3000/api/blogs/deleteBlog/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // After deleting, remove the blog from the state
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete blog");
    }
  };

  // Handle update functionality (navigate to a form for updating)
  const handleUpdate = (blogId) => {
    // Corrected navigate method usage
    navigate(`/update-blog/${blogId}`);
  };

  if (loading) return <div className="text-center mt-10 text-blue-600">Loading...</div>;

  if (error) return <div className="text-center mt-10 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-6xl ml-96 mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">My Blogs</h2>
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {blog.blogImage?.url && (
                <img
                  src={blog.blogImage.url}
                  alt={blog.title}
                  className="w-full h-56 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{blog.title}</h3>
                <p className="text-gray-700 mt-2">{blog.about}</p>
                <p className="text-sm text-gray-500 mt-4">
                  <strong>Category:</strong> {blog.category}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Author:</strong> {blog.adminName}
                </p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleUpdate(blog._id)} // Corrected blogId reference
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)} // Corrected blogId reference
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No blogs found.</p>
      )}
    </div>
  );
};

export default MyBlogs;
