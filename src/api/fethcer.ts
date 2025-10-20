const BASE_URL = "https://lbserver.clintechso.com/api/";

export const fetcher = async (endpoint: string, options: RequestInit={}, token?: string) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });
    if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Something went wrong");
  }

  return res.json();
    }