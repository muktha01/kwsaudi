const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const newsArabicApi = {
  getAllNews: async () => {
    const res = await fetch(`${API_BASE_URL}/news-arabic`);
    if (!res.ok) throw new Error('Failed to fetch Arabic news');
    return res.json();
  },
};
