/**
 * GET /api/listings/property/:id
 * Returns a single property by its ID
 */
export const getPropertyById = async (req, res) => {
  try {
    const propertyId = req.params.id;
    if (!propertyId) {
      return res.status(400).json({ success: false, message: 'Property ID is required' });
    }

    // Fetch all listings (could be optimized for large datasets)
    const headers = {
      Authorization:
        'Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==',
      Accept: 'application/json',
    };
    const apiLimit = 1000;
    let allListings = [];
    let offset = 0;
    let total = 0;
    let first = true;
    do {
      const pageURL = `https://partners.api.kw.com/v2/listings/region/50394?page[offset]=${offset}&page[limit]=${apiLimit}`;
      const pageRes = await axios.get(pageURL, { headers });
      const hits = pageRes.data?.hits?.hits ?? [];
      allListings = allListings.concat(hits.map(hit => ({
        ...hit._source,
        _kw_meta: { id: hit._id, score: hit._score ?? null },
      })));
      if (first) {
        total = pageRes.data?.hits?.total?.value ?? 0;
        first = false;
      }
      offset += apiLimit;
    } while (offset < total);

    // Ensure each listing has a stable id before any filtering/pagination and
    // assign a deterministic numeric index so pagination slices are stable.
    const stableId = (item) => {
      const s = `${item._kw_meta?.id || ''}|${item.list_address?.address || item.address || ''}|${item.title || item.prop_type || ''}|${item.current_list_price || item.price || item.rental_price || ''}|${item.list_dt || ''}`;
      let h = 5381;
      for (let i = 0; i < s.length; i++) {
        h = ((h << 5) + h) + s.charCodeAt(i);
        h = h & h; // keep as 32-bit int
      }
      return `gen-${Math.abs(h)}`;
    };

    allListings = allListings.map(item => {
      item._kw_meta = item._kw_meta || {};
      if (!item._kw_meta.id && !item.id) {
        const id = stableId(item);
        item.id = id;
        item._kw_meta.id = id;
      } else if (!item.id && item._kw_meta?.id) {
        item.id = item._kw_meta.id;
      } else if (!item._kw_meta?.id && item.id) {
        item._kw_meta.id = item.id;
      }
      return item;
    });

    // Sort deterministically by id so pagination slices are stable across requests.
    allListings.sort((a, b) => {
      const A = String(a._kw_meta?.id || a.id || '');
      const B = String(b._kw_meta?.id || b.id || '');
      return A.localeCompare(B);
    });

    // Assign a stable numeric index so clients can rely on offset pagination.
    allListings = allListings.map((it, idx) => ({ ...it, stable_index: idx }));

    // store in cache (overwrite with enriched items)
    externalListingsCache.ts = Date.now();
    externalListingsCache.data = allListings.slice();

    // Find the property by ID
    const foundProperty = allListings.find(
      prop => String(prop._kw_meta?.id) === String(propertyId) || String(prop.id) === String(propertyId)
    );
    if (foundProperty) {
      return res.json({ success: true, data: foundProperty });
    } else {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
  } catch (err) {
    const status = err.response?.status ?? 500;
    const message = err.response?.data ?? err.message;
    console.error('KW API Error:', message);
    return res.status(status).json({
      success: false,
      message: 'Failed to fetch property by ID',
      error: message,
    });
  }
};

/** ------------------------------------------------------------------
 *  GET  or  POST   /api/get-external-listings
 *  Params / Body:
 *    page          (int, default 1)
 *    limit         (int, default 100)
 *    market_center (string / int, optional)
 *    list_category (string, optional)
 * ----------------------------------------------------------------- */
import axios from 'axios';
import util  from 'util';   // optional, for deep debug prints

// Simple in-memory cache to stabilize repeated listing requests during
// short test cycles. This keeps the fetched external listings for a
// short TTL so paginated requests made in quick succession see the
// same underlying dataset.
const externalListingsCache = {
  ts: 0,
  data: [],
  ttl: 60 * 1000, // 60 seconds
};






export const getExternalListings = async (req, res) => {
  try {
    // 1. Get pagination and filter input from request
    const page = Number(req.body.page ?? req.query.page ?? 1);
    const perPage = Number(req.body.limit ?? req.query.limit ?? 50);
  const marketCenterFilter = req.body.market_center ?? req.query.market_center;
  // Accept string or array for list_category and list_status to support page-specific defaults
  const listCategoryFilter = req.body.list_category ?? req.query.list_category;
  const listStatusFilter = req.body.list_status ?? req.query.list_status;
    const propertyCategoryFilter = req.body.property_category ?? req.query.property_category;
    const propertySubtypeFilter = req.body.property_subtype ?? req.query.property_subtype;
    const locationFilter = req.body.location ?? req.query.location;
    const minPrice = req.body.min_price ?? req.query.min_price;
    const maxPrice = req.body.max_price ?? req.query.max_price;
    const propertyType = req.body.property_type ?? req.query.property_type;
    
    // New optional filters
    const forSale = req.body.forsale ?? req.query.forsale;
    const forRent = req.body.forrent ?? req.query.forrent;
    
    // Add sorting parameters
    const sortBy = req.body.sort_by ?? req.query.sort_by;
    const sortOrder = req.body.sort_order ?? req.query.sort_order ?? 'desc';

    // Validate pagination parameters
    if (page < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page number must be greater than 0',
        error: 'Invalid page parameter'
      });
    }
    
    if (perPage < 1 || perPage > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Per page limit must be between 1 and 1000',
        error: 'Invalid per_page parameter'
      });
    }

    // 2. Set up headers for API
    const headers = {
      Authorization:
        'Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==',
      Accept: 'application/json',
    };

    // 3. Fetch all listings from the API (loop through all pages)
    let allListings = [];
    // Use cached data when available and fresh to avoid variations
    // across rapid paginated requests.
    const now = Date.now();
    if (externalListingsCache.ts && (now - externalListingsCache.ts) < externalListingsCache.ttl) {
      allListings = externalListingsCache.data.slice();
    } else {
      let offset = 0;
      const apiLimit = 1000; // Use the largest allowed by the KW API
      let total = 0;
      let first = true;
      do {
        const pageURL = `https://partners.api.kw.com/v2/listings/region/50394?page[offset]=${offset}&page[limit]=${apiLimit}`;
        const pageRes = await axios.get(pageURL, { headers });
        const hits = pageRes.data?.hits?.hits ?? [];
        allListings = allListings.concat(hits.map(hit => ({
          ...hit._source,
          _kw_meta: { id: hit._id, score: hit._score ?? null },
        })));
        if (first) {
          total = pageRes.data?.hits?.total?.value ?? 0;
          first = false;
        }
        offset += apiLimit;
      } while (offset < total);

      // store in cache
      externalListingsCache.ts = Date.now();
      externalListingsCache.data = allListings.slice();
    }

    // 4. Apply strict filtering - REMOVE unwanted listings completely
    // Use the cached enriched data directly when available
    if (externalListingsCache.ts && externalListingsCache.data && externalListingsCache.data.length > 0) {
      allListings = externalListingsCache.data.slice();
    }
    // Define exactly what we want to KEEP
  const allowedListStatuses = ['Active', 'Rented/Leased'];
  const allowedListCategories = ['For Sale', 'For Rent', 'To Let', 'Rented/Leased'];
    
    // Define what we want to EXCLUDE (remove completely)
  let blockedStatuses = ['Expired', 'Delete','Draft','Pending', 'Withdrawn', 'Cancelled', 'Sold'];
  // If a request explicitly asks for Off Market, do NOT block it for this request
  let blockedCategories = ['Pending','Delete','Draft', 'Withdrawn', 'Cancelled', 'Expired', 'Sold'];
    try {
      const requestedCategories = Array.isArray(listCategoryFilter)
        ? listCategoryFilter
        : (typeof listCategoryFilter === 'string' && listCategoryFilter.includes(','))
          ? listCategoryFilter.split(',')
          : (listCategoryFilter ? [listCategoryFilter] : []);
      const wantsOffMarket = requestedCategories
        .map(x => String(x).trim().toLowerCase())
        .includes('off market');
      if (wantsOffMarket) {
        blockedCategories = blockedCategories.filter(
          c => String(c).toLowerCase() !== 'off market'
        );
        blockedStatuses = blockedStatuses.filter(
          s => String(s).toLowerCase() !== 'off market'
        );
      }
    } catch (_) {
      // ignore parsing errors; keep defaults
    }

    // Filter out listings that match blocked statuses or blocked categories only
    allListings = allListings.filter(item => {
      // Get all possible status fields
      const listStatus = (item.list_status || '').toString();
      const status = (item.status || '').toString();
      const propertyStatus = (item.property_status || '').toString();

      // Get all possible category fields
      const listCategory = (item.list_category || '').toString();
      const category = (item.category || '').toString();

      // If any of the status fields match blocked statuses, exclude
      const hasBlockedStatus = blockedStatuses.some(blocked =>
        listStatus === blocked || status === blocked || propertyStatus === blocked
      );

      // If any of the category fields match blocked categories, exclude
      const hasBlockedCategory = blockedCategories.some(blocked =>
        listCategory === blocked || category === blocked
      );

      // Exclude only when blocked values are present
      if (hasBlockedStatus || hasBlockedCategory) return false;

      // Otherwise keep the listing
      return true;
    });

  // 5. Apply new optional filters
    
    // Debug: Log the filter values
    console.log('Filter values received:', {
      forSale,
      forRent,
      propertyType,
      minPrice,
      maxPrice,
      locationFilter,
      propertySubtypeFilter,
      listStatusFilter,
      listCategoryFilter
    });
    
    // Debug: Log sample properties before filtering
    if (allListings.length > 0) {
      console.log('=== SAMPLE PROPERTIES BEFORE FILTERING ===');
      allListings.slice(0, 3).forEach((item, idx) => {
        console.log(`Property ${idx + 1}:`, {
          id: item._kw_meta?.id,
          list_category: item.list_category,
          category: item.category,
          prop_type: item.prop_type,
          city: item.list_address?.city
        });
      });
      console.log('=== END DEBUG ===');
    }
    
    // 0) Explicit list_status / list_category filters.
    // If BOTH are provided and list_category contains "off market",
    // interpret as: (category in requestedCats AND status in requestedStatuses) OR (category == 'off market').
    // This matches the New Development requirement: show Active For Sale AND all Off Market.
    const hasStatusFilter = listStatusFilter !== undefined;
    const hasCategoryFilter = listCategoryFilter !== undefined;

    let requestedStatuses = new Set();
    let requestedCats = new Set();
    if (hasStatusFilter) {
      const statuses = Array.isArray(listStatusFilter)
        ? listStatusFilter
        : (typeof listStatusFilter === 'string' && listStatusFilter.includes(','))
          ? listStatusFilter.split(',')
          : [listStatusFilter];
      requestedStatuses = new Set(statuses.map(s => String(s).trim().toLowerCase()));
    }
    if (hasCategoryFilter) {
      const cats = Array.isArray(listCategoryFilter)
        ? listCategoryFilter
        : (typeof listCategoryFilter === 'string' && listCategoryFilter.includes(','))
          ? listCategoryFilter.split(',')
          : [listCategoryFilter];
      requestedCats = new Set(cats.map(s => String(s).trim().toLowerCase()));
    }

    // helper normalizer
    const norm = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z]/g, '');
    const catMatchesRequested = (cat) => {
      const c = norm(cat);
      // Expand requested categories into normalized tokens and match by contains
      const requested = [...requestedCats];
      return requested.some(rc => {
        const n = norm(rc);
        if (n.includes('offmarket')) return c.includes('offmarket');
        if (n.includes('forsale') || n === 'sale') return c.includes('sale');
        if (n.includes('forrent') || n.includes('rent') || n.includes('let')) return (c.includes('rent') || c.includes('lease') || c.includes('let'));
        if (n.includes('sold')) return c.includes('sold');
        if (n.includes('rented') || n.includes('leased')) return (c.includes('rent') || c.includes('lease'));
        return c.includes(n);
      });
    };
    const statusMatchesRequested = (item) => {
      const fields = [item.list_status, item.status, item.property_status]
        .filter(v => v !== undefined && v !== null)
        .map(v => norm(v));
      const wanted = [...requestedStatuses].map(norm);
      return fields.some(v => wanted.some(w => v.includes(w))); // contains match (e.g., 'activeundercontract')
    };

    if (hasStatusFilter && hasCategoryFilter) {
      const wantsOffMarket = requestedCats.has('off market');
      allListings = allListings.filter(item => {
        const categoryRaw = item.list_category || item.category || '';
        const catOK = catMatchesRequested(categoryRaw);
        // include all Off Market regardless of status if requested
        if (wantsOffMarket && norm(categoryRaw).includes('offmarket')) return true;
        if (!catOK) return false;
        return statusMatchesRequested(item);
      });
      console.log(`After combined list_category+list_status filter: ${allListings.length} properties`);
    } else if (hasStatusFilter) {
      allListings = allListings.filter(item => statusMatchesRequested(item));
      console.log(`After list_status-only filter (${[...requestedStatuses].join('|')}): ${allListings.length} properties`);
    } else if (hasCategoryFilter) {
      allListings = allListings.filter(item => catMatchesRequested(item.list_category || item.category || ''));
      console.log(`After list_category-only filter (${[...requestedCats].join('|')}): ${allListings.length} properties`);
    }

    // 1) For Sale filter - if forsale is true, only show "For Sale" listings
    if (forSale === 'true' || forSale === true) {
      console.log('Applying For Sale filter');
      allListings = allListings.filter(item => {
        const raw = item.list_category || item.category || '';
        const category = String(raw).toLowerCase();
        const matches = category.includes('sale');
        if (item._kw_meta?.id) {
          console.log(`Property ${item._kw_meta.id}: list_category="${raw}" (${category}) - matches sale: ${matches}`);
        }
        return matches;
      });
      console.log(`After For Sale filter: ${allListings.length} properties`);
    }
    
    // 2) For Rent filter - if forrent is true, only show "For Rent" listings  
    if (forRent === 'true' || forRent === true) {
      console.log('Applying For Rent filter');
      allListings = allListings.filter(item => {
        const raw = item.list_category || item.category || '';
        const category = String(raw).toLowerCase();
        const matches = category.includes('rent') || category.includes('lease') || category.includes('let');
        if (item._kw_meta?.id) {
          console.log(`Property ${item._kw_meta.id}: list_category="${raw}" (${category}) - matches rent: ${matches}`);
        }
        return matches;
      });
      console.log(`After For Rent filter: ${allListings.length} properties`);
    }
    
    // 3) Property Type filter - support any property type, flexible match
    if (propertyType) {
      console.log('Applying Property Type filter:', propertyType);
      const typeFilter = propertyType.toLowerCase().replace(/[_ ]/g, '');
      allListings = allListings.filter(item => {
        const propType = (item.prop_type || item.property_type || '').toString().toLowerCase().replace(/[_ ]/g, '');
        const matches = propType.includes(typeFilter);
        if (item._kw_meta?.id) {
          console.log(`Property ${item._kw_meta.id}: prop_type="${item.prop_type}" (${propType}) - matches ${propertyType}: ${matches}`);
        }
        return matches;
      });
      console.log(`After Property Type filter: ${allListings.length} properties`);
    }
    
    // 4) Price range filters on current_list_price
    // Backend price filtering using current_list_price, price, or rental_price
    if (minPrice !== undefined || maxPrice !== undefined) {
      const min = minPrice !== undefined && minPrice !== '' ? parseFloat(String(minPrice).replace(/,/g, '')) : 0;
      const max = maxPrice !== undefined && maxPrice !== '' ? parseFloat(String(maxPrice).replace(/,/g, '')) : Infinity;
      allListings = allListings.filter(item => {
        let price = null;
        const priceFields = [item.current_list_price, item.price, item.rental_price];
        for (let val of priceFields) {
          if (val !== undefined && val !== null && val !== '') {
            price = parseFloat(String(val).replace(/,/g, ''));
            if (!isNaN(price)) break;
          }
        }
        if (price === null || isNaN(price)) price = 0;
        return price >= min && price <= max;
      });
    }

    // 6. Apply additional filters if provided
    // Sort by year_built descending if include_new_homes is true
    const includeNewHomes = req.body.include_new_homes ?? req.query.include_new_homes;
    if (includeNewHomes === true || includeNewHomes === 'true') {
      allListings = allListings.sort((a, b) => {
        const dateA = new Date(a.year_built);
        const dateB = new Date(b.year_built);
        return dateB - dateA;
      });
    }
    if (marketCenterFilter !== undefined) {
      const mc = String(marketCenterFilter);
      const FIELD_CANDIDATES = [
        'listing_market_center',
        'office_mls_id',
        'market_center',
      ];
      allListings = allListings.filter(item =>
        FIELD_CANDIDATES.some(
          key => item[key] !== undefined && String(item[key]) === mc
        )
      );
    }
    if (listCategoryFilter !== undefined) {
      const lc = String(listCategoryFilter).toLowerCase();
      allListings = allListings.filter(item => {
        const val = item.list_category || item.status || item.property_status || '';
        return String(val).toLowerCase() === lc;
      });
    }
    // New: property_category filter
    if (propertyCategoryFilter !== undefined) {
      const pc = String(propertyCategoryFilter).toLowerCase();
      allListings = allListings.filter(item => {
        const val = item.prop_type || '';
        return String(val).toLowerCase() === pc;
      });
    }
    // New: property_subtype filter
    if (propertySubtypeFilter !== undefined) {
      const ps = String(propertySubtypeFilter).toLowerCase();
      allListings = allListings.filter(item => {
        const val = item.prop_subtype || item.subtype || '';
        return String(val).toLowerCase() === ps;
      });
    }
    // New: location filter
   if (locationFilter !== undefined) {
  const loc = String(locationFilter).toLowerCase();

  allListings = allListings.filter(item => {
    const city = item.list_address?.city ?? '';
    return city.toLowerCase().includes(loc);
  });
}



    // 7. Calculate pagination details
  // Debug: Log total properties after filtering and before pagination
  console.log('Total properties after all filters (before pagination):', allListings.length);
    const totalFiltered = allListings.length;
    const totalPages = Math.ceil(totalFiltered / perPage);
    
    // Debug: Log final results
    console.log('=== FILTERING RESULTS ===');
    console.log(`Total properties after all filters: ${totalFiltered}`);
    console.log(`Applied filters:`, {
      forSale: forSale === 'true' || forSale === true,
      forRent: forRent === 'true' || forRent === true,
      propertyType,
      minPrice,
      maxPrice,
      locationFilter,
      propertySubtypeFilter
    });
    console.log('=== END RESULTS ===');
    
    // Check if requested page exceeds total pages
    if (page > totalPages && totalPages > 0) {
      return res.status(400).json({
        success: false,
        message: `Page ${page} does not exist. Total pages available: ${totalPages}`,
        error: 'Page out of range',
        total_pages: totalPages,
        total: totalFiltered
      });
    }

    // 7.5. Apply sorting if requested
    if (sortBy) {
      console.log('Applying sorting:', { sortBy, sortOrder });
      
      allListings.sort((a, b) => {
        let valueA, valueB;
        
        if (sortBy === 'list_dt') {
          valueA = new Date(a.list_dt || a.date_added || a.createdAt || 0);
          valueB = new Date(b.list_dt || b.date_added || b.createdAt || 0);
        } else if (sortBy === 'date_added') {
          valueA = new Date(a.date_added || a.createdAt || 0);
          valueB = new Date(b.date_added || b.createdAt || 0);
        } else if (sortBy === 'price') {
          valueA = Number(a.price || a.current_list_price || a.rental_price || 0);
          valueB = Number(b.price || b.current_list_price || b.rental_price || 0);
        } else {
          // Default fallback to list_dt
          valueA = new Date(a.list_dt || a.date_added || a.createdAt || 0);
          valueB = new Date(b.list_dt || b.date_added || b.createdAt || 0);
        }
        
        // Apply sort order
        if (sortOrder === 'asc') {
          return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
          return valueB > valueA ? 1 : valueB < valueA ? -1 : 0;
        }
      });
      
      console.log('Sorting applied. First 3 properties:', allListings.slice(0, 3).map(p => ({
        id: p._kw_meta?.id,
        list_dt: p.list_dt,
        date_added: p.date_added,
        sortValue: sortBy === 'list_dt' ? p.list_dt : sortBy === 'date_added' ? p.date_added : p.price || p.current_list_price
      })));
    }

    // 8. Paginate filtered results
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginated = allListings.slice(startIndex, endIndex);

    // 9. Return response with comprehensive pagination info
    return res.json({
      success: true,
      pagination: {
        current_page: page,
        per_page: perPage,
        total_items: totalFiltered,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_prev_page: page > 1,
        next_page: page < totalPages ? page + 1 : null,
        prev_page: page > 1 ? page - 1 : null,
        start_index: startIndex + 1,
        end_index: Math.min(endIndex, totalFiltered)
      },
      count: paginated.length,
      data: paginated,
    });
  } catch (err) {
    const status = err.response?.status ?? 500;
    const message = err.response?.data ?? err.message;
    console.error('KW API Error:', message);
    return res.status(status).json({
      success: false,
      message: 'Failed to fetch listings',
      error: message,
    });
  }
};
// export const getFilteredListings = async (req, res) => {
//   const page = Number(req.body.page ?? req.query.page ?? 1);
//   const perPage = Number(req.body.limit ?? req.query.limit ?? 50);
//   const marketCenterFilter = req.body.market_center ?? req.query.market_center;
//   let listCategoryFilter = req.body.list_category ?? req.query.list_category;
//   const listStatusFilter = req.body.list_status ?? req.query.list_status;
//   const propertyCategoryFilter = req.body.property_category ?? req.query.property_category;
//   const propertySubtypeFilter = req.body.property_subtype ?? req.query.property_subtype;
//   const locationFilter = req.body.location ?? req.query.location;
//   const minPrice = req.body.min_price ?? req.query.min_price;
//   const maxPrice = req.body.max_price ?? req.query.max_price;
//   const propertyType = req.body.property_type ?? req.query.property_type;
//   const forsale = req.body.forsale ?? req.query.forsale;
//   const forrent = req.body.forrent ?? req.query.forrent;
//   const commercial = req.body.commercial ?? req.query.commercial;
//   const includeNewHomes = req.body.include_new_homes ?? req.query.include_new_homes;

