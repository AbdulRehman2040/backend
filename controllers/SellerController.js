import Seller from '../models/seller.js';

// Create a new seller
export const createSeller = async (req, res) => {
  try {
    const seller = await Seller.create(req.body);
    res.status(201).json(seller);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all sellers
export const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single seller by ID
export const getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a seller
// export const updateSeller = async (req, res) => {
//   try {
//     const seller = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!seller) return res.status(404).json({ message: 'Seller not found' });
//     res.status(200).json(seller);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const updateSeller = async (req, res) => {
  try {
    // Ensure at least one required field is provided
    if (!req.body.propertyStatus && !req.body.subscriptionStatus) {
      return res.status(400).json({ message: "Property status or Subscription status is required" });
    }

    // Update only the specified fields
    const updateFields = {};
    if (req.body.propertyStatus) updateFields.propertyStatus = req.body.propertyStatus;
    if (req.body.subscriptionStatus) updateFields.subscriptionStatus = req.body.subscriptionStatus;

    const seller = await Seller.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({
      message: "Seller updated successfully",
      updatedSeller: seller,
    });
  } catch (error) {
    console.error("Error updating seller:", error);
    res.status(500).json({ message: error.message });
  }
};


// Delete a seller
export const deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);
    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    res.status(200).json({ message: 'Seller deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
