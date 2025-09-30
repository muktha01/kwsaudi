

import Agent from '../models/Agent.js';
import axios from 'axios';
// Get agent by email
export const getAgentByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    // Use kw_email for lookup
    const agent = await Agent.findOne({ kw_email: { $regex: `^${email}$`, $options: 'i' } });
    if (!agent) return res.status(404).json({ success: false, message: "Agent not found" });
    res.status(200).json({ success: true, agent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const fetchAgentOrProperties = async (req, res) => {
  try {
    const { org_id, singleAgent, page: reqPage, limit: reqLimit } = { 
      ...req.body, 
      ...req.query 
    };
    const agentId = req.params.agentId;  // Expect agentId in route param

    // Single agent fetch case
    if (agentId) {
      let agent = null;

      // Try find by kw_uid first
      agent = await Agent.findOne({ kw_uid: agentId });

      // Fallback to MongoDB _id search (in case frontend passes _id)
      if (!agent && /^[0-9a-fA-F]{24}$/.test(agentId)) {
        agent = await Agent.findById(agentId);
      }

      if (!agent) {
        return res.status(404).json({ success: false, message: 'Agent not found' });
      }

      return res.status(200).json({ success: true, agent });
    }

    // Properties fetch logic (unchanged from your previous code)
    const page = Number(reqPage ?? 1);
    const perPage = Number(reqLimit ?? 50);

    if (page < 1 || perPage < 1 || perPage > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pagination parameters',
        error: 'Page must be ≥1 and limit must be between 1 and 1000'
      });
    }

    const orgIds = org_id ? [Number(org_id)] : [2414288, 50449];

    const headers = {
      Authorization: 'Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==',
      Accept: 'application/json',
    };

    let allAgents = [];
    for (const currentOrgId of orgIds) {
      let offset = 0;
      const apiLimit = 1000;
      let totalCount = 0;
      let first = true;

      do {
        const url = `https://partners.api.kw.com/v2/listings/orgs/${currentOrgId}/people?page[offset]=${offset}&page[limit]=${apiLimit}`;

        const response = await axios.get(url, { headers });

        let agentsPage = [];
        if (Array.isArray(response.data?.people)) {
          agentsPage = response.data.people;
        } else if (Array.isArray(response.data?.results)) {
          agentsPage = response.data.results;
        } else if (Array.isArray(response.data?.data)) {
          agentsPage = response.data.data;
        }

        if (first) {
          totalCount = response.data?.pagination?.total ?? agentsPage.length;
          first = false;
        }

        if (!Array.isArray(agentsPage)) break;

        const agentsWithOrgId = agentsPage.map(agent => ({
          ...agent,
          source_org_id: currentOrgId
        }));

        allAgents = allAgents.concat(agentsWithOrgId);
        offset += apiLimit;
      } while (offset < totalCount);
    }

    let filteredAgents = allAgents;
    if (singleAgent) {
      filteredAgents = allAgents.filter(agent => String(agent.kw_uid) === String(singleAgent));
    }

    let allListings = [];
    let listingsOffset = 0;
    const listingsApiLimit = 100;
    let listingsTotal = 0;
    let listingsFirst = true;

    do {
      const listingsURL = `https://partners.api.kw.com/v2/listings/region/50394?page[offset]=${listingsOffset}&page[limit]=${listingsApiLimit}`;
      const listingsResponse = await axios.get(listingsURL, { headers });

      const hits = listingsResponse.data?.hits?.hits ?? [];
      const listings = hits.map(hit => ({
        ...hit._source,
        _kw_meta: { id: hit._id, score: hit._score ?? null },
      }));

      allListings = allListings.concat(listings);

      if (listingsFirst) {
        listingsTotal = listingsResponse.data?.hits?.total?.value ?? 0;
        listingsFirst = false;
      }

      listingsOffset += listingsApiLimit;
    } while (listingsOffset < listingsTotal);

    const blockedStatuses = ['Expired', 'Pending', 'Withdrawn', 'Cancelled', 'Off Market'];
    const blockedCategories = ['Off Market', 'Pending', 'Withdrawn', 'Cancelled', 'Expired'];
    const allowedListStatuses = ['Active', 'Sold', 'Rented/Leased'];
    const allowedListCategories = ['For Sale', 'Sold', 'Rented/Leased'];

    let filteredListings = allListings.filter(item => {
      const listStatus = item.list_status || '';
      const status = item.status || '';
      const propertyStatus = item.property_status || '';
      const listCategory = item.list_category || '';
      const category = item.category || '';

      const hasBlockedStatus = blockedStatuses.some(blocked =>
        listStatus === blocked || status === blocked || propertyStatus === blocked
      );

      const hasBlockedCategory = blockedCategories.some(blocked =>
        listCategory === blocked || category === blocked
      );

      if (hasBlockedStatus || hasBlockedCategory) return false;

      const hasAllowedStatus = allowedListStatuses.includes(listStatus) ||
        allowedListStatuses.includes(status) ||
        allowedListStatuses.includes(propertyStatus);

      const hasAllowedCategory = allowedListCategories.includes(listCategory) ||
        allowedListCategories.includes(category);

      return hasAllowedStatus && hasAllowedCategory;
    });

    let agentProperties = filteredListings;
    if (singleAgent) {
      agentProperties = filteredListings.filter(property => {
        const listKwUid = property.list_kw_uid || property.listing_agent_kw_uid || property.agent_kw_uid || '';
        return String(listKwUid) === String(singleAgent);
      });
    }

    const agentData = filteredAgents.map(agent => ({
      kw_uid: agent.kw_uid,
      first_name: agent.first_name,
      last_name: agent.last_name,
      full_name: `${agent.first_name} ${agent.last_name || ''}`.trim(),
      email: agent.email || '',
      phone: agent.phone || '',
      market_center_number: agent.market_center_number || '',
      city: agent.city || '',
      active: agent.active !== false,
      photo: agent.photo || '',
      source_org_id: agent.source_org_id
    }));

    const totalProperties = agentProperties.length;
    const totalPages = Math.ceil(totalProperties / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    if (page > totalPages && totalPages > 0) {
      return res.status(400).json({
        success: false,
        message: `Page ${page} exceeds total pages ${totalPages}`,
      });
    }

    const paginatedProperties = agentProperties.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      org_id: org_id || null,
      single_agent: singleAgent || null,
      org_ids_used: orgIds,
      agents: {
        total: agentData.length,
        data: agentData,
      },
      properties: {
        pagination: {
          current_page: page,
          per_page: perPage,
          total_items: totalProperties,
          total_pages: totalPages,
          has_next_page: page < totalPages,
          has_prev_page: page > 1,
          next_page: page < totalPages ? page + 1 : null,
          prev_page: page > 1 ? page - 1 : null,
          start_index: startIndex + 1,
          end_index: Math.min(endIndex, totalProperties),
        },
        count: paginatedProperties.length,
        data: paginatedProperties,
      }
    });

  } catch (error) {
    console.error('Error in unified function:', error?.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};





// Fetch agents for a specific organization
export const syncAgentsFromKWPeople = async (req, res) => {
  try {
    const org_id = req.params.org_id;
    const activeFilter = req.query.active;

    if (!org_id) {
      return res.status(400).json({ success: false, message: 'Missing route param: org_id' });
    }

    const headers = {
      Authorization: 'Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==',
      Accept: 'application/json',
    };
    const baseURL = `https://partners.api.kw.com/v2/listings/orgs/${org_id}/people`;

    let allPeople = [];
    let offset = 0;
    const apiLimit = req.query.limit ? Number(req.query.limit) : 30; // Default limit is 30
    let totalCount = 0;

    do {
      const url = `${baseURL}?page[offset]=${offset}&page[limit]=${apiLimit}`;
      console.log(`Fetching data from URL: ${url}`); // Debug log

      const response = await axios.get(url, { headers });

      // Extract the agents data from the response
      const peoplePage = response.data?.data || [];
      console.log(`Fetched ${peoplePage.length} agents from API`); // Debug log

      // Add the fetched agents to the allPeople array
      allPeople = allPeople.concat(peoplePage);

      // Get the total count of agents from the API response (only on the first request)
      if (offset === 0) {
        totalCount = response.data?.meta?.total || peoplePage.length;
        console.log(`Total agents reported by API: ${totalCount}`); // Debug log
      }

      // Increment the offset to fetch the next page
      offset += apiLimit;
    } while (offset < totalCount); // Continue until all agents are fetched

    // Apply the active filter if provided
    if (activeFilter !== undefined) {
      const isActive = activeFilter === 'true';
      allPeople = allPeople.filter(p => (p.active !== false) === isActive);
    }

    console.log(`Total agents after filtering: ${allPeople.length}`); // Debug log

    // Normalize agents: ensure _id and id fields
    const stableAgentId = (agent) => {
      const s = `${agent.kw_uid || ''}|${agent.first_name || agent.name || ''}|${agent.last_name || agent.name || ''}|${agent.email || agent.emailAddress || ''}|${agent.phone || agent.phoneNumber || ''}`;
      let h = 5381;
      for (let i = 0; i < s.length; i++) {
        h = ((h << 5) + h) + s.charCodeAt(i);
        h = h & h;
      }
      return `agent-${Math.abs(h)}`;
    };

    const allPeopleWithId = allPeople.map(agent => {
      const id = agent.kw_uid || stableAgentId(agent);
      return { ...agent, _id: id, id };
    });

    res.status(200).json({
      success: true,
      org_id,
      total: allPeopleWithId.length,
      data: allPeopleWithId,
    });
  } catch (error) {
    console.error('KW People Sync Error:', error?.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agents',
      error: error.message,
    });
  }
};









