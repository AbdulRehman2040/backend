import express from 'express';
import {
  createBuyer,
  getAllBuyers,
  getBuyerById,
  updateBuyer,
  deleteBuyer,
} from '../controllers/buyerController.js';
// import { authenticateAdmin} from '../controllers/authenticateadmin.js'
import authenticateAdmin from '../controllers/authenticateadmin.js'

const router = express.Router();

router.post('/', createBuyer);
router.get('/', getAllBuyers);
router.get('/:id', getBuyerById);
router.put('/:id',updateBuyer);
router.delete('/:id', deleteBuyer);

export default router;
