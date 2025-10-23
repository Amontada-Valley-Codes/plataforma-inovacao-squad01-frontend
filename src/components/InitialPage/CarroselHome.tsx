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
import { Search } from "lucide-react";
import CardList from "./CardList";
import React from "react";
import api from "../../lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ca } from "date-fns/locale";

// Interface para o formato dos dados recebidos da API
interface Challenge {
  id: string;
  name: string;
  description: string;
  company: { name: string };
  area: string;
  images: string[];
}

// Interface para a resposta paginada da API
interface PaginatedResponse {
    data: Challenge[];
    total: number;
}

// Interface para o formato esperado pelo card
interface CardItem {
  id: string;
  title: string;
  venc: string;
  empresa: string;
  area: string;
  img: string;
  category: string;
}

// 💡 NOVA FUNÇÃO PARA SELECIONAR IMAGEM PELA ÁREA
const getImageForArea = (area: string): string => {
  const areaNormalizada = area.toLowerCase();
  if (areaNormalizada.includes('ambiente') || areaNormalizada.includes('sustentabilidade')) {
    return '/img/desafio1.jpg'; // Imagem de energia sustentável
  }
  if (areaNormalizada.includes('automação')) {
    return '/img/desafio6.jpg'; // Imagem de indústria 4.0
  }
  if (areaNormalizada.includes('finanças')) {
    return '/img/desafio5.jpeg'; // Imagem de finanças
  }
  if (areaNormalizada.includes('educação')) {
    return '/img/desafio7.webp'; // Imagem de educação
  }
  // Imagem padrão para outras áreas ou se não houver correspondência
  return '/img/desafio4.jpg';
};


export default function CarroselHome() {
  const [challenges, setChallenges] = useState<CardItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicChallenges = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<PaginatedResponse>('/challenges/findByPublic');
// 💡 INÍCIO DA CORREÇÃO
        // Determina se a resposta é paginada ({data: [...]}) ou um array direto ([...])
        const challengesArray = Array.isArray(response.data) 
          ? response.data 
          : response.data.data;

        console.log("Desafios públicos recebidos da API:", challengesArray);
        if (Array.isArray(challengesArray)) {
            const formattedChallenges = challengesArray.map(challenge => ({
                id: challenge.id,
                title: challenge.name,
                venc: challenge.description,
                empresa: challenge.company?.name || 'Empresa não informada',
                area: challenge.area,
                category: challenge.categoria,
                img: getImageForArea(challenge.area),
            }));
            setChallenges(formattedChallenges);
        } else {
            console.error("A resposta da API não é um formato esperado (nem array, nem objeto com 'data'):", response.data);
            setChallenges([]);
        }
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
      card.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                          {item.category}
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

            <div className="swiper-button-prev-custom absolute left-[-10px] z-50 top-1/2 -translate-y-1/2 bg-white text-[#011677] p-3 rounded-full shadow-lg cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </div>

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

      <style jsx global>{`
        .relative.max-w-7xl.mx-auto {
          --swiper-navigation-top-offset: 50%;
          --swiper-navigation-sides-offset: 0;
        }

        .swiper-button-prev-custom, .swiper-button-next-custom {
          transition: opacity 0.3s;
          pointer-events: auto;
          z-index: 50;
        }

        .swiper-button-prev-custom.swiper-button-disabled,
        .swiper-button-next-custom.swiper-button-disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .swiper-button-next, .swiper-button-prev {
          display: none !important;
        }

        .swiper-slide {
          height: auto !important;
          padding-bottom: 24px;
        }
      `}</style>
    </section>
  );
}