export const syncAgentsFromMultipleKWPeople = async (req, res) => {
  try {
    const orgIds = ['50449', '2414288','50394'];
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const apiLimit = 1000; // Change this if needed in the future

    let allPeople = [];

    for (const org_id of orgIds) {
      const headers = {
        Authorization: 'Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==',
        Accept: 'application/json',
      };
      const baseURL = `https://partners.api.kw.com/v2/listings/orgs/${org_id}/people`;

      let offset = 0;
      let totalCount = 0;

      do {
        const url = `${baseURL}?page[offset]=${offset}&page[limit]=${apiLimit}`;
        console.log(`Fetching data from URL: ${url}`);

        const response = await axios.get(url, { headers });
        const peoplePage = response.data?.data || [];
        console.log(`Fetched ${peoplePage.length} agents from org_id ${org_id}`);

        allPeople = allPeople.concat(peoplePage);

        if (offset === 0) {
          totalCount = response.data?.meta?.total || peoplePage.length;
          console.log(`Total agents reported by API for org_id ${org_id}: ${totalCount}`);
        }

        offset += apiLimit;
      } while (offset < totalCount);
    }

    console.log(`Total agents fetched before deduplication: ${allPeople.length}`);

    // Deduplicate agents by kw_uid
    const uniqueAgentsMap = new Map();
    allPeople.forEach(agent => {
      if (agent.kw_uid) {
        uniqueAgentsMap.set(agent.kw_uid, agent);
      }
    });

    const uniqueAgents = Array.from(uniqueAgentsMap.values());

    console.log(`Total unique agents after deduplication: ${uniqueAgents.length}`);

    const stableAgentId = (agent) => {
      const s = `${agent.kw_uid || ''}|${agent.first_name || agent.name || ''}|${agent.last_name || agent.name || ''}|${agent.email || agent.emailAddress || ''}|${agent.phone || agent.phoneNumber || ''}`;
      let h = 5381;
      for (let i = 0; i < s.length; i++) {
        h = ((h << 5) + h) + s.charCodeAt(i);
        h = h & h;
      }
      return `agent-${Math.abs(h)}`;
    };

    const allPeopleWithId = uniqueAgents.map(agent => {
      const id = agent.kw_uid || stableAgentId(agent);
      return { ...agent, _id: id, id };
    });

    // Pagination logic
    const totalPages = Math.ceil(allPeopleWithId.length / perPage);
    const startIndex = (page - 1) * perPage;
    const paginatedData = allPeopleWithId.slice(startIndex, startIndex + perPage);

    res.status(200).json({
      success: true,
      org_ids: orgIds,
      total: allPeopleWithId.length,
      page,
      perPage,
      totalPages,
      data: paginatedData,
    });
  } catch (error) {
    console.error('KW People Sync Error:', error?.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agents from multiple orgs',
      error: error.message,
    });
  }
};






