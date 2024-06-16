const api = (() => {
  const BASE_URL = 'http://localhost:5006';

  // Authentications
  function putAccessToken(token) {
    localStorage.setItem('accessToken', token);
  }

  function getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  function putRefreshToken(token) {
    return localStorage.setItem('refreshToken', token);
  }

  function getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  function deleteToken() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async function _fetchWithAuth(url, options = {}) {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
  }

  // Users
  async function register({ name, email, password }) {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    return { status };
  }

  async function login({ email, password }) {
    const response = await fetch(`${BASE_URL}/authentications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const responseJson = await response.json();
    const { status, message, data } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    return data;
  }

  async function refreshToken() {
    const response = await fetch(`${BASE_URL}/authentications`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: `${getRefreshToken()}`,
      }),
    });

    const responseJson = await response.json();
    const { status, message, data } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
    putAccessToken(data.accessToken);
  }

  async function getOwnProfile() {
    const response = await _fetchWithAuth(`${BASE_URL}/users`);
    const responseJson = await response.json();

    const { status, message, error, data } = responseJson;

    return { status, error, message, data };
    // if (status !== 'success') {
    //   throw new Error(message);
    // }

    // const { data } = responseJson;

    // return data;
  }

  // Catalogues
  async function addCatalogues({ payload }) {
    const response = await _fetchWithAuth(`${BASE_URL}/catalogues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    return { status };
  }

  async function updateCatalogues({ cataloguesId, payload }) {
    const response = await _fetchWithAuth(`${BASE_URL}/catalogues/${cataloguesId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    return { status };
  }

  async function deleteCatalogues({ cataloguesId }) {
    const response = await _fetchWithAuth(`${BASE_URL}/catalogues/${cataloguesId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    return { message };
  }

  async function updateStatusCatalogues({ cataloguesId }) {
    const response = await _fetchWithAuth(`${BASE_URL}/catalogues/${cataloguesId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    return { message };
  }

  async function getCatalogues() {
    const response = await fetch(`${BASE_URL}/catalogues`);

    const responseJson = await response.json();

    const { status, message, data } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    return data;
  }

  async function adminGetCatalogues() {
    const response = await _fetchWithAuth(`${BASE_URL}/catalogues`);

    const responseJson = await response.json();

    const { status, message, data } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    return data;
  }

  async function getCataloguesBySlug({ slug }) {
    const response = await fetch(`${BASE_URL}/catalogues/${slug}`);

    const responseJson = await response.json();

    const { status, message, data } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    return data;
  }

  async function getCataloguesById({ cataloguesId }) {
    const response = await fetch(`${BASE_URL}/catalogues/${cataloguesId}/admin`);

    const responseJson = await response.json();

    const { status, message, data } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    return data;
  }

  // Orders
  async function addOrders({ payload }) {
    const response = await _fetchWithAuth(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    return { status };
  }

  async function updateOrders({ ordersId, payload }) {
    const response = await _fetchWithAuth(`${BASE_URL}/orders/${ordersId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    return { status };
  }

  async function deleteOrders({ ordersId }) {
    const response = await _fetchWithAuth(`${BASE_URL}/orders/${ordersId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    return { message };
  }

  async function updateStatusOrders({ ordersId }) {
    const response = await _fetchWithAuth(`${BASE_URL}/orders/${ordersId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseJson = await response.json();
    return responseJson;
  }

  async function getOrders() {
    const response = await _fetchWithAuth(`${BASE_URL}/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseJson = await response.json();

    const { status, message, data } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    return data;
  }

  async function getOrdersById({ ordersId }) {
    const response = await _fetchWithAuth(`${BASE_URL}/orders/${ordersId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseJson = await response.json();

    const { status, message, data } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    return data;
  }


  return {
    // Authentications
    putAccessToken,
    getAccessToken,
    putRefreshToken,
    getRefreshToken,
    refreshToken,
    deleteToken,
    // Users
    register,
    login,
    getOwnProfile,
    // Catalogues
    addCatalogues,
    updateCatalogues,
    deleteCatalogues,
    updateStatusCatalogues,
    getCatalogues,
    adminGetCatalogues,
    getCataloguesBySlug,
    getCataloguesById,
    // Orders
    addOrders,
    updateOrders,
    deleteOrders,
    updateStatusOrders,
    getOrders,
    getOrdersById,
  }
})();

export default api;
