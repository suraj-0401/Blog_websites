import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary'; 
import cookieParser from 'cookie-parser'; 
import userRoute from './routes/route.user.js'; 
import blogRoute from './routes/route.blog.js'; 
import commentRoute from './routes/route.comment.js';
import postsummary from './routes/route.postsummary.js'
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
dotenv.config(); 
const app = express();
const server = http.createServer(app); 
const io = new Server(server, { cors: { origin: '*' } });

// path 
const _dirname=path.resolve();


app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.options('*', cors()); 

app.use(cookieParser()); 
app.use(express.json()); 

const port = process.env.PORT || 3000; 
const MONGO_URL = process.env.MONGO_URL; 

if (!MONGO_URL) {
  console.error('MONGO_URL environment variable is not set');
  process.exit(1);
}

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/temp/",
}));

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_SECRET_KEY
});

mongoose.connect(MONGO_URL) 
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });



app.use('/api/users', userRoute); 
app.use('/api/blogs', blogRoute); 
app.use('/api/comment', commentRoute);
app.use('/api/postsummaryRoutes',postsummary);

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


app.use(express.static(path.join(_dirname,'/FRONTEND/build')))

app.get('*',(_,res)=>{
  res.sendFile(path.resolve(_dirname,"FRONTEND","build","index.html"))
})


server.listen(port, () => { 
  console.log(`Server running on port ${port}`);
}).on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});