// Get filtered agents with pagination
export const getFilteredAgents = async (req, res) => {
  try {
    const { name, marketCenter, city, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (name) {
      filter.fullName = { $regex: name, $options: 'i' };
    }
    if (marketCenter && marketCenter !== "MARKET CENTER") {
      filter.marketCenter = { $regex: `^${marketCenter}$`, $options: 'i' };
    }
    if (city && city !== "CITY" && city !== "RESET_ALL") {
      filter.city = { $regex: `^${city}$`, $options: 'i' };
    }

    const agents = await Agent.find(filter).sort({ createdAt: -1 });
    console.log(`Found ${agents.length} agents`);

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Agent.countDocuments(filter);


   

    res.status(200).json({
      success: true,
      count: agents.length,
      total,
      page: parseInt(page),
      data: agents,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get leads data from agents for the frontend

// NEW ENDPOINTS FOR TESTING KW APIs

// Get People/Agents by Organization
export const getKWPeopleByOrg = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { offset = 0, limit = 10 } = req.query;

    const headers = {
      Authorization: 'Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==',
      Accept: 'application/json',
    };

    const url = `https://partners.api.kw.com/v2/listings/orgs/${orgId}/people?page[offset]=${offset}&page[limit]=${limit}`;
    
    console.log(`Fetching from: ${url}`);
    const response = await axios.get(url, { headers });
    
    res.status(200).json({
      success: true,
      orgId,
      url: url,
      total: response.data?.meta?.total || 0,
      data: response.data
    });
  } catch (error) {
    console.error('KW People API Error:', error?.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch people from KW API',
      error: error.message,
      orgId: req.params.orgId
    });
  }
};

// Get Listings by Region
export const getKWListingsByRegion = async (req, res) => {
  try {
    const { regionId } = req.params;
    const { offset = 0, limit = 10 } = req.query;

    const headers = {
      Authorization: 'Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==',
      Accept: 'application/json',
    };

    const url = `https://partners.api.kw.com/v2/listings/region/${regionId}?page[offset]=${offset}&page[limit]=${limit}`;
    
    console.log(`Fetching from: ${url}`);
    const response = await axios.get(url, { headers });
    
    res.status(200).json({
      success: true,
      regionId,
      url: url,
      total: response.data?.hits?.total?.value || 0,
      data: response.data
    });
  } catch (error) {
    console.error('KW Listings API Error:', error?.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listings from KW API',
      error: error.message,
      regionId: req.params.regionId
    });
  }
};

// Update the existing getKWCombinedData function




export const getKWCombinedData = async (req, res) => {
  try {
    const headers = {
      Authorization: 'Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==',
      Accept: 'application/json',
    };

    const apis = [
      { type: 'people_org_50449', url: 'https://partners.api.kw.com/v2/listings/orgs/50449/people' },
      { type: 'people_org_2414288', url: 'https://partners.api.kw.com/v2/listings/orgs/2414288/people' },
      { type: 'listings_region_50394', url: 'https://partners.api.kw.com/v2/listings/region/50394' }
    ];

      const fetchAllPages = async (api) => {
        const limit = 100; // batch size per request
        let allData = [];
        let offset = 0;
        let total = 0;

        try {
          do {
            const url = `${api.url}?page[offset]=${offset}&page[limit]=${limit}`;
            const resp = await axios.get(url, { headers });

            // Handle quota exceeded or TOO_MANY_REQUESTS errors from KW API
            if (resp.data && resp.data.success === 'false' && (resp.data.errorCode === 'TOO_MANY_REQUESTS' || resp.data.message?.toLowerCase().includes('quota'))) {
              throw new Error(resp.data.message || 'KW API quota exceeded or too many requests');
            }

            const data = resp.data.data || resp.data.hits?.hits || [];
            total = resp.data.meta?.total || resp.data.hits?.total?.value || data.length;

            allData = [...allData, ...data];
            offset += limit;
          } while (allData.length < total);

          return {
            type: api.type,
            url: api.url,
            success: true,
            total,
            count: allData.length,
            data: allData
          };
        } catch (err) {
          // If quota exceeded or too many requests, return a special error result for this API
          return {
            type: api.type,
            url: api.url,
            success: false,
            error: err.message || 'Failed to fetch from KW API',
            errorCode: err.response?.data?.errorCode || null
          };
        }
      };

    const results = await Promise.all(apis.map(fetchAllPages));

      // Check for any quota/TOO_MANY_REQUESTS errors in the results
      const quotaError = results.find(r => r.success === false && (r.errorCode === 'TOO_MANY_REQUESTS' || (r.error && r.error.toLowerCase().includes('quota'))));
      if (quotaError) {
        return res.status(429).json({
          success: false,
          message: quotaError.error || 'KW API quota exceeded or too many requests',
          errorCode: quotaError.errorCode || 'TOO_MANY_REQUESTS',
          results
        });
      }

      // Calculate total agents and total listings
      let totalAgents = 0;
      let totalListings = 0;
      results.forEach(result => {
        if (result.type === 'people_org_50449' || result.type === 'people_org_2414288') {
          totalAgents += typeof result.total === 'number' ? result.total : 0;
        }
        if (result.type === 'listings_region_50394') {
          totalListings += typeof result.total === 'number' ? result.total : 0;
        }
      });

      res.status(200).json({
        success: true,
        message: 'All KW API data fetched',
        timestamp: new Date().toISOString(),
        totalAgents,
        totalListings,
        results
      });

  } catch (error) {
    console.error('Combined API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch combined KW API data',
      error: error.message
    });
  }
};



