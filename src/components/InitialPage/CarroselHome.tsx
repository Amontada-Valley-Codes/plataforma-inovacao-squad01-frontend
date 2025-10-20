"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import CardList from "./CardList";
import React from "react";
import { cn } from "../ui/utils"; // garante compatibilidade de classes

interface CardItem {
  id: number;
  title: string;
  venc: string;
  empresa: string;
  area: string;
  img: string;
}

export default function CarroselHome() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const cards: CardItem[] = [
    {
      id: 1,
      title: "Desafio de Energia Sustentável",
      venc: "Buscar soluções para reduzir o consumo energético em ambientes corporativos utilizando IoT e análise de dados.",
      empresa: "Enel Brasil",
      area: "Energia e Sustentabilidade",
      img: "/img/desafio1.jpg",
    },
    {
      id: 2,
      title: "Saúde Digital Preventiva",
      venc: "Desenvolver tecnologias para monitoramento remoto de pacientes crônicos com uso de wearables.",
      empresa: "Hapvida NotreDame",
      area: "Saúde e Tecnologia",
      img: "/img/desafio2.png",
    },
    {
      id: 3,
      title: "Mobilidade Inteligente",
      venc: "Criar soluções de transporte urbano com foco em eficiência e redução de emissão de carbono.",
      empresa: "Volvo Cars Brasil",
      area: "Mobilidade e Cidades Inteligentes",
      img: "/img/desafio3.jpg",
    },
    {
      id: 4,
      title: "Agronegócio 4.0",
      venc: "Inovações para monitoramento de solo e cultivo utilizando inteligência artificial e sensores conectados.",
      empresa: "Ambev Agro",
      area: "Agronegócio e Tecnologia",
      img: "/img/desafio4.jpg",
    },
    {
      id: 5,
      title: "Inclusão Financeira",
      venc: "Soluções digitais para ampliar o acesso a serviços financeiros em comunidades desbancarizadas.",
      empresa: "Banco do Brasil",
      area: "Finanças e Impacto Social",
      img: "/img/desafio5.jpeg",
    },
    {
      id: 6,
      title: "Indústria 4.0",
      venc: "Automatização de linhas de produção com uso de robótica colaborativa e visão computacional.",
      empresa: "WEG",
      area: "Indústria e Automação",
      img: "/img/desafio6.jpg",
    },
    {
      id: 7,
      title: "Educação Personalizada",
      venc: "Plataformas que usem IA para adaptar o aprendizado às necessidades individuais de cada aluno.",
      empresa: "Google for Education",
      area: "Educação e Tecnologia",
      img: "/img/desafio7.webp",
    },
  ];

  const filteredCards = cards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.venc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else if (window.innerWidth < 1280) setVisibleCards(3);
      else setVisibleCards(5); // 👈 agora são 5 cards em telas grandes
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    if (currentIndex < filteredCards.length - visibleCards) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [searchTerm]);

  const showNavigation = filteredCards.length > visibleCards;

  return (
    <section className="relative bg-gradient-to-b from-[#011677] to-[#00134d] py-6 px-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div>
          <h2 className="md:text-3xl font-bold text-white text-center md:text-start text-2xl">Nossos Desafios</h2>
          <p className="text-gray-300 text-sm">
            Explore desafios em andamento na plataforma.
          </p>
        </div>

        {/* Campo de busca refinado */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-[#011677]" size={18} />
          <input
            type="text"
            placeholder="Buscar desafio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full bg-white/90 text-[#011677] placeholder:text-[#011677] text-sm outline-none focus:ring-2 focus:ring-[#011677] transition-all duration-200"
          />
        </div>
      </div>

      <hr className="border-gray-400/40 mb-6" />

      {/* Carrossel */}
      <div className="relative max-w-7xl mx-auto">
        {showNavigation ? (
          <>
            {/* Botão Prev */}
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="absolute left-[-10px] z-50 top-1/2 -translate-y-1/2 bg-white text-[#011677] p-3 rounded-full shadow-lg cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Área de rolagem */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                  width: `${(filteredCards.length / visibleCards) * 100}%`,
                }}
              >
                {filteredCards.map((item) => (
                  <div
                    key={item.id}
                    className="px-3"
                    style={{ width: `${100 / visibleCards}%` }}
                  >
                    <Card className="h-full flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-2 hover:scale-95">
                      <div className="relative w-full h-40">
                        <Image
                          src={item.img}
                          alt={item.title}
                          fill
                          className="object-cover rounded-t-2xl"
                        />
                      </div>
                      <CardHeader className="pb-1">
                        <CardTitle className="text-lg font-semibold text-[#011677]">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {item.empresa}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {item.venc}
                        </p>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between mt-auto">
                        <span className="text-[13px] text-gray-600 font-semibold">
                          {item.area}
                        </span>
                        <Link
                          href={`/desafios-publicos/${item.id}`}
                          className="bg-[#011677] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#0121af] transition-all duration-300"
                        >
                          Ver
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
              disabled={currentIndex >= filteredCards.length - visibleCards}
              className="absolute right-[-10]  top-1/2 -translate-y-1/2 bg-white cursor-pointer text-[#011677] p-3 rounded-full shadow-lg "
            >
              <ChevronRight size={22} />
            </button>
          </>
        ) : (
          <CardList cards={filteredCards} />
        )}
      </div>
    </section>
  );
}
