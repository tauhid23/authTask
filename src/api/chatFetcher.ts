export const BASE_URL = "https://lbserver.clintechso.com/api/";

// Generic Fetcher with Authorization + Error Handling
export async function apiFetcher<T>(
  url: string,
  options: RequestInit = {},
  token?: string
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const contentType = res.headers.get("Content-Type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await res.json() : null;

    if (!res.ok) {
      return { success: false, error: data?.detail || data?.message || "Request failed" };
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Network error" };
  }
}