//   try {
//     const { offset = 0, limit = 6 } = req.query;

//     const headers = {
//       Authorization:
//         "Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==",
//       Accept: "application/json",
//     };

//     const apiLimit = 1000;
//     let allListings = [];
//     let apiOffset = 0;
//     let total = 0;
//     let first = true;

//     do {
//       const pageURL = `https://partners.api.kw.com/v2/listings/region/50394?page[offset]=${apiOffset}&page[limit]=${apiLimit}`;
//       const pageRes = await axios.get(pageURL, { headers });
//       const hits = pageRes.data?.hits?.hits ?? [];

//       allListings = allListings.concat(
//         hits.map((hit) => ({
//           ...hit._source,
//           _kw_meta: { id: hit._id, score: hit._score ?? null },
//         }))
//       );

//       if (first) {
//         total = pageRes.data?.hits?.total?.value ?? 0;
//         first = false;
//       }

//       apiOffset += apiLimit;
//     } while (apiOffset < total);

//     const stableId = (item) => {
//       const s = `${item._kw_meta?.id || ""}|${item.list_address?.address || item.address || ""}|${item.title || item.prop_type || ""}|${item.current_list_price || item.price || item.rental_price || ""}|${item.list_dt || ""}`;

//       let h = 5381;
//       for (let i = 0; i < s.length; i++) {
//         h = (h << 5) + h + s.charCodeAt(i);
//         h = h & 0xffffffff;
//       }

