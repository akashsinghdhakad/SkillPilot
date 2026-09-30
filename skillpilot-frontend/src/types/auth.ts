export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  tenant_id: number | null;
  status: string;
  roles: Role[];
}

export interface Tenant {
  id: number;
  name: string;
  slug: string;
  domain: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}
