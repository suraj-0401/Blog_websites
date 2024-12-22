import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // to get params from the URL
import toast from "react-hot-toast";

const UpdateBlog = () => {
  const { id } = useParams(); // Fetch the blog ID from the URL parameter
  const navigate = useNavigate(); // For navigation after update
  
  // State to store blog details
  const [blog, setBlog] = useState({
    title: "",
    about: "",
    category: "",
    blogImage: "", // Image URL if needed
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the blog data on component mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token"); // Fetch token from localStorage
        if (!token) {
          setError("Authentication token not found.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request header
          },
        });

        // Populate the state with the fetched blog data
        setBlog(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch blog data");
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]); // Dependency array ensures the effect runs when the `id` changes

  // Handle form submission to update the blog
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    try {
      // Prepare the blog data for the PUT request
      const updatedBlog = {
        title: blog.title,
        about: blog.about,
        category: blog.category,
        blogImage: blog.blogImage, // Include image if it's part of the update
      };

      const response = await axios.put(
        `http://localhost:3000/api/blogs/updateBlog/${id}`, // Update the blog using PUT request
        updatedBlog,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );

      // Redirect user to the "MyBlogs" page after successful update
      // navigate("my blogs");
      toast.success('Successfully updated');
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update blog");
    }
  };

  // Show loading spinner if data is still being fetched
  if (loading) return <div>Loading...</div>;

  // Show error message if something goes wrong
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-6xl mt-20 mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Update Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={blog.title}
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* About Input */}
        <div>
          <label htmlFor="about" className="block text-sm font-medium text-gray-700">About</label>
          <textarea
            id="about"
            value={blog.about}
            onChange={(e) => setBlog({ ...blog, about: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          ></textarea>
        </div>

        {/* Category Input */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            id="category"
            value={blog.category}
            onChange={(e) => setBlog({ ...blog, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Blog Image URL Input */}
        <div>
          <label htmlFor="blogImage" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            id="blogImage"
            value={blog.blogImage || ""}
            onChange={(e) => setBlog({ ...blog, blogImage: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Update Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBlog;
