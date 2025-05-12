import { 
  tours, type Tour, type InsertTour,
  destinations, type Destination, type InsertDestination,
  tourImages, type TourImage, type InsertTourImage,
  users, type User, type InsertUser,
  bookings, type Booking, type InsertBooking,
  reviews, type Review, type InsertReview
} from "@shared/schema";

// Define the storage interface for CRUD operations
export interface IStorage {
  // Tour operations
  getAllTours(): Promise<Tour[]>;
  getFeaturedTours(limit?: number): Promise<Tour[]>;
  getTourById(id: number): Promise<Tour | undefined>;
  searchTours(query: TourSearchQuery): Promise<Tour[]>;
  createTour(tour: InsertTour): Promise<Tour>;
  updateTour(id: number, tour: Partial<InsertTour>): Promise<Tour | undefined>;
  deleteTour(id: number): Promise<boolean>;
  
  // Destination operations
  getAllDestinations(): Promise<Destination[]>;
  getDestinationById(id: number): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  
  // Tour Image operations
  getTourImages(tourId: number): Promise<TourImage[]>;
  addTourImage(image: InsertTourImage): Promise<TourImage>;
  
  // User operations
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Booking operations
  getBookingsByUser(userId: number): Promise<Booking[]>;
  getBookingsByTour(tourId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Review operations
  getReviewsByTour(tourId: number): Promise<Review[]>;
  getReviewsByUser(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

// Define the search query interface
export interface TourSearchQuery {
  destination?: string;
  travelDate?: Date;
  numPeople?: number;
  minPrice?: number;
  maxPrice?: number;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private tours: Map<number, Tour>;
  private destinations: Map<number, Destination>;
  private tourImages: Map<number, TourImage>;
  private users: Map<number, User>;
  private bookings: Map<number, Booking>;
  private reviews: Map<number, Review>;
  
  private tourId: number;
  private destinationId: number;
  private tourImageId: number;
  private userId: number;
  private bookingId: number;
  private reviewId: number;
  
  constructor() {
    this.tours = new Map();
    this.destinations = new Map();
    this.tourImages = new Map();
    this.users = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    
    this.tourId = 1;
    this.destinationId = 1;
    this.tourImageId = 1;
    this.userId = 1;
    this.bookingId = 1;
    this.reviewId = 1;
    
    // Initialize with mock data
    this.initializeData();
  }
  
  private initializeData() {
    // Add some default destinations
    const destinations = [
      { name: "Hà Nội", province: "Hà Nội" },
      { name: "Hạ Long", province: "Quảng Ninh" },
      { name: "Đà Nẵng", province: "Đà Nẵng" },
      { name: "Hội An", province: "Quảng Nam" },
      { name: "Nha Trang", province: "Khánh Hòa" },
      { name: "Đà Lạt", province: "Lâm Đồng" },
      { name: "Phú Quốc", province: "Kiên Giang" },
      { name: "Hồ Chí Minh", province: "TP. Hồ Chí Minh" }
    ];
    
    destinations.forEach(dest => {
      this.createDestination({
        name: dest.name,
        province: dest.province
      });
    });
    
    // Create an admin user
    this.createUser({
      name: "Admin",
      email: "admin@travelnow.com",
      password: "admin123",
      phone: "0123456789",
    }) as User & { isAdmin: boolean };
    
    this.users.get(1)!.isAdmin = true;
  }
  
  // Tour operations
  async getAllTours(): Promise<Tour[]> {
    return Array.from(this.tours.values());
  }
  
  async getFeaturedTours(limit = 6): Promise<Tour[]> {
    return Array.from(this.tours.values())
      .filter(tour => tour.featured)
      .slice(0, limit);
  }
  
  async getTourById(id: number): Promise<Tour | undefined> {
    return this.tours.get(id);
  }
  
  async searchTours(query: TourSearchQuery): Promise<Tour[]> {
    let filteredTours = Array.from(this.tours.values());
    
    if (query.destination) {
      filteredTours = filteredTours.filter(tour => 
        tour.location.toLowerCase().includes(query.destination!.toLowerCase())
      );
    }
    
    if (query.minPrice !== undefined) {
      filteredTours = filteredTours.filter(tour => tour.price >= query.minPrice!);
    }
    
    if (query.maxPrice !== undefined) {
      filteredTours = filteredTours.filter(tour => tour.price <= query.maxPrice!);
    }
    
    return filteredTours;
  }
  
  async createTour(tour: InsertTour): Promise<Tour> {
    const id = this.tourId++;
    const newTour: Tour = {
      ...tour,
      id,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
      featured: tour.featured ?? false
    };
    
    this.tours.set(id, newTour);
    return newTour;
  }
  
  async updateTour(id: number, tour: Partial<InsertTour>): Promise<Tour | undefined> {
    const existingTour = this.tours.get(id);
    if (!existingTour) return undefined;
    
    const updatedTour: Tour = {
      ...existingTour,
      ...tour
    };
    
    this.tours.set(id, updatedTour);
    return updatedTour;
  }
  
  async deleteTour(id: number): Promise<boolean> {
    return this.tours.delete(id);
  }
  
  // Destination operations
  async getAllDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }
  
  async getDestinationById(id: number): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }
  
  async createDestination(destination: InsertDestination): Promise<Destination> {
    const id = this.destinationId++;
    const newDestination: Destination = {
      ...destination,
      id
    };
    
    this.destinations.set(id, newDestination);
    return newDestination;
  }
  
  // Tour Image operations
  async getTourImages(tourId: number): Promise<TourImage[]> {
    return Array.from(this.tourImages.values())
      .filter(image => image.tourId === tourId);
  }
  
  async addTourImage(image: InsertTourImage): Promise<TourImage> {
    const id = this.tourImageId++;
    const newImage: TourImage = {
      ...image,
      id
    };
    
    this.tourImages.set(id, newImage);
    return newImage;
  }
  
  // User operations
  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values())
      .find(user => user.email.toLowerCase() === email.toLowerCase());
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = {
      ...user,
      id,
      isAdmin: false
    };
    
    this.users.set(id, newUser);
    return newUser;
  }
  
  // Booking operations
  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.userId === userId);
  }
  
  async getBookingsByTour(tourId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.tourId === tourId);
  }
  
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingId++;
    const newBooking: Booking = {
      ...booking,
      id,
      bookingDate: new Date(),
      status: "pending"
    };
    
    this.bookings.set(id, newBooking);
    return newBooking;
  }
  
  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking: Booking = {
      ...booking,
      status
    };
    
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
  
  // Review operations
  async getReviewsByTour(tourId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.tourId === tourId);
  }
  
  async getReviewsByUser(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.userId === userId);
  }
  
  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const newReview: Review = {
      ...review,
      id,
      createdAt: new Date()
    };
    
    this.reviews.set(id, newReview);
    
    // Update tour rating
    const tour = this.tours.get(review.tourId);
    if (tour) {
      const tourReviews = await this.getReviewsByTour(review.tourId);
      const totalRating = tourReviews.reduce((sum, r) => sum + r.rating, 0);
      const newRating = totalRating / tourReviews.length;
      
      await this.updateTour(review.tourId, {
        rating: newRating,
        reviewCount: tourReviews.length
      });
    }
    
    return newReview;
  }
}

export const storage = new MemStorage();
