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
    console.log("Request body:", req.body);
    console.log("Request params:", req.params);

    const buyer = await Buyer.findByIdAndUpdate(
      req.params.id,
      {
        propertyStatus: req.body.propertyStatus,
        subscriptionStatus: req.body.subscriptionStatus,
        adminNotes: req.body.adminNotes,
      },
      { new: true }
    );

    if (!buyer) {
      console.log("Buyer not found for ID:", req.params.id);
      return res.status(404).json({ message: "Buyer not found" });
    }

    console.log("Updated buyer:", buyer);
    res.status(200).json({
      message: "Buyer updated successfully",
      updatedBuyer: buyer,
    });
  } catch (error) {
    console.error("Error updating buyer:", error);
    res.status(500).json({ message: error.message, stack: error.stack }); // Include stack trace
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