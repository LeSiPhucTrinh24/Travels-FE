import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTourSchema, 
  insertDestinationSchema, 
  insertTourImageSchema,
  insertUserSchema, 
  insertBookingSchema, 
  insertReviewSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API router
  const apiRouter = express.Router();
  
  // TOURS API
  apiRouter.get("/tours", async (req: Request, res: Response) => {
    try {
      const tours = await storage.getAllTours();
      res.json(tours);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tours" });
    }
  });
  
  apiRouter.get("/tours/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const tours = await storage.getFeaturedTours(limit);
      res.json(tours);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured tours" });
    }
  });
  
  apiRouter.get("/tours/:id", async (req: Request, res: Response) => {
    try {
      const tourId = parseInt(req.params.id);
      const tour = await storage.getTourById(tourId);
      
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      
      res.json(tour);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tour" });
    }
  });
  
  apiRouter.post("/tours/search", async (req: Request, res: Response) => {
    try {
      const { destination, travelDate, numPeople, minPrice, maxPrice } = req.body;
      
      const searchQuery = {
        destination,
        travelDate: travelDate ? new Date(travelDate) : undefined,
        numPeople: numPeople ? parseInt(numPeople) : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
      };
      
      const tours = await storage.searchTours(searchQuery);
      res.json(tours);
    } catch (error) {
      res.status(500).json({ message: "Failed to search tours" });
    }
  });
  
  apiRouter.post("/tours", async (req: Request, res: Response) => {
    try {
      const tourData = insertTourSchema.parse(req.body);
      const tour = await storage.createTour(tourData);
      res.status(201).json(tour);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tour data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create tour" });
    }
  });
  
  apiRouter.put("/tours/:id", async (req: Request, res: Response) => {
    try {
      const tourId = parseInt(req.params.id);
      const tourData = req.body;
      
      const tour = await storage.updateTour(tourId, tourData);
      
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      
      res.json(tour);
    } catch (error) {
      res.status(500).json({ message: "Failed to update tour" });
    }
  });
  
  apiRouter.delete("/tours/:id", async (req: Request, res: Response) => {
    try {
      const tourId = parseInt(req.params.id);
      const success = await storage.deleteTour(tourId);
      
      if (!success) {
        return res.status(404).json({ message: "Tour not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete tour" });
    }
  });
  
  // DESTINATIONS API
  apiRouter.get("/destinations", async (req: Request, res: Response) => {
    try {
      const destinations = await storage.getAllDestinations();
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });
  
  apiRouter.post("/destinations", async (req: Request, res: Response) => {
    try {
      const destinationData = insertDestinationSchema.parse(req.body);
      const destination = await storage.createDestination(destinationData);
      res.status(201).json(destination);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid destination data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create destination" });
    }
  });
  
  // TOUR IMAGES API
  apiRouter.get("/tours/:id/images", async (req: Request, res: Response) => {
    try {
      const tourId = parseInt(req.params.id);
      const images = await storage.getTourImages(tourId);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tour images" });
    }
  });
  
  apiRouter.post("/tour-images", async (req: Request, res: Response) => {
    try {
      const imageData = insertTourImageSchema.parse(req.body);
      const image = await storage.addTourImage(imageData);
      res.status(201).json(image);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid image data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add tour image" });
    }
  });
  
  // USERS API
  apiRouter.post("/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  // BOOKINGS API
  apiRouter.get("/users/:id/bookings", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const bookings = await storage.getBookingsByUser(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user bookings" });
    }
  });
  
  apiRouter.post("/bookings", async (req: Request, res: Response) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });
  
  apiRouter.put("/bookings/:id/status", async (req: Request, res: Response) => {
    try {
      const bookingId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      const booking = await storage.updateBookingStatus(bookingId, status);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });
  
  // REVIEWS API
  apiRouter.get("/tours/:id/reviews", async (req: Request, res: Response) => {
    try {
      const tourId = parseInt(req.params.id);
      const reviews = await storage.getReviewsByTour(tourId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tour reviews" });
    }
  });
  
  apiRouter.post("/reviews", async (req: Request, res: Response) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });
  
  // Mount API router to /api path
  app.use("/api", apiRouter);
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