// New endpoint to get agent with their matching properties
export const getAgentWithProperties = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { offset = 0, limit = 1000 } = req.query;

    const headers = {
      Authorization: 'Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==',
      Accept: 'application/json',
    };

    // Define the APIs to call
    const apis = [
      {
        type: 'people_org_50449',
        url: `https://partners.api.kw.com/v2/listings/orgs/50449/people?page[offset]=${offset}&page[limit]=${limit}`
      },
      {
        type: 'people_org_2414288',
        url: `https://partners.api.kw.com/v2/listings/orgs/2414288/people?page[offset]=${offset}&page[limit]=${limit}`
      },
      {
        type: 'listings_region_50394',
        url: `https://partners.api.kw.com/v2/listings/region/50394?page[offset]=${offset}&page[limit]=${limit}`
      }
    ];

    console.log(`Fetching agent ${agentId} with their properties...`);

    // Fetch all APIs in parallel
    const promises = apis.map(async (api) => {
      try {
        console.log(`Calling: ${api.url}`);
        const response = await axios.get(api.url, { headers });
        return {
          type: api.type,
          url: api.url,
          success: true,
          total: response.data?.meta?.total || response.data?.hits?.total?.value || 0,
          count: response.data?.data?.length || response.data?.hits?.hits?.length || 0,
          data: response.data
        };
      } catch (error) {
        console.error(`Error with ${api.type}:`, error.message);
        return {
          type: api.type,
          url: api.url,
          success: false,
          error: error.message
        };
      }
    });

    const results = await Promise.all(promises);

    // Extract agents from both org results
    let allAgents = [];
    results.forEach(result => {
      if (result.success && result.type.includes('people_org') && result.data?.data) {
        allAgents = allAgents.concat(result.data.data);
      }
    });

    // Find the specific agent by ID (kw_uid, _id, or id)
    const foundAgent = allAgents.find(agent => 
      agent.kw_uid === agentId || 
      agent._id === agentId || 
      agent.id === agentId
    );

    if (!foundAgent) {
      return res.status(404).json({
        success: false,
        message: `Agent with ID ${agentId} not found`,
        availableAgents: allAgents.slice(0, 5).map(a => ({
          kw_uid: a.kw_uid,
          name: a.full_name || `${a.first_name} ${a.last_name}`,
          _id: a._id
        }))
      });
    }

    // Extract properties from listings results
    let allProperties = [];
    results.forEach(result => {
      if (result.success && result.type.includes('listings_region')) {
        if (result.data?.hits?.hits) {
          // Elasticsearch format
          const properties = result.data.hits.hits.map(hit => ({
            ...hit._source,
            _kw_meta: { id: hit._id, score: hit._score ?? null },
          }));
          allProperties = allProperties.concat(properties);
        } else if (result.data?.data) {
          // Direct data array format
          allProperties = allProperties.concat(result.data.data);
        }
      }
    });

    // Match properties with agent's kw_uid
    const agentProperties = allProperties.filter(property => {
      const listKwUid = property.list_kw_uid || property.listing_agent_kw_uid || property.agent_kw_uid || '';
      return String(listKwUid) === String(foundAgent.kw_uid);
    });

    console.log(`Agent ${foundAgent.kw_uid} found with ${agentProperties.length} properties`);

    // Format agent data
    const formattedAgent = {
      kw_uid: foundAgent.kw_uid,
      first_name: foundAgent.first_name,
      last_name: foundAgent.last_name,
      full_name: foundAgent.full_name || `${foundAgent.first_name} ${foundAgent.last_name || ''}`.trim(),
      email: foundAgent.email || '',
      phone: foundAgent.phone || '',
      market_center_number: foundAgent.market_center_number || '',
      city: foundAgent.city || '',
      active: foundAgent.active !== false,
      photo: foundAgent.photo || '',
      source_org_id: foundAgent.source_org_id,
      _id: foundAgent._id || foundAgent.id
    };

    res.status(200).json({
      success: true,
      message: `Agent and properties fetched successfully`,
      timestamp: new Date().toISOString(),
      agent: formattedAgent,
      properties: agentProperties,
      propertyCount: agentProperties.length,
      totalProperties: allProperties.length,
      matchingDetails: {
        agentKwUid: foundAgent.kw_uid,
        propertiesWithMatchingKwUid: agentProperties.length,
        totalAgentsFound: allAgents.length
      }
    });

  } catch (error) {
    console.error('Agent with Properties Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agent with properties',
      error: error.message
    });
  }
};

