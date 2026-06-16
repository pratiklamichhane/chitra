const API_BASE = "http://chitra-studio-api.test/api";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "superadmin" | "studio_owner";
  role_label: string;
  initials: string;
}

export interface Studio {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  access_enabled: boolean;
  subscription: {
    cycle: string;
    cycle_label: string;
    price_npr: number;
    price_formatted: string;
    starts_at: string | null;
    ends_at: string | null;
    is_active: boolean;
  };
}

export interface SubscriptionDetail {
  cycle: string;
  cycle_label: string;
  price_npr: number;
  price_formatted: string;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  access_enabled: boolean;
  days_remaining: number;
}

export interface CustomerPhoto {
  id: number;
  customer_name: string;
  customer_number: string;
  photo_url: string;
  created_at: string;
  updated_at: string;
}

export interface PhotoListResponse {
  data: CustomerPhoto[];
  links: Record<string, unknown>;
  meta: Record<string, unknown>;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function forgotPassword(
  email: string
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function getProfile(token: string): Promise<User & { studio: Studio | null }> {
  const res = await fetch(`${API_BASE}/user`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
  return data;
}

export async function getStudio(token: string): Promise<Studio> {
  const res = await fetch(`${API_BASE}/studio`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch studio");
  return data;
}

export async function getSubscription(token: string): Promise<{ subscription: SubscriptionDetail }> {
  const res = await fetch(`${API_BASE}/studio/subscription`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch subscription");
  return data;
}

export async function getPhotos(token: string, search?: string, page: number = 1): Promise<PhotoListResponse> {
  const url = new URL(`${API_BASE}/photos`);
  if (search) url.searchParams.append("search", search);
  url.searchParams.append("page", page.toString());

  const res = await fetch(url.toString(), {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch photos");
  return data;
}

export async function storePhoto(token: string, formData: FormData): Promise<{ message: string; photo: CustomerPhoto }> {
  const res = await fetch(`${API_BASE}/photos`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to store photo");
  return data;
}
