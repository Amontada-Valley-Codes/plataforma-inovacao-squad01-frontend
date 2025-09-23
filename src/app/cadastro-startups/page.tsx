// app/cadastro-startup/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface FormData {
  nomeStartup: string;
  email: string;
  telefone: string;
  solucao: string;
}

export default function CadastroStartupPage() {
  const [formData, setFormData] = useState<FormData>({
    nomeStartup: "",
    email: "",
    telefone: "",
    solucao: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Dados do formulário enviados:", formData);
    alert("Inscrição enviada com sucesso!");
    // Aqui você enviaria os dados para o servidor.
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Link
          href="/"
          className="flex items-center text-[#011677] hover:underline mb-4"
        >
          <ChevronLeft size={20} className="mr-1" />
          Voltar
        </Link>
        <h1 className="text-3xl font-bold text-[#011677] mb-6 text-center">
          Inscrição para Solução de Desafio
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="nomeStartup"
              className="block text-sm font-medium text-gray-700"
            >
              Nome
            </label>
            <input
              type="text"
              id="nomeStartup"
              name="nomeStartup"
              value={formData.nomeStartup}
              placeholder="Nome da Startup"
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#011677] focus:border-[#011677]"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              placeholder="Email para Contato"
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#011677] focus:border-[#011677]"
            />
          </div>

          <div>
            <label
              htmlFor="telefone"
              className="block text-sm font-medium text-gray-700"
            >
              Telefone
            </label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
              placeholder="(xx) xxxxx-xxxx"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#011677] focus:border-[#011677]"
            />
          </div>

          <div>
            <label
              htmlFor="solucao"
              className="block text-sm font-medium text-gray-700"
            >
              Proposta de Solução 
            </label>
            <textarea
              id="solucao"
              name="solucao"
              value={formData.solucao}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Descreva a solução que sua startup propõe..."
              className="mt-1 block w-full resize-none px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#011677] focus:border-[#011677]"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#011677] text-white py-2 px-4 rounded-md hover:bg-[#160430] transition"
          >
            Enviar Inscrição
          </button>
        </form>
      </div>
    </div>
  );
}
