'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import Image from 'next/image';
import { KeyRound } from 'lucide-react';

// Esta página simula o que o utilizador convidado veria ao clicar no link do e-mail.
export default function CadastroPage() {
  // Num cenário real, este e-mail viria de uma chamada à API após validar o token da URL.
  const userEmail = "novo.colaborador@techcorp.com";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <KeyRound className="w-6 h-6 text-gray-600" />
            </div>
            <CardTitle>Finalize o seu Cadastro</CardTitle>
            <CardDescription>
              Você foi convidado para a Plataforma de Inovação. Crie uma senha para aceder.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={userEmail}
                  disabled // O e-mail vem do convite e não pode ser alterado
                  className="bg-gray-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Crie uma Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirme a sua Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="********"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Criar Conta e Aceder
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}