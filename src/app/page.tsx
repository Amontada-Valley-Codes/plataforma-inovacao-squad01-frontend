"use client";

import Image from "next/image";
import Link from "next/link";
import CarroselHome from "../components/InitialPage/CarroselHome";
import Contact from "../components/InitialPage/Contact";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";


export default function InitialPage() {
  return (
    <div id="Inicio" className="bg-white min-h-screen flex flex-col">
      {/* 🔹 Navbar */}
      <nav className="bg-[#011677] flex justify-between p-2 items-center w-full">
        <Image
          src="/img/logo.png"
          alt="Ninna-Logo"
          height={80}
          width={120}
          className="ml-7"
        />
        <ul className="flex items-center mr-7 text-white space-x-10 text-[17px]">
          <li><Link className="hovers-exit-dash rounded p-1" href="#Inicio">Inicio</Link></li>
          <li><Link className="hovers-exit-dash rounded p-1" href="#Desafios">Desafios</Link></li>
          <li><Link className="hovers-exit-dash rounded p-1" href="#Contato">Contato</Link></li>
          <li className="py-1 px-6 cursor-pointer bg-white hover:bg-[#eae8e8] text-[#011677] font-semibold rounded">
            <Link href="/login">Login</Link>
          </li>
        </ul>
      </nav>

      <main>
        {/* 🔹 Hero Section */}
        <section className="flex flex-col relative items-center flex-1 text-center h-screen px-6 py-12">
          <div className="mt-[50px] z-20">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Provoque o <span className="text-[#011677]">Desafio,</span> Desperte a{" "}
              <span className="text-[#011677]">Inovação</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Conectando startups e empresas para criar soluções transformadoras.
            </p>
            <Link
              href="/login"
              className="bg-[#011677] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0121af] transition"
            >
              Contato
            </Link>
          </div>

          {/* 🔹 Ilustração */}
          <div className="w-full absolute top-[150px]">
            <Image
              src="/img/startups-empresas.png"
              alt="Conexão Startups com Empresas"
              width={1000}
              height={700}
              className="mx-auto"
            />
          </div>
        </section>

        {/* 🔹 Carrossel Section */}
        <div id="Desafios">
          <CarroselHome/>
        </div>
        <div id="Contato">
          <Contact/>
        </div>
      </main>
      <footer className="bg-[#011677] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo e Descrição */}
        <div className="col-span-1 md:col-span-2 flex flex-col items-start">
          <img
            src="/img/logo.png"
            alt="Logo co.inova"
            width={80}
            height={80}
            className="mb-4"
          />
          <p className="text-sm text-gray-300 max-w-sm">
            Conectando empresas e startups para criar um futuro de inovação.
          </p>
        </div>

        {/* Links de Navegação */}
        <div>
          <h3 className="font-bold text-lg mb-4">Navegação</h3>
          <ul className="space-y-2">
            <li>
              <a href="#Inicio" className="hover:underline transition-colors">
                Início
              </a>
            </li>
            <li>
              <a href="#Desafios" className="hover:underline transition-colors">
                Desafios
              </a>
            </li>
            <li>
              <a href="#Contato" className="hover:underline transition-colors">
                Contato
              </a>
            </li>
          </ul>
        </div>

        {/* Redes Sociais */}
        <div>
          <h3 className="font-bold text-lg mb-4">Redes</h3>
          <div className="flex space-x-4 mt-6 text-2xl">
            <a href="#" className="p-1.5 rounded-2xl bg-white text-[#011677] transition-colors">
              <FaInstagram />
            </a>
            <a href="#" className="p-1.5 rounded-2xl bg-white text-[#011677] transition-colors">
              <FaLinkedin />
            </a>
            <a href="#" className="p-1.5 rounded-2xl bg-white text-[#011677] transition-colors">
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-6 border-t border-gray-400 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Ninna. Todos os direitos reservados.
      </div>
    </footer>
    </div>
  );
}