//       return `gen-${Math.abs(h)}`;
//     };

//     allListings = allListings.map((item, idx) => {
//       item._kw_meta = item._kw_meta || {};
//       if (!item._kw_meta.id && !item.id) {
//         const id = stableId(item);
//         item.id = id;
//         item._kw_meta.id = id;
//       } else if (!item.id && item._kw_meta?.id) {
//         item.id = item._kw_meta.id;
//       } else if (!item._kw_meta?.id && item.id) {
//         item._kw_meta.id = item.id;
//       }

//       return {
//         ...item,
//         id: item.id || item._kw_meta?.id,
//         stable_index: idx,
//       };
//     });

//     allListings.sort((a, b) => {
//       return String(a._kw_meta?.id || a.id).localeCompare(String(b._kw_meta?.id || b.id));
//     });

//     // Property Type filter
//     if (propertyType) {
//       const typeFilter = propertyType.toLowerCase().replace(/[_ ]/g, '');
//       allListings = allListings.filter(item => {
//         const propType = (item.prop_type || item.property_type || '').toLowerCase().replace(/[_ ]/g, '');
//         return propType.includes(typeFilter);
//       });
//     }

//     if (commercial === true || commercial === 'true') {
//       allListings = allListings.filter(item => {
//         const propType = (item.prop_type || item.property_type || '').toLowerCase();
//         return propType.includes('commercial');
//       });
//     }

