'use client';
import React, { useState, useEffect } from 'react';
import { fetchAgentLinks } from '@/lib/agentLinks';

const AgentLinksComponent = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAgentLinks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAgentLinks();
        setLinks(data);
      } catch (err) {
        console.error('Error loading agent links:', err);
        setError('Failed to load agent links. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadAgentLinks();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading agent links...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-600">No agent links available.</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Agent Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <div
            key={link._id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">{link.name}</h3>
            {link.description && (
              <p className="text-gray-600 mb-3 text-sm">{link.description}</p>
            )}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Open Link
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentLinksComponent;