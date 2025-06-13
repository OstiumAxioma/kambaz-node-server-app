import express from 'express';
import mongoose from "mongoose";
import session from "express-session";
import "dotenv/config";
import Hello from './Hello.js';
import Lab5 from './Lab5/index.js';
import PathParameters from './Lab5/PathParameters.js';
import QueryParameters from './Lab5/QueryParameters.js';
import WorkingWithObjects from './Lab5/WorkingWithObjects.js';
import WorkingWithArrays from './Lab5/WorkingWithArrays.js';
import userRoutes from "./Kambaz/Users/routes.js";
import courseRoutes from "./Kambaz/Courses/routes.js";
import enrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import moduleRoutes from "./Kambaz/Modules/routes.js";
import assignmentRoutes from "./Kambaz/Assignments/routes.js";
import cors from "cors";

console.log("Loading moduleRoutes:", typeof moduleRoutes);
console.log("moduleRoutes:", moduleRoutes);

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";

// MongoDB connection with error handling
mongoose.connect(CONNECTION_STRING)
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

// Monitor MongoDB connection
mongoose.connection.on('error', (error) => {
  console.error("MongoDB connection error:", error);
});

mongoose.connection.on('disconnected', () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on('reconnected', () => {
  console.log("MongoDB reconnected");
});

const app = express();
app.use(
    cors({
        credentials: true,
        origin: true, // Temporarily allow all origins for debugging
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
);
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
};
    if (process.env.NODE_ENV !== "development") {
        sessionOptions.proxy = true;
        sessionOptions.cookie = {
            sameSite: "none",
            secure: true,
            domain: process.env.NODE_SERVER_DOMAIN,
        };
}
app.use(session(sessionOptions));
  
app.use(express.json());

// Add debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Test inline modules route
app.get("/api/modules/inline-test", (req, res) => {
  res.json({ 
    message: "Inline modules route working!", 
    timestamp: new Date().toISOString(),
    version: "inline-v1.0"
  });
});

// Register routes - more specific routes first
console.log("Registering /api/modules with moduleRoutes");
app.use("/api/modules", moduleRoutes);  // Move modules to the top
console.log("Module routes registered successfully");
app.use("/api", Hello);
app.use("/api", Lab5);
app.use("/api", PathParameters);
app.use("/api", QueryParameters);
app.use("/api", WorkingWithObjects);
app.use("/api", WorkingWithArrays);
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api", assignmentRoutes);

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Add a catch-all route for undefined routes
app.use((req, res) => {
  console.log("Route not found:", req.method, req.originalUrl);
  res.status(404).json({ 
    message: "Route not found",
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  console.error("Stack:", err.stack);
  res.status(500).json({ 
    message: "Something went wrong!", 
    error: process.env.NODE_ENV === "development" ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});