"use client";
import { useEffect, useState, useMemo } from "react";
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
import { Search } from "lucide-react"; 
import CardList from "./CardList"; 
import React from "react";
import api from "../../lib/api"; // Importando a instância da API
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination"; 
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
        console.log("Desafios públicos recebidos:", response);
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

      {/* Carrossel Container (Relative para os botões) */}
      <div className="relative max-w-7xl mx-auto">
        {filteredCards.length > 0 ? (
          <>
            <Swiper
              // Configuração para usar os botões customizados (agora irmãos do Swiper)
              navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
              }}
              modules={[Navigation, Pagination]}
              
              slidesPerView={1.2} 
              slidesPerGroup={1} 
              spaceBetween={24} 
              loop={false} 
              
              breakpoints={{
                0: { slidesPerView: 1.2, }, 
                640: { slidesPerView: 2.2, }, 
                1024: { slidesPerView: 3.2, }, 
                1280: { slidesPerView: 4.2, }, 
              }}
              
              className="carrossel-home-swiper" 
            >
              {filteredCards.map((item) => (
                <SwiperSlide key={item.id} className="pb-4 h-full"> 
                  <div className="px-0 h-full"> 
                    <Card className="h-full flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-2">
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
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* *** BOTÕES DE NAVEGAÇÃO CUSTOMIZADOS *** (FORA do Swiper) */}
            
            {/* Botão Prev */}
            <div className="swiper-button-prev-custom absolute left-[-10px] z-50 top-1/2 -translate-y-1/2 bg-white text-[#011677] p-3 rounded-full shadow-lg cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </div>

            {/* Botão Next */}
            <div className="swiper-button-next-custom absolute right-[-10px] z-50 top-1/2 -translate-y-1/2 bg-white cursor-pointer text-[#011677] p-3 rounded-full shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </>
        ) : (
          <CardList cards={filteredCards} />
        )}
      </div>
      
      {/* *** CSS GLOBAL ESSENCIAL COM CORREÇÃO *** */}
      <style jsx global>{`
        /* Importante: Adiciona classes para o contexto de navegação. */
        .relative.max-w-7xl.mx-auto {
            /* Garante que o Swiper procure os botões no container pai */
            --swiper-navigation-top-offset: 50%;
            --swiper-navigation-sides-offset: 0;
        }

        /* Garante que os botões fiquem centrados e o clique funcione */
        .swiper-button-prev-custom, .swiper-button-next-custom {
            /* top e transform gerenciados pelo Tailwind (top-1/2 -translate-y-1/2) */
            transition: opacity 0.3s;
            pointer-events: auto; 
            z-index: 50; /* Reforça o z-index no CSS para ter prioridade */
        }
        
        /* Aplica o estilo de desabilitado quando o Swiper adiciona a classe .swiper-button-disabled */
        .swiper-button-prev-custom.swiper-button-disabled,
        .swiper-button-next-custom.swiper-button-disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }

        /* Oculta os botões padrão do Swiper */
        .swiper-button-next, .swiper-button-prev {
            display: none !important;
        }
        
        /* Garante que o container do SwiperSlide tenha altura mínima para que os h-full funcionem */
        .swiper-slide {
            height: auto !important;
            /* Opcional: Adiciona espaço no final para evitar que o último card fique "colado" na borda */
            padding-bottom: 24px; 
        }
      `}</style>
    </section>
  );
}