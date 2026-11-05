const API_BASE = 'https://rewards-app-backend-lq2v.onrender.com';

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Fetch error at', url, err);
    return { success: false, message: 'Server connection error: ' + err.message };
  }
};
