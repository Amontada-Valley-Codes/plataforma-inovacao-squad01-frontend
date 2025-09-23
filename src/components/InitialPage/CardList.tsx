import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import React from 'react';

interface CardItem {
  id: number;
  title: string;
  venc: string;
  empresa: string;
  area: string;
  img: string;
}

interface CardListProps {
  cards: CardItem[];
}

const CardList: React.FC<CardListProps> = ({ cards }) => {
  return (
    <div className="flex flex-wrap justify-start gap-4 mx-auto">
      {cards.map((item) => (
        <div key={item.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-3">
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
                href={`/desafios-publicos/${item.id}`}
                className="bg-[#011677] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#160430] transition"
              >
                Ver Detalhes
              </Link>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default CardList;