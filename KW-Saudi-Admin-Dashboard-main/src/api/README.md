# API Endpoints Documentation

This document outlines all the API endpoints available in the Vite frontend for CRUD operations.

## Base URL
All API calls use the base URL: `http://localhost:5001/api`

## 1. Blog API (`blog.js`)

### Endpoints:
- **POST** `/blog` - Create a new blog
- **GET** `/blogs` - Get all blogs
- **GET** `/blog/:id` - Get blog by ID
- **PUT** `/blog/:id` - Update blog by ID
- **DELETE** `/blog/:id` - Delete blog by ID

### Usage:
```javascript
import { blogService } from 'api/blog';

// Create blog
const newBlog = await blogService.createBlog(formData);

// Get all blogs
const blogs = await blogService.getAllBlogs();

// Get blog by ID
const blog = await blogService.getBlogById(id);

// Update blog
const updatedBlog = await blogService.updateBlog(id, formData);

// Delete blog
await blogService.deleteBlog(id);
```

## 2. Page API (`pages.js`)

### Endpoints:
- **POST** `/page` - Create a new page
- **GET** `/pages` - Get all pages
- **GET** `/page/:id` - Get page by ID
- **PUT** `/page/:id` - Update page by ID
- **DELETE** `/page/:id` - Delete page by ID

### Usage:
```javascript
import { pagesService } from 'api/pages';

// Create page
const newPage = await pagesService.create(formData);

// Get all pages
const pages = await pagesService.getAll();

// Get page by ID
const page = await pagesService.getById(id);

// Update page
const updatedPage = await pagesService.update(id, formData);

// Delete page
await pagesService.delete(id);
```

## 3. SEO API (`seo.js`)

### Endpoints:
- **POST** `/seo` - Create or update SEO
- **GET** `/seo/:slug` - Get SEO by slug
- **DELETE** `/seo/:slug` - Delete SEO by slug
- **GET** `/pages` - Get all pages (for SEO management)

### Usage:
```javascript
import { seoService } from 'api/seo';

// Create or update SEO
const seo = await seoService.createOrUpdateSEO(seoData);

// Get SEO by slug
const seo = await seoService.getSEOBySlug(slug);

// Delete SEO by slug
await seoService.deleteSEOBySlug(slug);

// Get all pages
const pages = await seoService.getAllPages();
```

## 4. Agent API (`agent.js`)

### Endpoints:
- **GET** `/agent/:org_id` - Get agents by organization ID
- **GET** `/agents/merge` - Get filtered/merged agents

### Usage:
```javascript
import { agentService } from 'api/agent';

// Get agents by organization ID
const agents = await agentService.getAgentsByOrgId(orgId);

// Get filtered agents
const filteredAgents = await agentService.getFilteredAgents();
```

## 5. User API (`user.js`)

### Endpoints:
- **POST** `/user` - Create a new user
- **GET** `/user` - Get all users
- **GET** `/user/:id` - Get user by ID
- **PUT** `/user/:id` - Update user by ID
- **DELETE** `/user/:id` - Delete user by ID

### Usage:
```javascript
import { userService } from 'api/user';

// Create user
const newUser = await userService.createUser(formData);

// Get all users
const users = await userService.getAllUsers();

// Get user by ID
const user = await userService.getUserById(id);

// Update user
const updatedUser = await userService.updateUser(id, formData);

// Delete user
await userService.deleteUser(id);
```

**Note:** User routes are currently commented out in the backend server.js. Uncomment the userRoutes import and app.use('/api', userRoutes) in server.js to enable user API endpoints.

## 6. Menu API (`menu.js`)

This file uses SWR for state management rather than direct API calls. It manages menu state and drawer operations.

### Usage:
```javascript
import { useGetMenuMaster, handlerDrawerOpen, handlerActiveItem } from 'api/menu';

// Get menu state
const { menuMaster, menuMasterLoading } = useGetMenuMaster();

// Handle drawer open/close
handlerDrawerOpen(true);

// Handle active menu item
handlerActiveItem('dashboard');
```

## Error Handling

All API functions include proper error handling and will throw errors with descriptive messages if the request fails. The error object will contain either the server response data or a default error message.

## File Upload Support

Blog and Page APIs support file uploads using FormData. Make sure to set the appropriate headers when uploading files:

```javascript
const formData = new FormData();
formData.append('title', 'My Title');
formData.append('coverImage', file);

// The API will automatically set the correct headers for multipart/form-data
await blogService.createBlog(formData);
``` 