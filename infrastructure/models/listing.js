import { Model, DataTypes, ENUM } from 'sequelize';
import sequelize from './seq.js'; // Adjust the path as necessary
import Coordinate from './coordinate.js'; // Import Coordinate model
class Listing extends Model { }

Listing.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  costPerNight: DataTypes.FLOAT,
  hostId: DataTypes.STRING,
  locationType: DataTypes.STRING,
  numOfBeds: DataTypes.INTEGER,
  photoThumbnail: DataTypes.STRING,
  isFeatured: DataTypes.BOOLEAN,
  saleAmount: DataTypes.FLOAT,
  bookingNumber: DataTypes.INTEGER,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  checkInDate: DataTypes.DATE,
  checkOutDate: DataTypes.DATE,
  totalCost: {
    type: DataTypes.VIRTUAL,
    get() {
      const checkIn = new Date(this.checkInDate);
      const checkOut = new Date(this.checkOutDate);
      const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return this.costPerNight * numberOfNights;
    }
  },
  listingStatus: {
    type: DataTypes.ENUM,
    values: ['ACTIVE', 'PENDING', 'SOLD', 'DELETED', 'REJECT', 'CANCELLED', 'EXPIRED', 'COMPLETED'],
    set(value) {
      // Log the value to ensure it's being set
      console.log(`Setting listingStatus to: ${value}`);

      // Add any custom logic before setting the value
      if (this.isFeatured && value === 'SOLD') {
        throw new Error('Featured listings cannot be set to SOLD.');
      }

      // Set the value using the default setter
      this.setDataValue('listingStatus', value);
    }
  },
}, {
  sequelize,
  modelName: 'Listing',
  timestamps: true,
});
Listing.hasOne(Coordinate, { foreignKey: 'listingId', as: 'coordinate' });
// Export the model
export default Listing;


