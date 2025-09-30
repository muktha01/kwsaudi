// pages/api/kw-listings.js
export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://partners.api.kw.com/v2/listings/region/50394?page[offset]=1&page[limit]=100',
      {
        method: 'GET',
        headers: {
          Authorization: 'Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==',
          Accept: 'application/json',
        },
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings', error: error.message });
  }
}
