import express from "express";
import cors from 'cors';
import auth from './routes/authRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import archiveRoutes from "./routes/archiveRoutes.js";
import ocr from "./routes/ocrRoutes.js";
import connectDB from "./db.js";
// import dotenv from 'dotenv';



const app = express();
const port = 9999;
// dotenv.config();

app.use(express.json());
app.use(express.static('Uploads')); // Serves uploaded files
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use(cors({
  origin: ['http://localhost:5173', 'http://192.168.18.108:9999'],
  credentials: true,
}));

connectDB();

// mongoose.connect('mongodb+srv://DipenDra:Dipendra123@cluster0.h9oaq.mongodb.net/file-Digitilization').then((val) => {
//   console.log("Connected to MongoDB");
// }).catch((err) => {
//   console.log(err);
// });

app.get('/', (req, res) => {
  return res.status(200).json({ message: "welcome to home page" });
});

app.use('/api/users', auth);
app.use('/api/file', fileRoutes);
app.use('/api/archive', archiveRoutes);
app.use('/api/ocrd', ocr);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});