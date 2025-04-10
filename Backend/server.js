const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require("mongoose"); // Add mongoose import
const cookieParser = require('cookie-parser');require("dotenv").config();
const PORT = process.env.PORT || 3000;
const userRoutes = require("./routes/user")
const authRoutes = require("./routes/auth")
const doctorRoutes = require('./routes/doctor')
const patientRoutes = require('./routes/patient')
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

mongoose.connection.on("error", err => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser())

app.use('/users', userRoutes);
app.use('/auth',authRoutes)
app.use('/api/doctors',doctorRoutes);
app.use('/api/patients',patientRoutes);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