//     if (minPrice !== undefined || maxPrice !== undefined) {
//       const min = minPrice !== undefined && minPrice !== '' ? parseFloat(String(minPrice).replace(/,/g, '')) : 0;
//       const max = maxPrice !== undefined && maxPrice !== '' ? parseFloat(String(maxPrice).replace(/,/g, '')) : Infinity;

//       allListings = allListings.filter(item => {
//         let price = null;
//         const priceFields = [item.current_list_price, item.price, item.rental_price];
//         for (let val of priceFields) {
//           if (val !== undefined && val !== null && val !== '') {
//             price = parseFloat(String(val).replace(/,/g, ''));
//             if (!isNaN(price)) break;
//           }
//         }
//         if (price === null || isNaN(price)) price = 0;
//         return price >= min && price <= max;
//       });
//     }

//     if (includeNewHomes === true || includeNewHomes === 'true') {
//       allListings = allListings.filter(item => {
//         const year = parseInt(item.year_built);
//         return !isNaN(year) && year >= 2020;
//       });

//       allListings = allListings.sort((a, b) => parseInt(b.year_built) - parseInt(a.year_built));
//     }

//     if (marketCenterFilter !== undefined) {
//       const mc = String(marketCenterFilter);
//       const FIELD_CANDIDATES = ['listing_market_center', 'office_mls_id', 'market_center'];
//       allListings = allListings.filter(item =>
//         FIELD_CANDIDATES.some(key => String(item[key]) === mc)
//       );
//     }

