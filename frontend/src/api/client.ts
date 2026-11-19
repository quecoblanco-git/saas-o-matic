// Centraliza las peticiones HTTP y normaliza los errores devueltos por la API.
const API_BASE_URL = "/api";

export interface ApiValidationDetail {
  path: (string | number)[];
  message: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly details: ApiValidationDetail[];

  constructor(
    status: number,
    message: string,
    details: ApiValidationDetail[] = [],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function parseValidationDetails(value: unknown): ApiValidationDetail[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (detail): detail is ApiValidationDetail =>
      typeof detail === "object" &&
      detail !== null &&
      "path" in detail &&
      Array.isArray(detail.path) &&
      detail.path.every(
        (segment: unknown) =>
          typeof segment === "string" || typeof segment === "number",
      ) &&
      "message" in detail &&
      typeof detail.message === "string",
  );
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody: unknown = await response.json().catch(() => null);

    const message =
      typeof errorBody === "object" &&
      errorBody !== null &&
      "message" in errorBody &&
      typeof errorBody.message === "string"
        ? errorBody.message
        : `HTTP error ${response.status}`;

    const details =
      typeof errorBody === "object" &&
      errorBody !== null &&
      "details" in errorBody
        ? parseValidationDetails(errorBody.details)
        : [];

    throw new ApiError(response.status, message, details);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
