"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CardList from "./CardList";
import React from "react";

interface CardItem {
  id: number;
  title: string;
  venc: string;
  empresa: string;
  area: string;
  img: string;
}

export default function CarroselHome() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [visibleCards, setVisibleCards] = useState<number>(4);
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  const filteredCards = cards.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.venc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <section className="relative bg-[#011677] py-2.5 pb-6 px-6 h-1/2">
      <div className="flex justify-between items-center mb-1.5">
        <div>
          <h2 className="text-2xl font-bold text-white">Nossos Desafios</h2>
          <p className="text-gray-200">Desafios em andamento na plataforma.</p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-2xl bg-white py-1.5 pl-4 text-[16px] placeholder:text-[#011677] placeholder:text-[16px] outline-[#011677] text-[#011677]"
          />
        </div>
      </div>
      <hr className="mb-5 text-gray-200" />

      <div className="relative max-w-6xl mx-auto">
        {/* Renderização condicional: Carrossel ou Lista Estática */}
        {showNavigation ? (
          <>
            {/* Botão Prev */}
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="absolute cursor-pointer left-[-50px] top-1/2 -translate-y-1/2 bg-white text-[#011677] p-3 rounded-full shadow-md disabled:opacity-40"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Carrossel */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                  width: `${(filteredCards.length / visibleCards) * 100}%`,
                }}
              >
                {filteredCards.map((item) => (
                  <div key={item.id} className="px-3" style={{ width: `${100 / visibleCards}%` }}>
                    <Card className="h-full flex flex-col gap-2 transition-transform duration-300 hover:scale-105">
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
                          href={`/desafios-publicos/${item.id}`}
                          className="bg-[#011677] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0121af] transition"
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
              disabled={currentIndex >= filteredCards.length - visibleCards}
              className="absolute cursor-pointer right-[-50px] top-1/2 -translate-y-1/2 bg-white text-[#011677] p-3 rounded-full shadow-md disabled:opacity-40"
            >
              <ChevronRight size={20} />
            </button>
          </>
        ) : (
          /* Renderiza a lista estática SE não houver cards o suficiente */
          <CardList cards={filteredCards} />
        )}
      </div>
    </section>
  );
}