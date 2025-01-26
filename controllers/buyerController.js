import Buyer from '../models/buyer.js';

// Create a new buyer
export const createBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.create(req.body);
    res.status(201).json(buyer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all buyers
export const getAllBuyers = async (req, res) => {
  try {
    const buyers = await Buyer.find();
    res.status(200).json(buyers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single buyer by ID
export const getBuyerById = async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.params.id);
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });
    res.status(200).json(buyer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a buyer
// export const updateBuyer = async (req, res) => {
//   try {
//     const buyer = await Buyer.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!buyer) return res.status(404).json({ message: 'Buyer not found' });
//     res.status(200).json(buyer);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const updateBuyer = async (req, res) => {
  try {
    // Log the incoming request body to debug
    console.log("Request body:", req.body);

    // Ensure only the `propertyStatus` field is updated
    const buyer = await Buyer.findByIdAndUpdate(
      req.params.id,
      { propertyStatus: req.body.propertyStatus }, // Update only this field
      { new: true } // Return the updated document
    );

    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    res.status(200).json({
      message: "Buyer updated successfully",
      updatedBuyer: buyer, // Return the updated document
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete a buyer
export const deleteBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.findByIdAndDelete(req.params.id);
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });
    res.status(200).json({ message: 'Buyer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
