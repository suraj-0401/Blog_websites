
# Blog Application - Full Stack (MERN)

A full-stack blog application built using MERN (MongoDB, Express.js, React.js, Node.js) that allows users to create, update, view, and delete blogs. This project supports authentication with JWT for secure access.

### Technologies Used**
- Frontend**: React.js, Tailwind CSS, Axios
- Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT
- Deployment**: Render

---

## Features
- Authentication**: Register, login, and secure access with JWT.
- Blog Management**: Create, read, update, and delete blogs.
- Responsive UI**: Built with Tailwind CSS for a mobile-friendly interface.

---

## Installation Instructions**

### 1. Clone the Repository**
```bash
git clone https://github.com/your-username/blog-application.git
```

### 2. Backend Setup**
- Navigate to the backend folder and install dependencies:
  ```bash
  cd blog-application/backend
  npm install
  ```
- Create a `.env` file:
  ```plaintext
  PORT=5000
  MONGO_URI=your-mongo-uri
  JWT_SECRET=your-jwt-secret
  ```
- Start the server:
  ```bash
  npm start
  ```

### 3. Frontend Setup
- Navigate to the frontend folder and install dependencies:
  ```bash
  cd blog-application/frontend
  npm install
  ```
- Create a `.env` file with the backend URL:
  ```plaintext
  REACT_APP_API_URL=http://localhost:5000
  ```
- Start the frontend server:
  ```bash
  npm start
  ```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a user.
- `POST /api/auth/login` - Login a user.

### Blog Management
- `GET /api/blogs/getMyBlog` - Get user’s blogs.
- `POST /api/blogs/createBlog` - Create a new blog.
- `PUT /api/blogs/updateBlog/:id` - Update a blog by ID.
- `DELETE /api/blogs/deleteBlog/:id` - Delete a blog by ID.

---

## Deployment on Render

### Backend Deployment**
1. Create a new Web Service on Render.
2. Connect your GitHub repository, select the backend project.
3. Set build and start commands:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Set environment variables (`MONGO_URI`, `JWT_SECRET`).

### Frontend Deployment
1. Create a new Static Site on Render.
2. Set build and start commands:
   - Build Command: `npm install && npm run build`
   - Start Command: `serve -s build`
3. Set environment variable (`REACT_APP_API_URL`).

---

## Contributing
1. Fork the repo.
2. Create a new branch.
3. Commit changes and push.
4. Open a Pull Request.

