import cloudinary from 'cloudinary'; // Import Cloudinary for file uploads
import { Blog } from '../models/model.blog.js';
import mongoose from 'mongoose';
import { User } from '../models/model.user.js';

const sendErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ message });
};

// Create a blog
export const createBlog = async (req, res) => {
    const{email}=req.body;
    if (!req.files || Object.keys(req.files).length === 0) {
        return sendErrorResponse(res, 400, "Blog image is required");
    }

    const blogImage = req.files.blogImage || req.files[Object.keys(req.files)[0]];

    if (!blogImage) {
        return sendErrorResponse(res, 400, "No image file uploaded");
    }

    const allowedFormats = ["image/jpg", "image/jpeg", "image/png"];
    if (!allowedFormats.includes(blogImage.mimetype)) {
        return sendErrorResponse(res, 400, "Invalid image format. Only jpg, jpeg, and png are allowed");
    }

    const maxSize = 5 * 1024 * 1024; 
    if (blogImage.size > maxSize) {
        return sendErrorResponse(res, 400, "Image size exceeds the 5MB limit");
    }

    const { category, title, about } = req.body;

    if (!category || !title || !about) {
        return sendErrorResponse(res, 400, "Title, category, and about are required fields");
    }
    const user = await User.findOne({ email }).select("password role name email _id");
    
    if (!req.user || !req.user._id) {
        return sendErrorResponse(res, 401, "Unauthorized. Please log in to create a blog.");
    }

    const adminName = req.user.name;
    const adminImage = req.user.photo?.url;
    const createdBy = req.user._id;

    try {
        const cloudinaryResponse = await cloudinary.v2.uploader.upload(blogImage.tempFilePath);

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.log(cloudinaryResponse.error);
            return sendErrorResponse(res, 500, "Error uploading image");
        }

        const blogData = {
            title,
            about,
            category,
            adminName,
            adminImage,
            createdBy,
            blogImage: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            },
        };

        const blog = await Blog.create(blogData);
        return res.status(201).json({ message: "Blog created successfully", blogId: blog._id });
    } catch (error) {
        console.error(error);
        return sendErrorResponse(res, 500, "Internal Server Error");
    }
};


// delete the blogs 
export const deleteBlog = async (req, res) => {
    try {
        // Extract the ID from the request parameters
        const { id } = req.params;

        // Find the blog by its MongoDB _id
        const blog = await Blog.findById(id);

        // Check if the blog exists
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Delete the blog
        await blog.deleteOne();

        // Send success response
        return res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// update the blogs
// Update blog route in the backend
export const updateBlog = async (req, res) => {
    const { id } = req.params;
    
    // Validate blog ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Blog ID" });
    }
  
    // Update the blog
    const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
  
    res.status(200).json(blog);
  };
  
// getting all blogs 
export const getAllBlogs = async (req, res) => {
    try {
        
      const allBlogs = await Blog.find().exec();
      res.status(200).json(allBlogs);
    } catch (error) {
    
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

// get single blogs
 export const getSingleBlog=async(req,res)=>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res
        .status(400)
        .json({message:"Invalid Blog id"})
    }
    const blog=await Blog.findById(id);
    if(!blog){
        return res
        .status(404)
        .json({message:"Blog not found"});
    }
    res.status(200).json(blog);
 }

//  myblogs
export const getMyBlog = async (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "Unauthorized. Please log in to view your blogs." });
      }
  
      const userId = req.user._id;
  
      const blogs = await Blog.find({ createdBy: userId }).sort({ createdAt: -1 });
  
      if (!blogs || blogs.length === 0) {
        return res.status(404).json({ message: "No blogs found for this user." });
      }
  
      return res.status(200).json({
        message: "Blogs retrieved successfully",
        blogs,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  };
  


// related Blog
export const getRelatedBlog = async (req, res) => {
    const { category } = req.body; // Extract category from the request body

    if (!category) {
        return res.status(400).json({ message: "Category is required" });
    }

    try {
        // Find blogs that match the provided category
        const relatedBlogs = await Blog.find({ category }).exec();

        // Check if any related blogs were found
        if (relatedBlogs.length === 0) {
            return res.status(404).json({ message: "No related blogs found" });
        }

        res.status(200).json(relatedBlogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error occurred while fetching related blogs" });
    }
}
