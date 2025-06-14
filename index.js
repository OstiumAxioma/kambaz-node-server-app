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

console.log("=== SERVER STARTUP DEBUG ===");
console.log("Loading moduleRoutes:", typeof moduleRoutes);
console.log("moduleRoutes keys:", Object.keys(moduleRoutes || {}));

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

// Add comprehensive debug middleware
app.use((req, res, next) => {
  console.log(`=== REQUEST DEBUG ===`);
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log(`Headers:`, req.headers);
  console.log(`Body:`, req.body);
  next();
});

// MODULES ROUTES FIRST - HIGHEST PRIORITY
console.log("=== REGISTERING MODULES ROUTES ===");
if (moduleRoutes) {
  console.log("moduleRoutes is valid, registering...");
  app.use("/api/modules", moduleRoutes);
  console.log("✅ Module routes registered at /api/modules");
} else {
  console.error("❌ moduleRoutes is null or undefined!");
}

// Test inline modules route as backup
app.get("/api/modules/inline-test", (req, res) => {
  console.log("=== INLINE TEST ROUTE HIT ===");
  res.json({ 
    message: "Inline modules route working!", 
    timestamp: new Date().toISOString(),
    version: "inline-v2.0",
    environment: process.env.NODE_ENV || "development"
  });
});

// Register other routes
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
  console.log(`FALLTHROUGH: ${req.method} ${req.originalUrl}`);
  next();
});

// Add a catch-all route for undefined routes
app.use((req, res) => {
  console.log("=== ROUTE NOT FOUND ===");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Headers:", req.headers);
  res.status(404).json({ 
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("=== ERROR HANDLER ===");
  console.error("Error:", err);
  console.error("Stack:", err.stack);
  res.status(500).json({ 
    message: "Something went wrong!", 
    error: process.env.NODE_ENV === "development" ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`=== SERVER STARTED ===`);
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`MongoDB: ${CONNECTION_STRING}`);
});