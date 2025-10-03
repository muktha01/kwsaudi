import express from 'express';

import { syncAgentsFromKWPeople, fetchAgentOrProperties, syncAgentsFromMultipleKWPeople, getAgentByEmail, getKWCombinedData, getKWPeopleByOrg, getKWListingsByRegion, getAgentWithProperties, getAllAgentsWithPropertyCounts, getKWAgentsOnly } from '../controllers/agentController.js';
const router = express.Router();
router.get('/agents/by-email', getAgentByEmail);
router.get('/agents/byid/:agentId', fetchAgentOrProperties);


router.get('/agent/:org_id', syncAgentsFromKWPeople);
router.get('/agents/merge', syncAgentsFromMultipleKWPeople);

// Properties route for fetching properties with agents
router.post('/properties', fetchAgentOrProperties);

// NEW TESTING ENDPOINTS
router.get('/kw/orgs/:orgId/people', getKWPeopleByOrg);
router.get('/kw/regions/:regionId/listings', getKWListingsByRegion);
router.get('/kw/combined-data', getKWCombinedData);
router.get('/kw/agents-only', getKWAgentsOnly); // Fast agents endpoint

// NEW: Agent with their matched properties
router.get('/kw/agent/:agentId/properties', getAgentWithProperties);

// NEW: All agents with property counts
router.get('/kw/agents/property-counts', getAllAgentsWithPropertyCounts);

// router.get('/agents', getCombinedListings);
router.get('/combined-data', getKWCombinedData);


// router.post('/properties', fetchPropertiesWithAgents);
export default router;

