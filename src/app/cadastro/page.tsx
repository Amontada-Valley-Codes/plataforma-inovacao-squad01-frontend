// /plat_inovacao/src/app/cadastro/page.tsx

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { Label } from '../../components/ui/label';
import { Input } from '../..//components/ui/input';
import { Button } from '../..//components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../..//components/ui/card';
import Image from 'next/image';
import api from '../../lib/api'; // Importar o axios

// Componente principal que usa Suspense
export default function CadastroPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CadastroForm />
    </Suspense>
  );
}

// Componente do formulário
function CadastroForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Estados para o formulário
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Efeito para ler o token e descodificar o e-mail
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      try {
        const decoded: { email: string } = jwtDecode(tokenFromUrl);
        setEmail(decoded.email);
      } catch (e) {
        setError('Token de convite inválido ou expirado.');
        console.error("Erro ao descodificar o token:", e);
      }
    } else {
        setError('Nenhum token de convite encontrado.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
    }

    if (!token) {
        setError('Token de convite ausente. Não é possível continuar.');
        return;
    }

    setIsLoading(true);

    try {
        // Enviar os dados para o endpoint de completar o convite
        await api.post('/invitations/complete', {
            token,
            name,
            password,
        });

        alert('Cadastro concluído com sucesso! Você será redirecionado para a página de login.');
        router.push('/login');

    } catch (err: any) {
        console.error('Falha ao completar o cadastro:', err);
        setError(err.response?.data?.message || 'Ocorreu um erro ao finalizar o cadastro.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="relative w-full max-w-4xl mx-auto">
            <Card className="grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
                <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                    <CardHeader className="p-0 mb-6 text-center">
                        <CardTitle className="text-3xl font-bold text-[#001f61]">Finalize seu Cadastro</CardTitle>
                        <CardDescription>Bem-vindo(a)! Preencha os seus dados para aceder à plataforma.</CardDescription>
                    </CardHeader>

                    {/* Adicionar o onSubmit ao formulário */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail (convidado)</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                disabled // O e-mail não pode ser alterado
                                className="bg-gray-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                                id="name"
                                placeholder="Seu nome completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Crie uma senha forte"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirme sua Senha</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Repita a senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                        <Button type="submit" className="w-full bg-[#001f61] hover:bg-[#002a7a]" disabled={isLoading}>
                            {isLoading ? 'A cadastrar...' : 'Finalizar Cadastro'}
                        </Button>
                    </form>
                </CardContent>
                <div className="hidden md:block relative">
                    <Image
                        src="/img/fundo-login.jpg"
                        alt="Imagem de fundo"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </Card>
        </div>
    </div>
  );
}