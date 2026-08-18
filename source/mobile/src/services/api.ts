const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') || '';

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export { API_URL };
