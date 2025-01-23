export const checkMatchingDataAndNotify = async (req, res) => {
  try {
    const sellers = await Seller.find();

    for (const seller of sellers) {
      const normalizedCountry = (seller.country || '').trim().toLowerCase();
      const normalizedCity = (seller.city || '').trim().toLowerCase();
      const normalizedArea = (seller.area || '').trim().toLowerCase();

      const matchingBuyers = await Buyer.find({
        country: normalizedCountry,
        city: normalizedCity,
        area: normalizedArea,
      });

      if (matchingBuyers.length > 0) {
        await createNotification(
          `Buyers in your area (${seller.city}, ${seller.country}) are available.`,
          'Seller',
          seller._id
        );

        for (const buyer of matchingBuyers) {
          await createNotification(
            `Sellers in your area (${buyer.city}, ${buyer.country}) are available.`,
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
