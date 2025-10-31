"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { UserPlus, Loader2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { User, UserRole } from "../app/context/UserContext";
import Sidebar from "./SideBar";
import api from "../lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface CollaboratorsProps {
  user: User;
}
type InviteStatus = "idle" | "loading" | "success" | "error";

interface PendingInvite {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  companyId: string;
  status: "PENDENTE" | "ACCEPTED" | "REJECTED";
}

export default function Collaborators({ user }: CollaboratorsProps) {
  const [theme, setTheme] = useState<string>(
    typeof window !== "undefined"
      ? sessionStorage.getItem("theme") || "light"
      : "light"
  );
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("COMUM");
  const [formError, setFormError] = useState("");
  const [inviteStatus, setInviteStatus] = useState<InviteStatus>("idle");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("collaborators");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const companyIdToFilter =
      user.role === "ADMIN" ? selectedCompanyId : user.companyId;

    try {
      const [collaboratorsRes, allInvitesRes] = await Promise.all([
        companyIdToFilter
          ? api.get(`/user/${companyIdToFilter}`)
          : Promise.resolve({ data: [] }),
        api.get("/invitations"),
      ]);
      setCollaborators(collaboratorsRes.data || []);
      const filteredInvites = (allInvitesRes.data || []).filter(
        (invite: PendingInvite) =>
          invite.companyId === companyIdToFilter && invite.status === "PENDENTE"
      );
      setPendingInvites(filteredInvites);
    } catch (error: any) {
      console.error("Falha ao buscar dados:", error);
      setCollaborators([]);
      setPendingInvites([]);
    } finally {
      setIsLoading(false);
    }
  }, [user.companyId, user.role, selectedCompanyId]);

  useEffect(() => {
    fetchData();
    if (user.role === "ADMIN") {
      api
        .get("/companies/")
        .then((res) => {
          // 💡 CORREÇÃO AQUI
          // Verificamos se a resposta tem a propriedade 'data' e se ela é um array
          if (res.data && Array.isArray(res.data.data)) {
            setCompanies(res.data.data);
            console.log("Empresas carregadas:", res.data.data);
          } else {
            // Se a resposta for um array direto (para manter a compatibilidade)
            setCompanies(res.data);
            console.log("Empresas carregadas (array direto):", res.data);
          }
        })
        .catch((err) => {
          console.error("Falha ao buscar empresas", err);
          setCompanies([]); // Garante que o estado seja um array em caso de erro
        });
    }
  }, [fetchData, user.role]);

  // 🚀 Enviar convite (com prevenção de duplicados e múltiplos envios)
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setInviteStatus("loading");

    if (!inviteEmail || !inviteRole) {
      setFormError("Por favor, preencha todos os campos.");
      setInviteStatus("error");
      return;
    }

    const emailLower = inviteEmail.trim().toLowerCase();
    const emailJaExiste =
      collaborators.some((c) => c.email.toLowerCase() === emailLower) ||
      pendingInvites.some((i) => i.email.toLowerCase() === emailLower);

    if (emailJaExiste) {
      setFormError("Este e-mail já foi convidado ou já faz parte da equipe.");
      setInviteStatus("error");
      return;
    }

    try {
      const payload: { email: string; role: string; companyId?: string } = {
        email: inviteEmail,
        role: inviteRole.toUpperCase(),
        companyId: user.companyId,
      };

      if (user.role === "ADMIN") {
        if (!selectedCompanyId) {
          setFormError("Admin deve selecionar uma empresa.");
          setInviteStatus("error");
          return;
        }
        payload.companyId = selectedCompanyId;
      }

      await api.post("/invitations", payload);
      setInviteStatus("success");

      fetchData();
      setInviteEmail("");
      setInviteRole("COMUM");

      // Retorna para "idle" depois de 1.5s (permite novo envio)
      setTimeout(() => setInviteStatus("idle"), 1500);
    } catch (err: any) {
      console.error("Falha ao enviar convite:", err);
      setFormError(err.response?.data?.message || "Ocorreu um erro.");
      setInviteStatus("error");
    }
  };

  // Reseta status quando modal abrir
  useEffect(() => {
    if (isDialogOpen) {
      setInviteStatus("idle");
      setFormError("");
    }
  }, [isDialogOpen]);

  const handleRemoveInvite = async (inviteId: string) => {
    if (!window.confirm("Tem certeza que deseja remover este convite?")) return;
    try {
      await api.delete(`/invitations/${inviteId}`);
      setPendingInvites((prev) =>
        prev.filter((invite) => invite.id !== inviteId)
      );
      alert("Convite removido com sucesso!");
    } catch (error) {
      console.error("Falha ao remover convite:", error);
      alert("Ocorreu um erro ao remover o convite.");
    }
  };

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<string, string> = {
      COMUM: "Usuário Comum",
      AVALIADOR: "Avaliador",
      GESTOR: "Gestor de Inovação",
    };
    return labels[role] || role;
  };

  // 💡 INÍCIO DA NOVA FUNÇÃO PARA ATUALIZAR O CARGO
  const handleRoleChange = async (
    collaboratorId: string,
    newRole: UserRole
  ) => {
    // Previne que o gestor altere o próprio cargo
    if (user.id === collaboratorId) {
      alert("Você não pode alterar sua própria função.");
      return;
    }

    try {
      // Envia a requisição para o backend para atualizar o usuário
      await api.put(`/user/${collaboratorId}`, {
        role: newRole,
        companyId: user.companyId,
      });

      // Atualiza o estado local para refletir a mudança instantaneamente na UI
      setCollaborators((prevCollaborators) =>
        prevCollaborators.map((c) =>
          c.id === collaboratorId ? { ...c, role: newRole } : c
        )
      );

      alert("Função do colaborador atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar a função:", error);
      alert(
        "Não foi possível atualizar a função do colaborador. Tente novamente."
      );
      // Opcional: recarregar os dados para reverter a mudança visual em caso de erro
      fetchData();
    }
  };
  // 💡 FIM DA NOVA FUNÇÃO

  return (
    <div
			className={`flex h-screen bg-background text-white overflow-hidden ${theme === "dark" ? "bg-gray-900" : ""
				}`}
		>
			<Sidebar theme={theme} user={user} />

			{/* 🔧 Conteúdo com rolagem independente */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Header fixo */}
				<div
					className={`bg-[#011677] sticky top-0 z-10 ${theme === "dark" ? "bg-gray-800" : "border-b border-gray-200"
						}`}
				>
					<div className="container mx-auto px-6 py-4">
						<div className="flex items-center gap-2 justify-center sm:justify-start">
							<UserPlus className="w-6 h-6 text-white" />
							<h1 className="text-xl font-semibold text-white">
								Colaboradores
							</h1>
						</div>
					</div>
				</div>


      <main className="flex-1 w-full px-6 py-20 overflow-y-auto">
        <Card
          className={`shadow-xl rounded-2xl transition-all duration-300 ${
            theme === "dark"
              ? "bg-gray-900 border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
            <div>
              <CardTitle
                className={`${
                  theme === "dark" ? "text-white" : "text-black"
                } text-2xl font-bold`}
              >
                Equipe e Acessos
              </CardTitle>
              <CardDescription
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Gerencie colaboradores e permissões da sua equipe.
              </CardDescription>
            </div>

            {/* Botão + Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="cursor-pointer flex items-center gap-2 font-semibold px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all bg-[#011677] hover:bg-[#002a7a] text-white"
                >
                  <UserPlus size={18} /> Convidar
                </Button>
              </DialogTrigger>

              <DialogContent
                className={`${
                  theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white"
                } rounded-xl shadow-2xl`}
              >
                <DialogHeader className="text-center">
                  <DialogTitle className="text-xl font-semibold">
                    Convidar Novo Colaborador
                  </DialogTitle>
                  <DialogDescription
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Preencha os dados para enviar o convite.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleInviteSubmit} className="space-y-5 mt-4">
                  {user.role === "ADMIN" && (
                    <div className="space-y-1">
                      <Label>Empresa</Label>
                      <Select
                        value={selectedCompanyId}
                        onValueChange={setSelectedCompanyId}
                        required
                      >
                        <SelectTrigger
                          className={`${
                            theme === "dark"
                              ? "bg-gray-800 border-gray-700"
                              : ""
                          }`}
                        >
                          <SelectValue placeholder="Selecione a empresa" />
                        </SelectTrigger>
                        <SelectContent
                          className={`${
                            theme === "dark"
                              ? "bg-gray-800 border-gray-700"
                              : ""
                          }`}
                        >
                          {Array.isArray(companies) &&
                            companies.map((company) => (
                              <SelectItem key={company.id} value={company.id}>
                                {company.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label className="pb-3">E-mail</Label>
                    <Input
                      type="email"
                      placeholder="email@empresa.com"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className={`${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/60"
                          : "input-gbl"
                      }`}
                    />
                  </div>

                  <div>
                    <Label className="pb-3">Nível de Acesso</Label>
                    <Select
                      value={inviteRole}
                      onValueChange={(value: UserRole) => setInviteRole(value)}
                    >
                      <SelectTrigger
                        className={`${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-700 text-gray-300"
                            : ""
                        }`}
                      >
                        <SelectValue placeholder="Selecione um nível" />
                      </SelectTrigger>
                      <SelectContent
                        className={`${
                          theme === "dark"
                            ? "bg-gray-700 text-white border-gray-700"
                            : ""
                        }`}
                      >
                        <SelectItem value="COMUM">Usuário Comum</SelectItem>
                        <SelectItem value="AVALIADOR">Avaliador</SelectItem>
                        {user.role === "ADMIN" && (
                          <SelectItem value="GESTOR">
                            Gestor de Inovação
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Feedback */}
                  {formError && (
                    <p className="text-red-500 text-sm text-center">
                      {formError}
                    </p>
                  )}
                  {inviteStatus === "success" && (
                    <p className="text-green-600 font-medium text-center animate-pulse">
                      ✅ Convite enviado com sucesso!
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={inviteStatus === "loading"}
                    className={`w-full cursor-pointer font-semibold py-2 rounded-md transition-all
                      ${
                        inviteStatus === "loading"
                          ? "bg-blue-500 animate-pulse"
                          : inviteStatus === "success"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-[#001f61] hover:bg-[#002a7a]"
                      } text-white`}
                  >
                    {inviteStatus === "loading" && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {inviteStatus === "loading"
                      ? "Enviando..."
                      : inviteStatus === "success"
                      ? "Enviado!"
                      : "Enviar Convite"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-full p-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <TabsTrigger
                  value="collaborators"
                  className={`cursor-pointer py-2 text-sm font-medium transition-all ${
                    activeTab === "collaborators"
                      ? "bg-[#011677] text-white shadow-md scale-[1.02]"
                      : `${theme === "dark" ? "text-white" : "text-black"}`
                  }`}
                >
                  Colaboradores ({collaborators.length})
                </TabsTrigger>

                <TabsTrigger
                  value="pending"
                  className={`cursor-pointer py-2 text-sm font-medium transition-all ${
                    activeTab === "pending"
                      ? "bg-[#011677] text-white shadow-md scale-[1.02]"
                      : `${theme === "dark" ? "text-white" : "text-black"}`
                  }`}
                >
                  Pendentes ({pendingInvites.length})
                </TabsTrigger>
              </TabsList>

              {/* Tabela de Colaboradores */}
              <TabsContent value="collaborators" className="mt-6">
                {isLoading ? (
                  <p className="text-center text-gray-500">Carregando...</p>
                ) : collaborators.length === 0 ? (
                  <p className="text-center text-gray-500">
                    Nenhum colaborador encontrado.
                  </p>
                ) : (
                  <div
                    className={`${
                      theme === "dark" ? "text-white" : "text-black"
                    } overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700`}
                  >
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Função</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {collaborators.map((colab) => (
                          <TableRow key={colab.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {/* Avatar estilizado */}
                                 <Avatar>
                                  <AvatarImage src={colab.avatarUrl || undefined} />
                                  <AvatarFallback className={`border-[#011677] border-2 ${theme === 'dark' ? 'border-white' : ''}`}>{colab.name?.[0]}</AvatarFallback>
                                </Avatar>

                                {colab.name}
                              </div>
                            </TableCell>
                            <TableCell>{colab.email}</TableCell>
                            <TableCell>{getRoleLabel(colab.role)}</TableCell>
                            <TableCell>
                              {/* 💡 INÍCIO DAS ALTERAÇÕES NO SELECT */}
                              <Select
                                defaultValue={colab.role}
                                // Aciona a função de atualização quando o valor muda
                                onValueChange={(newRole) =>
                                  handleRoleChange(
                                    colab.id,
                                    newRole as UserRole
                                  )
                                }
                                // Habilita apenas para GESTOR e desabilita para o próprio usuário
                                disabled={
                                  user.role !== "GESTOR" || user.id === colab.id
                                }
                              >
                                <SelectTrigger
                                  className={`w-48 cursor-pointer border-gray-300 focus:ring-[#001f61]/30 ${
                                    theme === "dark"
                                      ? "bg-gray-700 text-gray-200 border-gray-600"
                                      : ""
                                  }`}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent
                                  className={`shadow-lg ${
                                    theme === "dark"
                                      ? "bg-gray-800 border-gray-600"
                                      : "bg-white"
                                  }`}
                                >
                                  <SelectItem
                                    className={`cursor-pointer ${
                                      theme === "dark"
                                        ? "text-gray-200 hover:bg-gray-700"
                                        : "hover:bg-gray-100"
                                    }`}
                                    value="COMUM"
                                  >
                                    Usuário Comum
                                  </SelectItem>
                                  <SelectItem
                                    className={`cursor-pointer ${
                                      theme === "dark"
                                        ? "text-gray-200 hover:bg-gray-700"
                                        : "hover:bg-gray-100"
                                    }`}
                                    value="AVALIADOR"
                                  >
                                    Avaliador
                                  </SelectItem>
                                  <SelectItem
                                    className={`cursor-pointer ${
                                      theme === "dark"
                                        ? "text-gray-200 hover:bg-gray-700"
                                        : "hover:bg-gray-100"
                                    }`}
                                    value="GESTOR"
                                  >
                                    Gestor de Inovação
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              {/* 💡 FIM DAS ALTERAÇÕES NO SELECT */}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="default"
                                size="sm"
                                disabled={user.id === colab.id}
                                className={`text-white bg-red-600 cursor-pointer hover:bg-red-700 ...`}
                              >
                                Remover
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* Tabela de Pendentes */}
              <TabsContent value="pending" className="mt-6">
                {isLoading ? (
                  <p className="text-center text-gray-500">Carregando...</p>
                ) : pendingInvites.length === 0 ? (
                  <p className="text-center text-gray-500">
                    Nenhum convite pendente.
                  </p>
                ) : (
                  <div
                    className={`${
                      theme === "dark" ? "text-white" : "text-black"
                    } overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700`}
                  >
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Função</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingInvites.map((invite) => (
                          <TableRow key={invite.id}>
                            <TableCell>{invite.email}</TableCell>
                            <TableCell>{getRoleLabel(invite.role)}</TableCell>
                            <TableCell>
                              {new Date(invite.createdAt).toLocaleDateString(
                                "pt-BR"
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                className="cursor-pointer flex items-center gap-1 text-sm px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md"
                                onClick={() => handleRemoveInvite(invite.id)}
                              >
                                <Trash2 size={14} /> Remover
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  </div>
  );
}
