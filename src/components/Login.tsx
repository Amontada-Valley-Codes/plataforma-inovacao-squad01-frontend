import React, { useState } from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, UserRole } from '../app/context/UserContext';
import Image from 'next/image';

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
    <div className="h-screen flex flex-col w-auto md:flex-row items-center justify-center bg-[url(/img/ninnafundo.jpeg)] bg-center bg-cover">
      <div className='absolute top-0 bottom-0 left-0 right-0 bg-[#011677]/40 '></div>
      <div className="w-full space-y-6 flex justify-between z-10">
        <div className="md:text- justify-center flex-col md:ml-24 hidden md:flex">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
          </div>
          <h1 className="text-6xl  w-1/2 font-bold text-white">Plataforma de <span className='text-[#5ff604]'>Inovação Aberta</span></h1>
          <p className="text-white mt-4">Conectando corporações e startups para acelerar a inovação</p>
        </div>

        <div className='h-screen md:w-1/3 w-full flex space-y-2.5 md:px-4 flex-col justify-center  bg-[#011677] text-white shadow'>
          <CardHeader>
            <div className='flex justify-center'>
              <Image
              width={100}
              height={100}
              src='/img/ninna_logo.png'
              alt="Ninna Logo"
              className='w-[270px]'
              />
            </div>
            <CardTitle className='font-medium'>Fazer Login</CardTitle>
            <CardDescription className='text-white'>
              Entre com suas credenciais para acessar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  className='bg-[#261046] border-none py-6'
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
                  className='bg-[#261046] border-none py-6'
                  id="company"
                  placeholder="Nome da sua empresa"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Nível de Acesso</Label>
                <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                  <SelectTrigger className='bg-[#261046] border-none text-[#93889d] py-6'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-[#261046] text-[#93889d] border-none'>
                    <SelectItem value="comum">Usuário Comum - Submete ideias</SelectItem>
                    <SelectItem value="avaliador">Avaliador - Analisa ideias</SelectItem>
                    <SelectItem value="gestor">Gestor de Inovação - Visão completa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <hr className='text-[#93889d] my-7'/>

              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => quickLogin('admin', 'Admin', 'Ninna Hub')}
              >
                ⚙️ Admin - Super Usuário (Hub)
              </Button>

              <Button type="submit" className="w-full bg-gradient-to-l to-[#5ff604] from-[#01733e] text-white cursor-pointer py-6">
                Entrar na Plataforma
              </Button>
              
            </form>
          </CardContent>
        </div>
      </div>
    </div>
  );
}