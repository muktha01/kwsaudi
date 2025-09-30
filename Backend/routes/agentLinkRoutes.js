import express from 'express';
import {
 getLinks, updateLink, createLink 
} from '../controllers/agentLinkController.js';

const router = express.Router();

router.get("/", getLinks);
router.post("/", createLink);
router.put("/:id", updateLink);

export default router;