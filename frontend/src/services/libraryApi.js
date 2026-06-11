const API_BASE = (import.meta.env.VITE_LIBRARY_API_BASE_URL || "http://localhost:5000/api/library").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function fetchLibraryDevices() {
  return request("/devices");
}

export function fetchLibraryDevice(deviceId) {
  return request(`/devices/${encodeURIComponent(deviceId)}`);
}

export function fetchLibraryCategories() {
  return request("/categories");
}

export function searchLibraryDevices(query) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  return request(`/search?${params.toString()}`);
}

export function createLibraryDevice(payload) {
  return request("/devices", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateLibraryDevice(deviceId, payload) {
  return request(`/devices/${encodeURIComponent(deviceId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteLibraryDevice(deviceId) {
  return request(`/devices/${encodeURIComponent(deviceId)}`, {
    method: "DELETE",
  });
}

export function fetchLibraryDeviceFiles(deviceId, section) {
  return request(`/devices/${encodeURIComponent(deviceId)}/files/${encodeURIComponent(section)}`);
}

export function uploadLibraryDeviceFile(deviceId, section, payload) {
  return request(`/devices/${encodeURIComponent(deviceId)}/files/${encodeURIComponent(section)}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteLibraryDeviceFile(deviceId, section, fileName) {
  return request(`/devices/${encodeURIComponent(deviceId)}/files/${encodeURIComponent(section)}/${encodeURIComponent(fileName)}`, {
    method: "DELETE",
  });
}

export function fetchProjectHardware(projectId) {
  return request(`http://localhost:5000/api/projects/${encodeURIComponent(projectId)}/hardware`);
}

export function addProjectHardwareDevice(projectId, deviceId) {
  return request(`http://localhost:5000/api/projects/${encodeURIComponent(projectId)}/hardware`, {
    method: "POST",
    body: JSON.stringify({ deviceId }),
  });
}

export function removeProjectHardwareDevice(projectId, deviceId) {
  return request(`http://localhost:5000/api/projects/${encodeURIComponent(projectId)}/hardware/${encodeURIComponent(deviceId)}`, {
    method: "DELETE",
  });
}
