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
  ClipboardCheck,
} from "lucide-react";
import { User } from "../app/context/UserContext";
import { useRouter, usePathname } from "next/navigation";

interface SidebarProps {
  user: User;
  theme: string;
}

export function Sidebar({ user, theme }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  // 🔧 Helper para gerar classes com base no tema e estado ativo
  const getButtonClasses = (path: string) => `
    w-full justify-start hovers-exit-dash
    ${
      isActive(path)
        ? theme === "dark"
          ? "bg-gray-600 active-exit-dash"
          : "bg-[#001a90] active-exit-dash"
        : ""
    }
    ${sidebarOpen ? "justify-start" : "justify-center"}
    ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-[#001a90]"}
  `;

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-16"
      } transition-all duration-300 bg-card shadow-md flex flex-col justify-between ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-[#011677] text-white"
      }`}
    >
      {/* Topo da sidebar */}
      <div className="p-4 w-full flex flex-col">
        <div className="flex items-center justify-center gap-2 mb-8 w-full">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <Image alt="logo" src="/img/icon-logo.png" width={60} height={60} />
          </div>
          {sidebarOpen && <span className="font-semibold">CO.INOVA</span>}
        </div>

        {/* Menu */}
        <nav className="space-y-2 w-full">
          <Button
            variant="secondary"
            className={getButtonClasses("/dashboard")}
            onClick={() => router.push("/dashboard")}
          >
            <TrendingUp className={`w-5 h-5 ${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Dashboard"}
          </Button>

          {(user.role === "gestor" ||
            user.role === "avaliador" ||
            user.role === "comum") && (
            <Button
              variant="ghost"
              className={getButtonClasses("/challenges/new")}
              onClick={() => router.push("/challenges/new")}
            >
              <Plus className={`w-5 h-5 ${sidebarOpen ? "mr-2" : ""}`} />
              {sidebarOpen && "Desafios"}
            </Button>
          )}

          <Button
            variant="ghost"
            className={getButtonClasses("/startups")}
            onClick={() => router.push("/startups")}
          >
            <Database className={`w-5 h-5 ${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Base de Startups"}
          </Button>

          {user.role === "gestor" && (
            <Button
              variant="ghost"
              className={getButtonClasses("/reports")}
              onClick={() => router.push("/reports")}
            >
              <FileText className={`w-5 h-5 ${sidebarOpen ? "mr-2" : ""}`} />
              {sidebarOpen && "Relatórios"}
            </Button>
          )}

          {user.role === "admin" && (
            <Button
              variant="ghost"
              className={getButtonClasses("/companies/new")}
              onClick={() => router.push("/companies/new")}
            >
              <Building2 className={`w-5 h-5 ${sidebarOpen ? "mr-2" : ""}`} />
              {sidebarOpen && "Cadastrar Empresa"}
            </Button>
          )}

          {(user.role === "gestor" || user.role === "admin") && (
            <Button
              variant="ghost"
              className={getButtonClasses("/collaborators")}
              onClick={() => router.push("/collaborators")}
            >
              <Users className={`w-5 h-5 ${sidebarOpen ? "mr-2" : ""}`} />
              {sidebarOpen && "Colaboradores"}
            </Button>
          )}

          {(user.role === "gestor" || user.role === "avaliador") && (
            <Button
              variant="ghost"
              className={getButtonClasses("/committee-review")}
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

      {/* Rodapé */}
      <div className="p-4 flex items-center justify-center w-full">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`flex items-center justify-center gap-2 w-full hovers-exit-dash ${
            theme === "dark" ? "hover:bg-gray-600" : "hover:bg-[#001a90]"
          }`}
        >
          {sidebarOpen && <span>Recolher</span>}
          <Menu className="w-5 h-5 mt-1" />
        </Button>
      </div>
    </div>
  );
}
