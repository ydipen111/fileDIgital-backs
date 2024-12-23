import express from "express"
import cors from 'cors'
import auth from './routes/authRoutes.js'
import fileRoutes from './routes/fileRoutes.js'
import mongoose from "mongoose";
import fileUpload from "express-fileupload";



const app = express();
const port = 9999;

app.use(express.json());
app.use(express.static('Uploads')); // Serves uploaded files
app.use(fileUpload());

app.use(cors());

mongoose.connect('mongodb+srv://DipenDra:Dipendra123@cluster0.h9oaq.mongodb.net/file-Digitilization').then((val) => {

}).catch((err) => {
  console.log(err);

})

app.get('/', (req, res) => {
  return res.status(200).json({ message: "welcome to home page" })
})


app.use('/api/users', auth)
app.use('/api/file', fileRoutes)

app.listen(port, () => {
  console.log(`Server is running in ${port}`);
})


