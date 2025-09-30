import express from 'express';
import {
  getExternalListings,
  getPropertyById,
  getFilterOptions,
  newdevelomentListings
} from '../controllers/listingController.js';
import upload  from '../middlewares/upload.js';

const router = express.Router();


// New development listing (collection) route
// router.get('/property/newdevelopment', getFilteredListings)
// router.post('/property/newdevelopment', getFilteredListings)
// Backward-compat (older clients may have used a param; handler ignores it)
// router.get('/property/newdevelopment/:id', getFilteredListings)
// New route: Get property by ID
router.get('/property/:id', getPropertyById);

router.post('/list/properties',  getExternalListings);
router.post('/list/newproperties',  newdevelomentListings);
router.get('/filters', getFilterOptions);

export default router;
