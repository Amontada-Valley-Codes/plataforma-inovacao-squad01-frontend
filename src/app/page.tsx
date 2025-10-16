"use client";

import Image from "next/image";
import Link from "next/link";
import CarroselHome from "../components/InitialPage/CarroselHome";
import Contact from "../components/InitialPage/Contact";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";

export default function InitialPage() {

  const  [navmobile, setNavMobile] = useState(false)

  return (
    <div id="Inicio" className="bg-white min-h-screen flex flex-col">
      {/* 🔹 Navbar */}
      <nav className=" flex z-30  justify-between absolute h-[10vh] p-2 items-center w-full">
        <Image
          src="/img/logo2.png"
          alt="Ninna-Logo"
          height={40}
          width={80}
          className="ml-2.5 md:ml-7"
        />
        <ul className="md:flex items-center hidden mr-7 text-[#011677] space-x-10 text-[21px]">
          <li>
            <Link className="hover:bg-gray-300 hovers-exit-dash rounded p-1 font-semibold" href="#Inicio">
              Inicio
            </Link>
          </li>
          <li>
            <Link className="hover:bg-gray-300 hovers-exit-dash rounded p-1 font-semibold" href="#Desafios">
              Desafios
            </Link>
          </li>
          <li>
            <Link className="hover:bg-gray-300 hovers-exit-dash rounded p-1 font-semibold" href="#Contato">
              Contato
            </Link>
          </li>
          <li className="py-1 px-6 cursor-pointer bg-[#011677] hover:bg-[#0121af] text-white font-semibold rounded">
            <Link href="/login">Login</Link>
          </li>
        </ul>
        {/* Mobile */}

        <button className="md:hidden mr-2.5 text-[#011677] text-3xl" onClick={()=>setNavMobile(!navmobile)}><FiMenu /></button>
      </nav>
        <ul className={`${navmobile ? 'flex' : 'hidden'} flex-col z-50 absolute top-[10vh] right-0 items-center md:hidden mr-7 bg-white rounded-2xl text-[#011677] text-[18px] px-6 py-2.5 space-y-3`}>
            <li>
              <Link className="hovers-exit-dash rounded p-1 font-semibold" href="#Inicio">
                Inicio
              </Link>
            </li>
            <li>
              <Link className="hovers-exit-dash rounded p-1 font-semibold" href="#Desafios">
                Desafios
              </Link>
            </li>
            <li>
              <Link className="hovers-exit-dash rounded p-1 font-semibold" href="#Contato">
                Contato
              </Link>
            </li>
            <li className="py-1 px-3 cursor-pointer bg-[#011677] hover:bg-[#0121af] text-white font-semibold rounded">
              <Link href="/login">Login</Link>
            </li>
          </ul>

      <main>
        {/* 🔹 Hero Section */}
        <section className="flex flex-col md:justify-end md:items-start justify-center items-center relative bg-[url('/img/fundo-inicio.jpg')] bg-center bg-cover  flex-1 md:text-start text-center h-screen">
          <div className="z-20 mx-5 md:m-0 md:pl-[100px] md:pb-[150px]">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 md:w-10/12 mb-4">
              Provoque o <span className="text-[#011677]">Desafio,</span>{" "}
              Desperte a <span className="text-[#011677]">Inovação</span>
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Conectando startups e empresas para criar soluções
              transformadoras.
            </p>
            <Link
              href="/login"
              className="bg-[#011677] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0121af] transition"
            >
              Contato
            </Link>
          </div>
          <div className="bg-white/80 absolute top-0 left-0 right-0 bottom-0 z-10"></div>
        </section>

        {/* 🔹 Carrossel Section */}
        <div id="Desafios">
          <CarroselHome />
        </div>
        <div id="Contato">
          <Contact />
        </div>
      </main>
      <footer className="bg-[#011677] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-start">
            <img
              src="/img/logo1.svg"
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
                <a
                  href="#Desafios"
                  className="hover:underline transition-colors"
                >
                  Desafios
                </a>
              </li>
              <li>
                <a
                  href="#Contato"
                  className="hover:underline transition-colors"
                >
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="font-bold text-lg mb-4">Redes</h3>
            <div className="flex space-x-4 mt-6 text-2xl">
              <a
                href="#"
                className="p-1.5 rounded-2xl bg-white text-[#011677] transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="p-1.5 rounded-2xl bg-white text-[#011677] transition-colors"
              >
                <FaLinkedin />
              </a>
              <a
                href="#"
                className="p-1.5 rounded-2xl bg-white text-[#011677] transition-colors"
              >
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
