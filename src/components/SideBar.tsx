"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  TrendingUp,
  Target,
  Plus,
  Database,
  FileText,
  Users,
  Menu,
  Building2,
} from "lucide-react";
import { User } from "../app/context/UserContext";
import { useRouter, usePathname } from "next/navigation";
import { ClipboardCheck } from "lucide-react";
interface SidebarProps {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Função auxiliar para saber se rota é a atual
  const isActive = (path: string) => pathname === path;

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-16"
      } transition-all duration-300 bg-[#011677] text-white bg-card shadow-md flex flex-col justify-between`}
    >
      {/* Topo da sidebar */}
      <div className="p-4 w-full flex flex-col">
        <div className="flex items-center gap-2 mb-8 w-full">
          <div className="w-8 h-8 bg-[#160430] rounded-lg flex items-center justify-center">
            <Image alt="logo" src="/img/logo.png" width={60} height={60} />
          </div>
          {sidebarOpen && (
            <span className="font-semibold">Plataforma de Inovação</span>
          )}
        </div>

        {/* Menu */}
        <nav className="space-y-2 w-full">
          <Button
            variant="secondary"
            className={`w-full justify-start hovers-exit-dash ${
              isActive("/dashboard") ? "bg-[#001a90] active-exit-dash" : ""
            } ${sidebarOpen ? "justify-start" : "justify-center"}`}
            onClick={() => router.push("/dashboard")}
          >
            <TrendingUp className={`w-5 h-5 ${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Dashboard"}
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start hovers-exit-dash ${
              isActive("/funnel") ? "bg-[#001a90] active-exit-dash" : ""
            } ${sidebarOpen ? "justify-start" : "justify-center"}`}
            onClick={() => router.push("/funnel")}
          >
            <Target className={`w-5 h-5 ${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Funil de Inovação"}
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start hovers-exit-dash ${
              isActive("/challenges/new") ? "bg-[#001a90] active-exit-dash" : ""
            } ${sidebarOpen ? "justify-start" : "justify-center"}`}
            onClick={() => router.push("/challenges/new")}
          >
            <Plus className={`w-5 h-5 ${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Desafios"}
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start hovers-exit-dash ${
              isActive("/startups") ? "bg-[#001a90] active-exit-dash" : ""
            } ${sidebarOpen ? "justify-start" : "justify-center"}`}
            onClick={() => router.push("/startups")}
          >
            <Database className={`w-5 h-5 ${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Base de Startups"}
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start hovers-exit-dash ${
              isActive("/reports") ? "bg-[#001a90] active-exit-dash" : ""
            } ${sidebarOpen ? "justify-start" : "justify-center"}`}
            onClick={() => router.push("/reports")}
          >
            <FileText className={`w-5 h-5 ${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Relatórios"}
          </Button>

          {user.role === "admin" && (
            <Button
              variant="ghost"
              className={`w-full justify-start hovers-exit-dash ${
                isActive("/companies/new")
                  ? "bg-[#001a90] active-exit-dash"
                  : ""
              } ${sidebarOpen ? "justify-start" : "justify-center"}`}
              onClick={() => router.push("/companies/new")}
            >
              <Building2 className={`w-5 h-5 ${sidebarOpen ? "mr-2" : ""}`} />
              {sidebarOpen && "Cadastrar Empresa"}
            </Button>
          )}

          {(user.role === "gestor" || user.role === "admin") && (
            <Button
              variant="ghost"
              className={`w-full justify-start hovers-exit-dash ${
                isActive("/collaborators")
                  ? "bg-[#001a90] active-exit-dash"
                  : ""
              } ${sidebarOpen ? "justify-start" : "justify-center"}`}
              onClick={() => router.push("/collaborators")}
            >
              <Users className={`w-5 h-5 ${sidebarOpen ? "mr-2" : ""}`} />
              {sidebarOpen && "Colaboradores"}
            </Button>
          )}

          {(user.role === "gestor" ||
            user.role === "avaliador" ||
            user.role === "admin") && (
            <Button
              variant="ghost"
              className={`w-full hovers-exit-dash ${
                isActive("/committee-review")
                  ? "bg-[#001a90] active-exit-dash"
                  : ""
              } ${sidebarOpen ? "justify-start" : "justify-center"}`}
              onClick={() => router.push("/committee-review")}
            >
              <ClipboardCheck
                className={`w-5 h-5 ${sidebarOpen ? "mr-2" : ""}`}
              />
              {sidebarOpen && "Revisão do Comitê"}
            </Button>
          )}
        </nav>
      </div>

      {/* Rodapé com botão toggle */}
      <div className="p-4 flex items-center justify-center w-full">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center justify-center gap-2 w-full hovers-exit-dash"
        >
          {sidebarOpen && <span>Recolher</span>}
          <Menu className="w-5 h-5 mt-1" />
        </Button>
      </div>
    </div>
  );
}
