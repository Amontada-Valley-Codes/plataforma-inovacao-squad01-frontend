import React, { useState } from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, UserRole } from '../app/context/UserContext';
import Image from 'next/image';
import { api } from '../service/Api';

interface LoginProps {
  onLogin: (data: { user: User, token: string }) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState(''); // Preenchido para facilitar o teste
  const [password, setPassword] = useState(''); // Preenchido para facilitar o teste
  const [error, setError] = useState('');
  const [role, setRole] = useState<UserRole>('GESTOR');
  const [company, setCompany] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // Faz a chamada para o endpoint /auth/login do back-end
      const response = await api.post('/auth/login', { email, password });
      
      // Se for bem-sucedido, chama a função onLogin com os dados do back-end
      console.log(response.data);
      onLogin({
        user: response.data.user,
        token: response.data.access_token,
      });

    } catch (err) {
      // Se as credenciais estiverem erradas, mostra uma mensagem de erro
      setError('E-mail ou senha inválidos. Tente novamente.');
      console.error('Falha no login:', err);
    }
  };

  // const quickLogin = (userRole: UserRole, userName: string, userCompany: string) => {
  //   const mockUser: User = {
  //     id: Date.now().toString(),
  //     name: userName,
  //     email: `${userName.toLowerCase()}@${userCompany.toLowerCase().replace(/\s+/g, '')}.com`,
  //     role: userRole,
  //     company: userCompany
  //   };
  //   onLogin(mockUser);
  // };

  return (
    <div className="h-screen flex flex-col w-auto md:flex-row items-center justify-center bg-[url(/img/fundo-login.jpg)] bg-center bg-cover ">
      <div className='absolute top-0 bottom-0 left-0 right-0 bg-[#011677]/40 '></div>
      <div className="w-full space-y-6 flex justify-between z-10">
        <div className="md:text- justify-center flex-col md:ml-24 hidden md:flex">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
          </div>
          <h1 className="text-6xl  w-1/2 font-bold text-white">Plataforma de Inovação Aberta</h1>
          <p className="text-white mt-4">Conectando corporações e startups para acelerar a inovação</p>
        </div>

        <div className='h-screen md:w-1/3 w-full pt-10 flex space-y-2.5 md:px-4 flex-col justify-center  bg-[#011677] text-white shadow'>
          <CardHeader>
            <div className='flex justify-center'>
              <Image
              width={100}
              height={10}
              src='/img/logo.png'
              alt="logo co.inova"
              className='w-[250px]'
              />
            </div>
            <CardTitle className='font-medium'>Fazer Login</CardTitle>
            <CardDescription className='text-white'>
              Entre com suas credenciais para acessar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className='mb-20'>
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
                <Label htmlFor="password">Senha</Label>
                <Input
                  className='bg-[#261046] border-none py-6'
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <hr className='text-[#93889d] my-7'/>

              

              <Button type="submit" className="w-full bg-white text-[#011677] hover:bg-[#261046] hover:text-white cursor-pointer py-6">
                Entrar na Plataforma
              </Button>
              
            </form>
          </CardContent>
        </div>
      </div>
    </div>
  );
}