//     if (listCategoryFilter !== undefined) {
//       let lcArr = listCategoryFilter;
//       if (typeof lcArr === 'string') {
//         try {
//           lcArr = lcArr.startsWith('[') ? JSON.parse(lcArr) : [lcArr];
//         } catch {
//           lcArr = [lcArr];
//         }
//       }
//       if (Array.isArray(lcArr)) {
//         lcArr = lcArr.map(x => String(x).toLowerCase());
//         allListings = allListings.filter(item => {
//           const val = (item.list_category || item.status || item.property_status || '').toLowerCase();
//           return lcArr.includes(val);
//         });
//       }
//     }

//     if (propertyCategoryFilter !== undefined) {
//       const pc = String(propertyCategoryFilter).toLowerCase();
//       allListings = allListings.filter(item => (item.prop_type || '').toLowerCase() === pc);
//     }

//     if (propertySubtypeFilter !== undefined) {
//       const ps = String(propertySubtypeFilter).toLowerCase();
//       allListings = allListings.filter(item => (item.prop_subtype || item.subtype || '').toLowerCase() === ps);
//     }

//     if (locationFilter !== undefined) {
//       const loc = String(locationFilter).toLowerCase();
//       allListings = allListings.filter(item => (item.list_address?.city || '').toLowerCase().includes(loc));
//     }

