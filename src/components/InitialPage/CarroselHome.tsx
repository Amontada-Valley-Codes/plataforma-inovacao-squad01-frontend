"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarroselHome() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);

  const cards = [
    { id: 1, title: "Desafio 1", venc: "Resumo do desafio 1", empresa: "Empresa", area: "Área", img: "/img/startups-empresas.png" },
    { id: 2, title: "Desafio 2", venc: "Resumo do desafio 2", empresa: "Empresa", area: "Área", img: "/img/startups-empresas.png" },
    { id: 3, title: "Desafio 3", venc: "Resumo do desafio 3", empresa: "Empresa", area: "Área", img: "/img/startups-empresas.png" },
    { id: 4, title: "Desafio 4", venc: "Resumo do desafio 4", empresa: "Empresa", area: "Área", img: "/img/startups-empresas.png" },
    { id: 5, title: "Desafio 5", venc: "Resumo do desafio 5", empresa: "Empresa", area: "Área", img: "/img/startups-empresas.png" },
    { id: 6, title: "Desafio 6", venc: "Resumo do desafio 6", empresa: "Empresa", area: "Área", img: "/img/startups-empresas.png" },
    { id: 7, title: "Desafio 7", venc: "Resumo do desafio 7", empresa: "Empresa", area: "Área", img: "/img/startups-empresas.png" },
  ];

  // 🔹 Responsividade para definir quantos cards aparecem
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else if (window.innerWidth < 1280) {
        setVisibleCards(3);
      } else {
        setVisibleCards(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    if (currentIndex < cards.length - visibleCards) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <section className="relative bg-[#011677] py-2.5 pb-6 px-6 h-1/2">
      <div className=" flex justify-between items-center mb-1.5">
        <div>
          <h2 className="text-2xl font-bold text-white">Nossos Desafios</h2>
          <p className="text-gray-200">Desafios em andamento na plataforma.</p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Buscar..."
            className="rounded-2xl bg-white py-1.5 pl-4 text-[16px] placeholder:text-[#011677] placeholder:text-[16px] outline-[#011677] text-[#011677]"
          />
        </div>
      </div>
      <hr className="mb-5 text-gray-200"/>

      <div className="relative max-w-6xl mx-auto">
        {/* Botão Prev */}
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="absolute left-[-45px] top-1/2 -translate-y-1/2 bg-white text-[#011677] p-3 rounded-full shadow-md disabled:opacity-40"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Carrossel */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
              width: `${(cards.length / visibleCards) * 100}%`,
            }}
          >
            {cards.map((item) => (
              <div key={item.id} className="px-3" style={{ width: `${100 / visibleCards}%` }}>
                <Card className="h-full flex flex-col gap-2">
                  <div className="relative w-full h-40">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-cover rounded-t-xl"
                    />
                  </div>

                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.empresa}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-gray-600">{item.venc}</p>
                  </CardContent>

                  <CardContent>
                    <p className="text-sm px-1 py-0.5 w-fit text-[14px] font-semibold text-gray-600">
                      {item.area}
                    </p>
                  </CardContent>

                  <CardFooter>
                    <Link
                      href={`/desafios/${item.id}`}
                      className="bg-[#011677] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#160430] transition"
                    >
                      Ver Detalhes
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Botão Next */}
        <button
          onClick={nextSlide}
          disabled={currentIndex >= cards.length - visibleCards}
          className="absolute right-[-40px] top-1/2 -translate-y-1/2 bg-white text-[#011677] p-3 rounded-full shadow-md disabled:opacity-40"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
