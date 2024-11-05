import axios from 'axios';
import { AuthenticationError, ForbiddenError } from '../../infrastructure/utils/errors.js';
import connectMysql from '../DB/connectMysqlDB.js'
import Listing from '../models/listing.js';
class ListingRepository {
    constructor(httpClient) {
        this.db = null;
        this.initPromise = this.init();
        this.httpClient = httpClient;
    }

    async init() {
        this.db = await connectMysql()
    }


    async findAll() {
        try {
            return await this.db.collection('listings').find().toArray();
        } catch (error) {
            console.error('Error fetching listings from the database:', error);
            throw new Error('Error fetching listings from the database');
        }
    }
    async getListingsTop5ByMoneyBooking() {
        await this.initPromise; // Ensure the database is initialized before proceeding
        if (!this.db) {
            throw new Error('Database not initialized');
        }
        try {
            //TypeError: Cannot read properties of null (reading 'query')  
            const [rows] = await this.db.query('SELECT * FROM listings ORDER BY saleAmount DESC LIMIT 5');
            return rows;
        } catch (error) {
            console.error('Error fetching listings from the database:', error);
            throw new Error('Error fetching listings from the database');
        }
    }


    async getListingsTop5ByBookingNumber() {
        try {
            const listings = await this.db.collection('listings').find().sort({ bookingNumber: -1 }).limit(5).toArray();
            return listings;
        } catch (error) {
            console.error('Error fetching listings from the database:', error);
            throw new Error('Error fetching listings from the database');
        }
    }


    async findOne({ id }) {
        try {
            const listing = await Listing.findOne({ where: { id: id } })
            return listing;
        } catch (error) {
            console.error('Error fetching listing:', error);
            throw error;
        }
    }

    async getListingCoordinates(id) {
        try {
            const response = await this.httpClient.get(`listings/${id}/coordinates`);
            return response.data;
        } catch (error) {
            console.error('Error fetching listing coordinates:', error);
            throw error;
        }
    }

    async getFeaturedListings(limit) {
        try {
            const response = await this.httpClient.get(`/featured-listings?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching featured listings:', error);
            throw error;
        }
    }

    async getTopListings(limit) {
        try {
            const response = await this.httpClient.get(`/top-listings?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching top listings:', error);
            throw error;
        }
    }

    async getListing(id) {
        try {
            const response = await this.httpClient.get(`/listings/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching listing:', error);
            throw error;
        }
    }



    async getAmenities(id) {
        try {
            const response = await this.httpClient.get(`listings/${id}/amenities`);
            return response.data;
        } catch (error) {
            console.error('Error fetching amenities:', error);
            throw error;
        }
    }

    async updateListing({ id, listing }) {
        try {
            const response = await this.httpClient.put(`/listings/${id}`, listing);
            return response.data;
        } catch (error) {
            console.error('Error updating listing:', error);
            throw error;
        }
    }

    async deleteListing(id) {
        try {
            const response = await this.httpClient.delete(`/listings/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting listing:', error);
            throw error;
        }
    }

    async createListing({ title, description, photoThumbnail, numOfBeds, costPerNight, locationType, amenities, hostId }) {
        // Implementation of the database interaction to create a listing
        const newListing = await this.database.Listing.create({
            title,
            description,
            photoThumbnail,
            numOfBeds,
            costPerNight,
            locationType,
            amenities,
            hostId,
        });

        // Assuming amenities is an array of IDs, you might need to handle its association separately.
        if (amenities && amenities.length > 0) {
            // Handle association logic here
            await this.database.ListingAmenities.bulkCreate(
                amenities.map(amenityId => ({ listingId: newListing.id, amenityId }))
            );
        }

        return newListing;
    }

    async getBookingsForListing(listingId) {
        try {
            const response = await this.httpClient.get(`/bookings?listingId=${listingId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching bookings for listing:', error);
            throw error;
        }
    }

    async getListings() {
        try {
            const response = await this.httpClient.get(`/listings`);
            return response.data;
        } catch (error) {
            console.error('Error fetching listings:', error);
            throw error;
        }
    }

    async getListingByHostId(hostId) {
        try {
            const response = await this.httpClient.get(`/listings?hostId=${hostId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching listings by host:', error);
            throw error;
        }
    }

    async getAllAmenities() { // Renamed to follow camelCase convention
        try {
            const response = await this.httpClient.get(`/amenities`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all amenities:', error);
            throw error;
        }
    }
}

export default ListingRepository;