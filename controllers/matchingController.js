import Seller from '../models/seller.js';
import Buyer from '../models/buyer.js';
import { createNotification } from './notificationController.js';

export const checkMatchingDataAndNotify = async (req, res) => {
  try {
    const sellers = await Seller.find();

    for (const seller of sellers) {
      const { country, city, area } = seller;

      // Normalize fields to lowercase and trim whitespace
      const normalizedCountry = country.trim().toLowerCase();
      const normalizedCity = city.trim().toLowerCase();
      const normalizedArea = area.trim().toLowerCase();

      // Find matching buyers
      const matchingBuyers = await Buyer.find({
        country: normalizedCountry,
        city: normalizedCity,
        area: normalizedArea,
      });

      console.log(
        `Seller: ${seller._id}, Matches Found: ${matchingBuyers.length}`
      );

      if (matchingBuyers.length > 0) {
        // Notify seller
        await createNotification(
          `Buyers in your area (${city}, ${country}) are available.`,
          'Seller',
          seller._id
        );

        // Notify buyers
        for (const buyer of matchingBuyers) {
          console.log(
            `Notifying Buyer: ${buyer._id} for Seller: ${seller._id}`
          );
          await createNotification(
            `Sellers in your area (${city}, ${country}) are available.`,
            'Buyer',
            buyer._id
          );
        }
      }
    }

    res.status(200).json({ message: 'Notifications sent successfully!' });
  } catch (error) {
    console.error('Error in matching logic:', error);
    res.status(500).json({ message: error.message });
  }
};
