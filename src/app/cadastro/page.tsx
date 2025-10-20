'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import Image from 'next/image';
import api from '../../lib/api';

export default function CadastroPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-600 mt-10">Carregando...</div>}>
      <CadastroForm />
    </Suspense>
  );
}

function CadastroForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      try {
        const decoded: { email: string } = jwtDecode(tokenFromUrl);
        setEmail(decoded.email);
      } catch (e) {
        setError('Token de convite inválido ou expirado.');
        console.error("Erro ao decodificar o token:", e);
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
      await api.post('/invitations/complete', { token, name, password });
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
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#001848] via-[#002d6b] to-[#0041a3] overflow-hidden">
      {/* Background decorative blur */}
      <div className="absolute inset-0 bg-[url('/img/fundo-login.jpg')] bg-cover bg-center opacity-10"></div>

      <div className="relative w-full max-w-5xl mx-auto px-4">
        <Card className="grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl bg-white/95 animate-fadeIn border border-white/40">
          {/* Left Side - Form */}
          <CardContent className="p-10 md:p-14 flex flex-col justify-center">
            <CardHeader className="p-0 mb-8 text-center">
              <CardTitle className="text-4xl font-bold text-[#001f61] tracking-tight">
                Finalize seu Cadastro
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Bem-vindo(a)! Preencha seus dados para acessar a plataforma.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  E-mail (convidado)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="focus:ring-2 focus:ring-[#0041a3] transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Crie uma senha forte"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="focus:ring-2 focus:ring-[#0041a3] transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                  Confirme sua Senha
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="focus:ring-2 focus:ring-[#0041a3] transition-all"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center bg-red-50 py-2 rounded-lg border border-red-200">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full mt-4 bg-[#001f61] cursor-pointer hover:bg-[#002a7a] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                disabled={isLoading}
              >
                {isLoading ? 'Cadastrando...' : 'Finalizar Cadastro'}
              </Button>
            </form>
          </CardContent>

          {/* Right Side - Image */}
          <div className="hidden md:block relative">
            <Image
              src="/img/fundo-login.jpg"
              alt="Imagem de fundo"
              fill
              className="object-cover brightness-[0.6]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent" />
          </div>
        </Card>
      </div>
    </div>
  );
}