// Get all agents with their property counts
export const getAllAgentsWithPropertyCounts = async (req, res) => {
  try {
    const headers = {
      Authorization: 'Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==',
      Accept: 'application/json',
    };

    console.log('Fetching all agents with property counts...');

    // Fetch all agents from both organizations
    let allAgents = [];
    const orgIds = [50449, 2414288];

    for (const orgId of orgIds) {
      let offset = 0;
      const apiLimit = 1000;
      let totalCount = 0;
      let first = true;

      do {
        const url = `https://partners.api.kw.com/v2/listings/orgs/${orgId}/people?page[offset]=${offset}&page[limit]=${apiLimit}`;
        
        try {
          const response = await axios.get(url, { headers });
          const agentsPage = response.data?.data || [];
          
          allAgents = allAgents.concat(agentsPage);

          if (first) {
            totalCount = response.data?.meta?.total || agentsPage.length;
            first = false;
          }

          offset += apiLimit;
        } catch (error) {
          console.error(`Error fetching agents from org ${orgId}:`, error.message);
          break;
        }
      } while (offset < totalCount);
    }

    // Fetch all properties from the region with proper pagination
    let allProperties = [];
    let listingsOffset = 0;
    const listingsApiLimit = 100;
    let listingsTotal = 0;
    let listingsFirst = true;

    do {
      const listingsURL = `https://partners.api.kw.com/v2/listings/region/50394?page[offset]=${listingsOffset}&page[limit]=${listingsApiLimit}`;
      
      try {
        const listingsResponse = await axios.get(listingsURL, { headers });

        const hits = listingsResponse.data?.hits?.hits ?? [];
        const listings = hits.map(hit => ({
          ...hit._source,
          _kw_meta: { id: hit._id, score: hit._score ?? null },
        }));

        allProperties = allProperties.concat(listings);

        if (listingsFirst) {
          listingsTotal = listingsResponse.data?.hits?.total?.value ?? 0;
          listingsFirst = false;
        }

        listingsOffset += listingsApiLimit;
      } catch (error) {
        console.error('Error fetching properties:', error.message);
        break;
      }
    } while (listingsOffset < listingsTotal);

    console.log(`Fetched ${allAgents.length} agents and ${allProperties.length} properties`);

    // Create agents with property counts and property data
    const agentsWithPropertyCounts = allAgents.map(agent => {
      const agentProperties = allProperties.filter(property => {
        const listKwUid = property.list_kw_uid || property.listing_agent_kw_uid || property.agent_kw_uid || '';
        return String(listKwUid) === String(agent.kw_uid);
      });

      return {
        kw_uid: agent.kw_uid,
        name: agent.full_name || `${agent.first_name} ${agent.last_name || ''}`.trim(),
        email: agent.email || '',
        phone: agent.phone || '',
        city: agent.city || '',
        propertyCount: agentProperties.length,
        properties: agentProperties, // Include actual property data
        source_org_id: agent.source_org_id,
        _id: agent._id || agent.id
      };
    });

    // Sort by property count (highest first)
    agentsWithPropertyCounts.sort((a, b) => b.propertyCount - a.propertyCount);

    const agentsWithProperties = agentsWithPropertyCounts.filter(agent => agent.propertyCount > 0);
    const agentsWithoutProperties = agentsWithPropertyCounts.filter(agent => agent.propertyCount === 0);

    res.status(200).json({
      success: true,
      message: 'All agents with property counts and data fetched',
      timestamp: new Date().toISOString(),
      summary: {
        totalAgents: allAgents.length,
        totalProperties: allProperties.length,
        agentsWithProperties: agentsWithProperties.length,
        agentsWithoutProperties: agentsWithoutProperties.length
      },
      agentsWithProperties: agentsWithProperties,
      agentsWithoutProperties: agentsWithoutProperties.slice(0, 10), // Show first 10 without properties
      samplePropertyKwUids: [...new Set(allProperties.map(p => p.list_kw_uid || p.listing_agent_kw_uid || p.agent_kw_uid).filter(Boolean))].slice(0, 10),
      sampleProperties: allProperties.slice(0, 3).map(p => ({
        id: p._kw_meta?.id || p.id,
        address: p.list_address?.address || p.address,
        price: p.current_list_price || p.price,
        list_kw_uid: p.list_kw_uid,
        listing_agent_kw_uid: p.listing_agent_kw_uid,
        agent_kw_uid: p.agent_kw_uid
      }))
    });

  } catch (error) {
    console.error('All Agents with Property Counts Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agents with property counts',
      error: error.message
    });
  }
};

