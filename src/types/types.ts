export type UserRole = 'comum' | 'avaliador' | 'gestor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company: string;
  image_url?: string; // ✨ NOVO CAMPO ADICIONADO AQUI
}