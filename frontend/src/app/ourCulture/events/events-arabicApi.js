const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const eventsArabicApi = {
  getAllEvents: async () => {
    const res = await fetch(`${API_BASE_URL}/events-arabic`);
    if (!res.ok) throw new Error('Failed to fetch Arabic events');
    return res.json();
  },
  getEventById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/events-arabic/${id}`);
    if (!res.ok) throw new Error('Failed to fetch Arabic event');
    return res.json();
  },
};
