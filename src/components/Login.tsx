import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, UserRole } from '../app/context/UserContext';
import { Lightbulb } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('gestor');
  const [company, setCompany] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mockUser: User = {
      id: Date.now().toString(),
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email,
      role,
      company: company || 'Empresa Demo'
    };
    
    onLogin(mockUser);
  };

  const quickLogin = (userRole: UserRole, userName: string, userCompany: string) => {
    const mockUser: User = {
      id: Date.now().toString(),
      name: userName,
      email: `${userName.toLowerCase()}@${userCompany.toLowerCase().replace(/\s+/g, '')}.com`,
      role: userRole,
      company: userCompany
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
            <Lightbulb className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Plataforma de Inovação Aberta</h1>
          <p className="text-gray-600 mt-2">Conectando corporações e startups para acelerar a inovação</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fazer Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  placeholder="Nome da sua empresa"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Nível de Acesso</Label>
                <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comum">Usuário Comum - Submete ideias</SelectItem>
                    <SelectItem value="avaliador">Avaliador - Analisa ideias</SelectItem>
                    <SelectItem value="gestor">Gestor de Inovação - Visão completa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Entrar na Plataforma
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Login Rápido - Demo</CardTitle>
            <CardDescription>Acesse rapidamente com perfis de exemplo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => quickLogin('gestor', 'Ana Silva', 'TechCorp Brasil')}
            >
              👑 Ana Silva - Gestora de Inovação (TechCorp)
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => quickLogin('avaliador', 'Carlos Santos', 'InnovateCorp')}
            >
              🔍 Carlos Santos - Avaliador (InnovateCorp)
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => quickLogin('comum', 'Maria Costa', 'TechCorp Brasil')}
            >
              💡 Maria Costa - Usuário Comum (TechCorp)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}