//     const totalFilteredBeforeForsaleForrent = allListings.length;

//     if (forsale === true || forsale === 'true') {
//       allListings = allListings.filter(item => (item.list_category || item.category || '').toLowerCase() === 'forsale');
//     }

//     if (forrent === true || forrent === 'true') {
//       allListings = allListings.filter(item => (item.list_category || item.category || '').toLowerCase() === 'forrent');
//     }

//     const norm = (s) => String(s || "").toLowerCase().trim().replace(/[^a-z]/g, "");

//     const filteredListings = allListings.filter(item => {
//       const statusRaw = item.list_status || item.status || item.property_status || "";
//       return norm(statusRaw) === 'active';
//     });

//     const totalFiltered = filteredListings.length;
//     const totalPages = Math.ceil(totalFiltered / perPage);

//     const start = parseInt(offset, 10) || 0;
//     const end = limit ? start + limit : filteredListings.length;

//     const paginated = limit
//       ? filteredListings.slice(start, end).map(item => ({ ...item, id: item.id }))
//       : filteredListings.map(item => ({ ...item, id: item.id }));

//     console.log('Total properties after all filters (before pagination):', filteredListings.length);

//     return res.json({
//       success: true,
//       total: filteredListings.length,
//       totalPages,
//       offset: start,
//       limit: limit || 'all',
//       data: paginated,
//     });
//   } catch (err) {
//     const status = err.response?.status ?? 500;
//     const message = err.response?.data ?? err.message;
//     console.error('KW API Error:', message);

//     return res.status(status).json({
//       success: false,
//       message: "Failed to fetch filtered listings",
//       error: message,
//     });
//   }
// };


