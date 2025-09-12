'use client'

import Image from "next/image"
import { useState } from "react"
import { Button } from "./ui/button"
import {
  TrendingUp,
  Target,
  Plus,
  Database,
  FileText,
  Users,
  Menu,
} from "lucide-react"
import { User } from "../app/context/UserContext"
import { useRouter } from "next/navigation"

interface SidebarProps {
  user: User
}

export function Sidebar({ user }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-16"
      } transition-all duration-300 bg-[#011677] text-white bg-card shadow-md flex flex-col justify-between`}
    >
      {/* Topo da sidebar */}
      <div className="p-4 w-full  flex flex-col">
        <div className="flex items-center gap-2 mb-8 w-full">
          <div className="w-8 h-8 bg-[#160430] rounded-lg flex items-center justify-center">
            <Image
              alt="logo"
              src="/img/Ninna_logo.png"
              width={60}
              height={60}
            />
          </div>
          {sidebarOpen && (
            <span className="font-semibold">InnovatePlatform</span>
          )}
        </div>

        {/* Menu */}
        <nav className="space-y-2 w-full">
          <Button
            variant="secondary"
            className="w-full justify-start cursor-pointer hover:bg-[#001a90]"
            onClick={() => router.push("/dashboard")}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            {sidebarOpen && "Dashboard"}
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start cursor-pointer hover:bg-[#001a90]"
            onClick={() => router.push("/funnel")}
          >
            <Target className="w-4 h-4 mr-2" />
            {sidebarOpen && "Funil de Inovação"}
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start cursor-pointer hover:bg-[#001a90]"
            onClick={() => router.push("/challenges/new")}
          >
            <Plus className="w-4 h-4 mr-2 " />
            {sidebarOpen && "Desafios"}
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start cursor-pointer hover:bg-[#001a90]"
            onClick={() => router.push("/startups")}
          >
            <Database className="w-4 h-4 mr-2" />
            {sidebarOpen && "Base de Startups"}
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start cursor-pointer hover:bg-[#001a90]"
            onClick={() => router.push("/reports")}
          >
            <FileText className="w-4 h-4 mr-2" />
            {sidebarOpen && "Relatórios"}
          </Button>

          {user.role === "gestor" && (
            <Button
              variant="ghost"
              className="w-full justify-start cursor-pointer hover:bg-[#001a90]"
              onClick={() => router.push("/collaborators")}
            >
              <Users className="w-4 h-4 mr-2" />
              {sidebarOpen && "Colaboradores"}
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
          className="flex items-center justify-center gap-2 w-full cursor-pointer hover:bg-[#001a90]"
        >
          {sidebarOpen && <span>Recolher</span>}
          <Menu className="w-5 h-5 mt-1" />
        </Button>
      </div>
    </div>
  )
}
