import express from 'express';
import { 
  createLead, 
  getAllLeads, 
  getJasminJeddahLeads, 
  getLeadById, 
  updateLead, 
  deleteLead,
  exportLeadsExcel 
} from '../controllers/leadController.js';

const router = express.Router();

// ✅ CRUD Endpoints
router.post('/leads', createLead);                // Create
router.get('/leads', getAllLeads);                // Read all
router.get('/leads/jasmin-jeddah', getJasminJeddahLeads); // Filtered read
router.get('/leads/:id', getLeadById);            // Read one
router.put('/leads/:id', updateLead);             // Update
router.delete('/leads/:id', deleteLead);          // Delete

// ✅ Excel Export Endpoint
router.get('/leads-export', exportLeadsExcel);    // Export leads to Excel

export default router;
