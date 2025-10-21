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
import api from "../../lib/api"; // Importando a instância da API

// Interface para o formato dos dados recebidos da API
interface Challenge {
  id: string;
  name: string;
  description: string;
  company: { name: string };
  area: string;
  images: string[];
}

// Interface para o formato esperado pelo card
interface CardItem {
  id: string;
  title: string;
  venc: string;
  empresa: string;
  area: string;
  img: string;
}

export default function CarroselHome() {
  const [challenges, setChallenges] = useState<CardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicChallenges = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<Challenge[]>('/challenges/findByPublic');
        const formattedChallenges = response.data.map(challenge => ({
          id: challenge.id,
          title: challenge.name,
          venc: challenge.description,
          empresa: challenge.company?.name || 'Empresa não informada',
          area: challenge.area,
          img: challenge.images?.[0] || '/img/desafio_default.png' // Usa a primeira imagem ou uma padrão
        }));
        setChallenges(formattedChallenges);
      } catch (error) {
        console.error("Erro ao buscar desafios públicos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicChallenges();
  }, []);


  const filteredCards = challenges.filter(
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
      else setVisibleCards(5);
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
  
  if (isLoading) {
    return (
        <section className="relative bg-gradient-to-b from-[#011677] to-[#00134d] py-6 px-8 text-white text-center">
            <h2 className="md:text-3xl font-bold text-2xl">Carregando Desafios...</h2>
        </section>
    );
  }

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