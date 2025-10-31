"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  TrendingUp,
  Plus,
  Database,
  FileText,
  Users,
  Menu,
  Building2,
  Rocket,
  ClipboardCheck,
} from "lucide-react";
import { User } from "../app/context/UserContext";
import { useRouter, usePathname } from "next/navigation";

interface SidebarProps {
  user: User;
  theme: string;
}

export default function Sidebar({ user, theme }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // controle desktop
  const [mobileOpen, setMobileOpen] = useState(false); // apenas mobile
  const router = useRouter();
  const pathname = usePathname();

  // 🔧 Controla o comportamento inicial e em resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
        setMobileOpen(false);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path: string) => pathname === path;

  const getButtonClasses = (path: string) => `
    w-full justify-start hovers-exit-dash cursor-pointer
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
    <>
      {/* BOTÃO HAMBURGUER (mobile apenas) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => {
            setMobileOpen(true);
            setSidebarOpen(true);
          }}
          className={`bg-[#011677]/80 text-white rounded-full p-2 shadow-lg ${theme === "dark" ? "bg-gray-800/80" : ""}`}
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* OVERLAY ESCURO (mobile) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => {
            setMobileOpen(false);
            setSidebarOpen(false);
          }}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed md:static top-0 left-0 h-full flex flex-col justify-between shadow-md transition-all duration-300 z-50
          ${
            theme === "dark"
              ? "bg-gray-800 text-white"
              : "bg-[#011677] text-white"
          }
          ${
            mobileOpen
              ? "translate-x-0 w-64"
              : sidebarOpen
              ? "md:w-64 w-64"
              : "md:w-20 w-64 -translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Topo */}
        <div className="p-4 w-full flex flex-col">
          <div
            className={`flex items-center ${
              sidebarOpen ? "justify-center" : "justify-center"
            } gap-2 mb-8 w-full`}
          >
            <div className="w-8 h-8 rounded-lg flex items-center pt-4 justify-center">
              <Image
                alt="logo"
                src={"/img/icon-logo.png"}
                width={60}
                height={60}
              />
            </div>
            {sidebarOpen && <span className="font-semibold pt-4 text-2xl">CO.INOVA</span>}
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

            {(user.role === "GESTOR" ||
              user.role === "AVALIADOR" ||
              user.role === "COMUM") && (
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

            {user.role === "GESTOR" && (
              <Button
                variant="ghost"
                className={getButtonClasses("/reports")}
                onClick={() => router.push("/reports")}
              >
                <FileText className={`w-5 h-5 ${sidebarOpen ? "mr-2" : ""}`} />
                {sidebarOpen && "Relatórios"}
              </Button>
            )}

            {user.role === "ADMIN" && (
              <>
                <Button
                  variant="ghost"
                  className={getButtonClasses("/companies/new")}
                  onClick={() => router.push("/companies/new")}
                >
                  <Building2
                    className={`w-5 h-5 ${sidebarOpen ? "mr-2" : ""}`}
                  />
                  {sidebarOpen && "Cadastrar Empresa"}
                </Button>

                <Button
                  variant="ghost"
                  className={getButtonClasses("/startups/new")}
                  onClick={() => router.push("/startups/new")}
                >
                  <Rocket className={`w-5 h-5 ${sidebarOpen ? "mr-2" : ""}`} />
                  {sidebarOpen && "Cadastrar Startup"}
                </Button>
              </>
            )}

            {(user.role === "GESTOR" || user.role === "ADMIN") && (
              <Button
                variant="ghost"
                className={getButtonClasses("/collaborators")}
                onClick={() => router.push("/collaborators")}
              >
                <Users className={`w-5 h-5 ${sidebarOpen ? "mr-2" : ""}`} />
                {sidebarOpen && "Colaboradores"}
              </Button>
            )}

            {(user.role === "GESTOR" || user.role === "AVALIADOR") && (
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
        <div className="p-4 flex items-center justify-center w-full border-t border-white/10">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileOpen(false);
                setSidebarOpen(false);
              } else {
                setSidebarOpen((prev) => !prev);
              }
            }}
            className={`flex items-center justify-center gap-2 w-full hovers-exit-dash cursor-pointer ${
              theme === "dark" ? "hover:bg-gray-600" : "hover:bg-[#001a90]"
            }`}
          >
            {sidebarOpen && <span>Recolher</span>}
            <Menu className="w-5 h-5 mt-1" />
          </Button>
        </div>
      </div>
    </>
  );
}
