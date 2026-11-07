// Thin fetch wrapper shared by every service.
// In M1 `/api` is proxied by Vite to json-server (see vite.config.ts);
// in M3 the same base URL will point at the NestJS API.
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init.headers }
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Is the mock API running (npm run mock)?');
  }

  if (!response.ok) {
    const message =
      response.status === 404 ? 'The requested resource was not found.' : `Request failed (${response.status}).`;
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}
