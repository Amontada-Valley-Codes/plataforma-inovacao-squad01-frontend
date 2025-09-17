import Image from "next/image";
import Link from "next/link";

export default function InitialPage() {
  return (
    <div className="bg-[#f9fafb] min-h-screen flex flex-col">
      {/* 🔹 Navbar */}
      <nav className="bg-[#011677] flex justify-between items-center w-full">
        <Image
          src="/img/Ninna_logo.png"
          alt="Ninna-Logo"
          height={80}
          width={80}
          className="ml-7"
        />
        <ul className="flex items-center mr-7 text-white space-x-10 text-[17px]">
          <li><Link className="hover:underline" href="/">Inicio</Link></li>
          <li><Link className="hover:underline" href="/desafios">Desafios</Link></li>
          <li><Link className="hover:underline" href="/contato">Contato</Link></li>
          <li className="py-1 px-6 cursor-pointer bg-[#5ff604] hover:bg-[#59df07] rounded">
            <Link href="/login">Login</Link>
          </li>
        </ul>
      </nav>

      {/* 🔹 Hero Section */}
      <main className="flex flex-col relative items-center flex-1 text-center px-6 py-12">
        <div className="mt-[50px] z-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Provoque o <span className="text-[#011677]">Desafio,</span> Desperte a{" "}
            <span className="text-[#011677]">Inovação</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Conectando startups e empresas para criar soluções transformadoras.
          </p>
          <Link
            href="/desafios"
            className="bg-[#011677] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#160430] transition"
          >
            Contato
          </Link>
        </div>

        {/* 🔹 Ilustração */}
        <div className="w-full absolute top-[140px]">
          <Image
            src="/img/startups-empresas.png"
            alt="Conexão Startups com Empresas"
            width={1000}
            height={700}
            className="mx-auto"
          />
        </div>
      </main>
    </div>
  );
}
