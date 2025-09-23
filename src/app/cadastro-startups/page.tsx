// app/cadastro-startup/page.tsx
"use client";

import { useState } from "react"; // Removed useEffect and useSearchParams as they are no longer needed
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface FormData {
  nomeStartup: string;
  email: string;
  desafioNome: string; // Changed from desafioId to desafioNome
}

export default function CadastroStartupPage() {
  // Removed searchParams and the useEffect to handle URL parameters
  const [formData, setFormData] = useState<FormData>({
    nomeStartup: "",
    email: "",
    desafioNome: "", // Initial value is an empty string
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    // Here, you would send the formData to your server.
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Link href="/" className="flex items-center text-[#011677] hover:underline mb-4">
          <ChevronLeft size={20} className="mr-1" />
          Voltar para a página inicial
        </Link>
        <h1 className="text-3xl font-bold text-[#011677] mb-6 text-center">Inscrição para Desafio</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nomeStartup" className="block text-sm font-medium text-gray-700">
              Nome da Startup
            </label>
            <input
              type="text"
              id="nomeStartup"
              name="nomeStartup"
              value={formData.nomeStartup}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#011677] focus:border-[#011677]"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail de Contato
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#011677] focus:border-[#011677]"
            />
          </div>
          <div>
            <label htmlFor="desafioNome" className="block text-sm font-medium text-gray-700">
              Desafio:
            </label>
            <input
              type="text"
              id="desafioNome"
              name="desafioNome" // The 'name' must match the key in your formData state
              value={formData.desafioNome}
              onChange={handleChange}
              placeholder="Digite o nome do desafio..."
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#011677] focus:border-[#011677]"
            />
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