// export const getCombinedListings = async (req, res) => {
//   try {
//     const regionIds = ['50394', '50449', '2414288'];
//     const page = parseInt(req.query.page) || 1;
//     const perPage = parseInt(req.query.limit) || 50;
//     const apiLimit = 1000;

//     let allListings = [];

//     const headers = {
//       Authorization: 'Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==',
//       Accept: 'application/json',
//     };

//     for (const regionId of regionIds) {
//       let offset = 0;
//       let total = 0;
//       let first = true;

//       do {
//         const url = `https://partners.api.kw.com/v2/listings/region/${regionId}?page[offset]=${offset}&page[limit]=${apiLimit}`;
//         console.log(`Fetching listings from: ${url}`);

//         const response = await fetch(url, { headers });
//         const data = await response.json();
//         const hits = data?.hits?.hits ?? [];

//         allListings = allListings.concat(
//           hits.map(hit => ({
//             ...hit._source,
//             _kw_meta: { id: hit._id, score: hit._score ?? null, region: regionId },
//           }))
//         );

//         if (first) {
//           total = data?.hits?.total?.value ?? 0;
//           first = false;
//         }
//         offset += apiLimit;
//       } while (offset < total);
//     }

//     console.log(`Total listings fetched before deduplication: ${allListings.length}`);

//     // Deduplicate
//     const uniqueMap = new Map();
//     allListings.forEach(item => {
//       if (item._kw_meta?.id) {
//         uniqueMap.set(item._kw_meta.id, item);
//       }
//     });

//     const uniqueListings = Array.from(uniqueMap.values());
//     console.log(`Total unique listings: ${uniqueListings.length}`);

//     // Pagination
//     const totalPages = Math.ceil(uniqueListings.length / perPage);
//     const startIndex = (page - 1) * perPage;
//     const paginated = uniqueListings.slice(startIndex, startIndex + perPage);

//     return res.json({
//       success: true,
//       total: uniqueListings.length,
//       page,
//       perPage,
//       totalPages,
//       data: paginated,
//     });
//   } catch (error) {
//     console.error("Combined Listings Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch combined listings",
//       error: error.message,
//     });
//   }
// };






