const API_BASE = "/api";

function getToken() {
    return localStorage.getItem("token");
}

async function request(path, options = {}) {
    const headers = options.headers || {};

    const token = getToken();

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    let data = null;

    try {
        data = await res.json();
    } catch {
        // no JSON body
    }

    if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
    }

    return data;
}

export const api = {
    register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    me: () => request("/auth/me"),
    updateProfile: (body) => request("/auth/profile", { method: "PUT", body: JSON.stringify(body) }),
    listMemories: () => request("/memories"),
    getMemory: (id) => request(`/memories/${id}`),
    createMemory: (formData) => request("/memories", { method: "POST", body: formData }),
    updateMemory: (id, formData) => request(`/memories/${id}`, { method: "PUT", body: formData }),
    deleteMemory: (id) => request(`/memories/${id}`, { method: "DELETE" }),
};