export const newdevelomentListings = async (req, res) => {
  try {
    const page = Number(req.body.page ?? req.query.page ?? 1);
    const perPage = Number(req.body.limit ?? req.query.limit ?? 50);

    const marketCenterFilter = req.body.market_center ?? req.query.market_center;
    const listCategoryFilter = req.body.list_category ?? req.query.list_category;
    const listStatusFilter = req.body.list_status ?? req.query.list_status;
    const propertyCategoryFilter = req.body.property_category ?? req.query.property_category;
    const propertySubtypeFilter = req.body.property_subtype ?? req.query.property_subtype;
    const locationFilter = req.body.location ?? req.query.location;
    const minPrice = req.body.min_price ?? req.query.min_price;
    const maxPrice = req.body.max_price ?? req.query.max_price;
    const propertyType = req.body.property_type ?? req.query.property_type;
    const forSale = req.body.forsale ?? req.query.forsale;
    const forRent = req.body.forrent ?? req.query.forrent;

    if (page < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page number must be greater than 0',
        error: 'Invalid page parameter'
      });
    }
    
    if (perPage < 1 || perPage > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Per page limit must be between 1 and 1000',
        error: 'Invalid per_page parameter'
      });
    }

    const headers = {
      Authorization: 'Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==',
      Accept: 'application/json',
    };

    let allListings = [];
    const now = Date.now();
    if (externalListingsCache.ts && (now - externalListingsCache.ts) < externalListingsCache.ttl) {
      allListings = externalListingsCache.data.slice();
    } else {
      let offset = 0;
      const apiLimit = 1000;
      let total = 0;
      let first = true;
      do {
        const pageURL = `https://partners.api.kw.com/v2/listings/region/50394?page[offset]=${offset}&page[limit]=${apiLimit}`;
        const pageRes = await axios.get(pageURL, { headers });
        const hits = pageRes.data?.hits?.hits ?? [];
        allListings = allListings.concat(hits.map(hit => ({
          ...hit._source,
          _kw_meta: { id: hit._id, score: hit._score ?? null },
        })));
        if (first) {
          total = pageRes.data?.hits?.total?.value ?? 0;
          first = false;
        }
        offset += apiLimit;
      } while (offset < total);

      externalListingsCache.ts = Date.now();
      externalListingsCache.data = allListings.slice();
    }

    if (externalListingsCache.ts && externalListingsCache.data && externalListingsCache.data.length > 0) {
      allListings = externalListingsCache.data.slice();
    }

    // Apply strict filtering: Keep only list_status = 'Active' AND list_category = 'For Sale' or 'Off Market'
    allListings = allListings.filter(item => {
      const listStatus = (item.list_status || '').toString().toLowerCase();
      const listCategory = (item.list_category || item.category || '').toString().toLowerCase();

      return listStatus === 'active' && (listCategory === 'for sale' || listCategory === 'off market');
    });

    if (forSale === 'true' || forSale === true) {
      allListings = allListings.filter(item => {
        const raw = item.list_category || item.category || '';
        return String(raw).toLowerCase().includes('sale');
      });
    }

    if (forRent === 'true' || forRent === true) {
      allListings = allListings.filter(item => {
        const raw = item.list_category || item.category || '';
        const category = String(raw).toLowerCase();
        return category.includes('rent') || category.includes('lease') || category.includes('let');
      });
    }

    if (propertyType) {
      const typeFilter = propertyType.toLowerCase().replace(/[_ ]/g, '');
      allListings = allListings.filter(item => {
        const propType = (item.prop_type || item.property_type || '').toString().toLowerCase().replace(/[_ ]/g, '');
        return propType.includes(typeFilter);
      });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const min = minPrice !== undefined && minPrice !== '' ? parseFloat(String(minPrice).replace(/,/g, '')) : 0;
      const max = maxPrice !== undefined && maxPrice !== '' ? parseFloat(String(maxPrice).replace(/,/g, '')) : Infinity;
      allListings = allListings.filter(item => {
        let price = null;
        const priceFields = [item.current_list_price, item.price, item.rental_price];
        for (let val of priceFields) {
          if (val !== undefined && val !== null && val !== '') {
            price = parseFloat(String(val).replace(/,/g, ''));
            if (!isNaN(price)) break;
          }
        }
        if (price === null || isNaN(price)) price = 0;
        return price >= min && price <= max;
      });
    }

    const includeNewHomes = req.body.include_new_homes ?? req.query.include_new_homes;
    if (includeNewHomes === true || includeNewHomes === 'true') {
      allListings = allListings.sort((a, b) => {
        const dateA = new Date(a.year_built);
        const dateB = new Date(b.year_built);
        return dateB - dateA;
      });
    }

    if (marketCenterFilter !== undefined) {
      const mc = String(marketCenterFilter);
      const FIELD_CANDIDATES = ['listing_market_center', 'office_mls_id', 'market_center'];
      allListings = allListings.filter(item =>
        FIELD_CANDIDATES.some(key => item[key] !== undefined && String(item[key]) === mc)
      );
    }

    if (listCategoryFilter !== undefined) {
      const lc = String(listCategoryFilter).toLowerCase();
      allListings = allListings.filter(item => {
        const val = item.list_category || item.status || item.property_status || '';
        return String(val).toLowerCase() === lc;
      });
    }

    if (propertyCategoryFilter !== undefined) {
      const pc = String(propertyCategoryFilter).toLowerCase();
      allListings = allListings.filter(item => {
        const val = item.prop_type || '';
        return String(val).toLowerCase() === pc;
      });
    }

    if (propertySubtypeFilter !== undefined) {
      const ps = String(propertySubtypeFilter).toLowerCase();
      allListings = allListings.filter(item => {
        const val = item.prop_subtype || item.subtype || '';
        return String(val).toLowerCase() === ps;
      });
    }

    if (locationFilter !== undefined) {
      const loc = String(locationFilter).toLowerCase();
      allListings = allListings.filter(item => {
        const city = item.list_address?.city ?? '';
        return city.toLowerCase().includes(loc);
      });
    }

    const totalFiltered = allListings.length;
    const totalPages = Math.ceil(totalFiltered / perPage);

    if (page > totalPages && totalPages > 0) {
      return res.status(400).json({
        success: false,
        message: `Page ${page} does not exist. Total pages available: ${totalPages}`,
        error: 'Page out of range',
        total_pages: totalPages,
        total: totalFiltered
      });
    }

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginated = allListings.slice(startIndex, endIndex);

    return res.json({
      success: true,
      pagination: {
        current_page: page,
        per_page: perPage,
        total_items: totalFiltered,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_prev_page: page > 1,
        next_page: page < totalPages ? page + 1 : null,
        prev_page: page > 1 ? page - 1 : null,
        start_index: startIndex + 1,
        end_index: Math.min(endIndex, totalFiltered)
      },
      count: paginated.length,
      data: paginated,
    });
  } catch (err) {
    const status = err.response?.status ?? 500;
    const message = err.response?.data ?? err.message;
    console.error('KW API Error:', message);
    return res.status(status).json({
      success: false,
      message: 'Failed to fetch listings',
      error: message,
    });
  }
};
/**
 * GET /api/listings/filters
 * Returns unique filter options from all listings data
 */
