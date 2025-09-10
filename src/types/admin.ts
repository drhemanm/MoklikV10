export interface AdminCredentials {
  username: string;
  password: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'admin';
  lastLogin: number;
}

// Admin credentials - IMPORTANT: In production, these should be stored securely
export const ADMIN_CREDENTIALS: AdminCredentials = {
  username: 'admin@moklik.com',
  password: 'MoklikAdmin2024!'
};