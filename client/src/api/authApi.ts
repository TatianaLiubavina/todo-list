const API_BASE_URL = "http://localhost:8000";

type LoginRequest = {
  username: string;
  password: string;
};

type AuthTokenResponse = {
  access_token: string;
  token_type: "bearer";
  username: string;
};

type MeResponse = {
  username: string;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Произошла ошибка при выполнении запроса");
  }

  return response.json() as Promise<T>;
};

export const authApi = {
  login: async (req: LoginRequest): Promise<AuthTokenResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    return handleResponse<AuthTokenResponse>(response);
  },

  register: async (req: LoginRequest): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    return handleResponse<{ message: string }>(response);
  },

  me: async (token: string): Promise<MeResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<MeResponse>(response);
  },
};