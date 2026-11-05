const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${endpoint}`, options);
  return await res.json();
};
