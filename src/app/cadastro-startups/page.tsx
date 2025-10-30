"use client";

import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import api from "../../lib/api";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import Image from "next/image";

export default function CadastroStartups() {
  const [formData, setFormData] = useState({
    name: "",
    cnpj: "",
    segment: "",
    problem: "",
    technology: "",
    stage: "IDEACAO",
    location: "",
    founders: "",
    pitch: "",
    links: "",
    nameUser: "",
    emailUser: "",
    passwordUser: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, stage: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await api.post("/startups", formData);
      console.log("Startup e usuário cadastrados:", response.data);
      setSuccess(true);
    } catch (error: any) {
      console.error("Erro ao cadastrar startup:", error);
      setError(
        error.response?.data?.message || "Ocorreu um erro desconhecido."
      );
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#001f61] to-[#003285] p-6">
        <Card className="w-full max-w-md text-center bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-600">
              🎉 Cadastro Realizado com Sucesso!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mt-2">
              Sua startup e seu usuário foram criados com sucesso.
            </p>
            <p className="text-gray-600">
              Agora você pode acessar a plataforma com suas credenciais.
            </p>
            <Button asChild className="mt-6 bg-[#001f61] hover:bg-[#002a7a]">
              <Link href="/login">Ir para o Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#001f61] via-[#003285] to-white py-10 px-6">
      {/* Header visual com logo */}
      <div className="mb-10 text-center">
        <div className="flex justify-center mb-4">
          <Image
            src="/img/logo1.svg"
            alt="Logo co.inova"
            width={200}
            height={60}
            className="object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold text-white drop-shadow-md">
          Cadastro de Startup
        </h1>
        <p className="text-gray-200 mt-2">
          Preencha os dados da sua startup e do administrador responsável.
        </p>
      </div>

      <Card className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* 🔹 Seção 1 - Dados da Startup */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-[#001f61] border-l-4 border-[#001f61] pl-3">
                Informações da Startup
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="mb-2" htmlFor="name">Nome da Startup</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ex: InovaTech"
                    className="bg-gray-100 input-gbl"
                  />
                </div>
                <div>
                  <Label className="mb-2" htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    required
                    placeholder="00.000.000/0000-00"
                    className="bg-gray-100 input-gbl"
                  />
                </div>
                <div>
                  <Label className="mb-2" htmlFor="segment">Segmento</Label>
                  <Input
                    id="segment"
                    value={formData.segment}
                    onChange={handleChange}
                    placeholder="Ex: FinTech, HealthTech"
                    className="bg-gray-100 input-gbl"
                    required
                  />
                </div>
                <div>
                  <Label className="mb-2" htmlFor="technology">Tecnologia Principal</Label>
                  <Input
                    id="technology"
                    value={formData.technology}
                    onChange={handleChange}
                    placeholder="Ex: IA, Blockchain"
                    className="bg-gray-100 input-gbl"
                    required
                  />
                </div>
                <div>
                  <Label className="mb-2" htmlFor="stage">Estágio Atual</Label>
                  <Select
                    onValueChange={handleSelectChange}
                    defaultValue={formData.stage}
                  >
                    <SelectTrigger className="bg-gray-100">
                      <SelectValue placeholder="Selecione o estágio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDEACAO">Ideação</SelectItem>
                      <SelectItem value="OPERACAO">Operação</SelectItem>
                      <SelectItem value="TRACAO">Tração</SelectItem>
                      <SelectItem value="ESCALA">Escala</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2" htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Cidade, Estado"
                    className="bg-gray-100 input-gbl"
                    required
                  />
                </div>
                <div>
                  <Label className="mb-2" htmlFor="founders">Fundadores</Label>
                  <Input
                    id="founders"
                    value={formData.founders}
                    onChange={handleChange}
                    placeholder="Nome dos fundadores"
                    className="bg-gray-100 input-gbl"
                    required
                  />
                </div>
                <div>
                  <Label className="mb-2" htmlFor="links">Website ou LinkedIn</Label>
                  <Input
                    id="links"
                    value={formData.links}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="bg-gray-100 input-gbl"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-2" htmlFor="problem">
                    Qual problema sua startup resolve?
                  </Label>
                  <Textarea
                    id="problem"
                    value={formData.problem}
                    onChange={handleChange}
                    required
                    className="bg-gray-100 input-gbl"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-2" htmlFor="pitch">Pitch (resumo da solução)</Label>
                  <Textarea
                    id="pitch"
                    value={formData.pitch}
                    onChange={handleChange}
                    required
                    className="bg-gray-100 input-gbl"
                  />
                </div>
              </div>
            </div>

            {/* 🔹 Seção 2 - Dados do Usuário */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-[#001f61] border-l-4 border-[#001f61] pl-3">
                Dados do Administrador
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="mb-2" htmlFor="nameUser">Nome Completo</Label>
                  <Input
                    id="nameUser"
                    value={formData.nameUser}
                    onChange={handleChange}
                    className="bg-gray-100 input-gbl"
                    required
                  />
                </div>
                <div>
                  <Label className="mb-2" htmlFor="emailUser">E-mail</Label>
                  <Input
                    id="emailUser"
                    type="email"
                    value={formData.emailUser}
                    onChange={handleChange}
                    className="bg-gray-100 input-gbl"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-2" htmlFor="passwordUser">Senha</Label>
                  <Input
                    id="passwordUser"
                    type="password"
                    value={formData.passwordUser}
                    onChange={handleChange}
                    minLength={6}
                    className="bg-gray-100 input-gbl"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    A senha deve ter no mínimo 6 caracteres.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center bg-red-100 p-3 rounded-lg border border-red-300">
                {error}
              </p>
            )}

            <div className="flex justify-between items-center pt-6">
              <Link
                href="/login"
                className="text-sm text-[#001f61] hover:underline font-medium"
              >
                Já tem uma conta? Faça login
              </Link>
              <Button
                type="submit"
                className="bg-[#011677] cursor-pointer text-white hover:bg-[#001a90] transition-all duration-200 px-6 py-3"
              >
                Finalizar Cadastro
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