export const getFilterOptions = async (req, res) => {
  try {
    let allListings = [];

    // Check if we have cached data
    if (externalListingsCache.data && externalListingsCache.data.length > 0) {
      allListings = externalListingsCache.data;
    } else {
      // Fetch fresh data from KW API if cache is empty
      const headers = {
        Authorization:
          'Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==',
        Accept: 'application/json',
      };
      const apiLimit = 1000;
      let offset = 0;
      let total = 0;
      let first = true;

      do {
        const pageURL = `https://partners.api.kw.com/v2/listings/region/50394?page[offset]=${offset}&page[limit]=${apiLimit}`;
        const pageRes = await axios.get(pageURL, { headers });
        const hits = pageRes.data?.hits?.hits ?? [];

        allListings = allListings.concat(
          hits.map(hit => ({
            ...hit._source,
            _kw_meta: { id: hit._id, score: hit._score ?? null },
          }))
        );

        if (first) {
          total = pageRes.data?.hits?.total?.value ?? 0;
          first = false;
        }
        offset += apiLimit;
      } while (offset < total);

      // Cache the data
      externalListingsCache.ts = Date.now();
      externalListingsCache.data = allListings.slice();
    }

    // Unique sets (lowercased to ensure uniqueness)
    const propertyTypes = new Set();
    const cities = new Set();
    const subTypes = new Set();
    const marketCenters = new Set();

    allListings.forEach(listing => {
      const normalize = v =>
        typeof v === 'string' ? v.trim().toLowerCase() : null;

      // Property Types
      const propType = normalize(listing.prop_type);
      const propertyType = normalize(listing.property_type);
      if (propType) propertyTypes.add(propType);
      if (propertyType) propertyTypes.add(propertyType);

      // Cities
      const city = normalize(listing.city);
      const city2 = normalize(listing.list_address?.city);
      const location = normalize(listing.location);
      if (city) cities.add(city);
      if (city2) cities.add(city2);
      if (location) cities.add(location);

      // Property Subtypes
      const subType = normalize(listing.prop_subtype);
      const propertySubType = normalize(listing.property_subtype);
      if (subType) subTypes.add(subType);
      if (propertySubType) subTypes.add(propertySubType);

      // Market Centers
      const marketCenter = normalize(listing.market_center);
      const listOffice = normalize(listing.list_office?.office_name);
      if (marketCenter) marketCenters.add(marketCenter);
      if (listOffice) marketCenters.add(listOffice);
    });

    // Convert to arrays, capitalize first letter for display
    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

    // Remove 'Riyadh الرياض' from cities (case-insensitive, ignore whitespace)
    const removeCity = (arr, cityToRemove) => {
      const norm = s => s.replace(/\s+/g, '').toLowerCase();
      return arr.filter(
        c => norm(c) !== norm(cityToRemove)
      );
    };

    let citiesArr = Array.from(cities).map(capitalize);
    citiesArr = removeCity(citiesArr, 'Riyadh الرياض');

    const filterOptions = {
      propertyTypes: Array.from(propertyTypes)
        .map(capitalize)
        .sort(),
      cities: citiesArr.sort(),
      subTypes: Array.from(subTypes)
        .map(capitalize)
        .sort(),
      marketCenters: Array.from(marketCenters)
        .map(capitalize)
        .sort(),
    };

    return res.json({
      success: true,
      data: filterOptions,
    });
  } catch (err) {
    const status = err.response?.status ?? 500;
    const message = err.response?.data ?? err.message;
    console.error('Filter Options API Error:', message);
    return res.status(status).json({
      success: false,
      message: 'Failed to fetch filter options',
      error: message,
    });
  }
};

