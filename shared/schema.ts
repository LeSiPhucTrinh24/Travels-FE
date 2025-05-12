import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tour table - Represents a travel tour
export const tours = pgTable("tours", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  duration: text("duration").notNull(), // e.g. "2 days 1 night"
  location: text("location").notNull(),
  rating: doublePrecision("rating").default(0),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  featured: boolean("featured").default(false),
});

// Destinations table - Represents locations tours can visit
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  province: text("province").notNull()
});

// Tour Images table - Stores images for each tour
export const tourImages = pgTable("tour_images", {
  id: serial("id").primaryKey(),
  tourId: integer("tour_id").notNull(),
  url: text("url").notNull(),
});

// Users table - Represents users of the system
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  isAdmin: boolean("is_admin").default(false)
});

// Bookings table - Represents tour bookings by users
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tourId: integer("tour_id").notNull(),
  bookingDate: timestamp("booking_date").defaultNow(),
  travelDate: timestamp("travel_date").notNull(),
  numPeople: integer("num_people").notNull(),
  totalPrice: doublePrecision("total_price").notNull(),
  status: text("status").default("pending"), // pending, confirmed, cancelled
});

// Reviews table - Represents user reviews for tours
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tourId: integer("tour_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Create Zod schemas for inserting data
export const insertTourSchema = createInsertSchema(tours).omit({ id: true, rating: true, reviewCount: true, createdAt: true });
export const insertDestinationSchema = createInsertSchema(destinations).omit({ id: true });
export const insertTourImageSchema = createInsertSchema(tourImages).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, isAdmin: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, bookingDate: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });

// Create types for inserting/selecting data
export type InsertTour = z.infer<typeof insertTourSchema>;
export type Tour = typeof tours.$inferSelect;
export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;
export type InsertTourImage = z.infer<typeof insertTourImageSchema>;
export type TourImage = typeof tourImages.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
