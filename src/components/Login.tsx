"use client";

import React, { useState } from "react";
import { CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Image from "next/image";
import api from "../lib/api";
import { User, UserRole } from "../app/context/UserContext";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  // Mantendo os estados que não estavam sendo usados no primeiro bloco mas estavam declarados
  const [role, setRole] = useState<UserRole>("GESTOR");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Login real com API (Funcionalidade intacta)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.access_token && response.data.user) {
        const loggedInUser: User = {
          ...response.data.user,
          access_token: response.data.access_token,
        };

        console.log("Usuário logado:", loggedInUser);
        onLogin(loggedInUser);
      } else {
        setError("Resposta inválida do servidor.");
      }
    } catch (err: any) {
      console.error("Falha no login:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Credenciais inválidas.");
      } else {
        setError("Não foi possível conectar ao servidor.");
      }
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row min-h-screen bg-[url('/img/fundo-login.jpg')] bg-cover bg-center items-center justify-center text-white">
      {/* 🔹 Imagem de fundo geral */}
      <div className="absolute bg-[#001f61]/70 inset-0"></div>

      {/* 🔹 Container principal */}
      <div className="relative z-10 flex flex-col md:flex-row w-full md:m-2 max-w-6xl sm:rounded-2xl rounded-none overflow-hidden ">
        {/* 🔹 Seção esquerda com imagem translúcida (a mesma do fundo) */}
        <div className="hidden md:flex relative flex-col justify-center items-start w-1/2 p-12 text-white overflow-hidden">
          {/* Mesma imagem usada no fundo */}
          <Image
            src="/img/fundo2-login.jpg"
            alt="Imagem decorativa lateral"
            fill
            className="bg-center bg-cover"
          />

          {/* Sobreposição escura para contraste e legibilidade */}
          <div className="absolute hidden md:block inset-0 bg-[#001f61]/50" />

          {/* Conteúdo sobre a imagem */}
          <div className="relative z-10">
            <h1 className="text-5xl font-bold mb-4 leading-tight drop-shadow-md">
              Plataforma de Inovação Aberta
            </h1>
            <p className="text-gray-200 text-lg max-w-md">
              Conectando corporações e startups para acelerar a inovação e
              impulsionar ideias de impacto.
            </p>
          </div>
        </div>

        {/* 🔹 Seção direita - Formulário de Login */}
        <div className="flex-1 bg-white text-gray-800 flex my-8 md:my-0 mx-8 md:mx-0 rounded-2xl md:rounded-none flex-col justify-center px-4 md:px-10 py-12 md:py-16">
          <CardHeader className="text-center mb-6">
            <div className="flex justify-center">
              <Image
                width={200}
                height={60}
                priority
                src="/img/logo2.png"
                alt="Logo co.inova"
                className="object-contain mb-4"
              />
            </div>
            <h2 className="text-2xl font-semibold text-[#001f61]">
              Acesse sua conta
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Entre com seu e-mail e senha para continuar
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="py-6 bg-gray-100 input-gbl border-none text-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="py-6 bg-gray-100 input-gbl border-none text-gray-800 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#001f61] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-center text-sm text-red-500 mt-2">{error}</p>
              )}

              <hr className="text-[#93889d] my-7" />

              <Button
                type="submit"
                className="w-full py-6 bg-[#011677] text-white cursor-pointer hover:bg-[#001a90] transition-all duration-200 rounded-xl font-semibold"
              >
                Entrar na Plataforma
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/cadastro-startups"
                  className="text-sm text-[#001f61] font-medium"
                >
                  Não tem uma conta? <span className="underline text-[#001f61]">Cadastre sua startup</span>
                </Link>
              </div>
            </form>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
