import turboKit from "@/assets/turbo-kit.jpg";
import carburadorWeber from "@/assets/carburador-weber.jpg";
import volanteEsportivo from "@/assets/volante-esportivo.jpg";
import escapeOpala from "@/assets/escape-opala.jpg";

export interface Seller {
  id: string;
  name: string;
  location: string;
  rating: number;
  sales: number;
  isPro: boolean;
  description: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  sellerId: string;
  isPro: boolean;
  category: string;
  compatibility: string[];
  carFilter: string[];
  status?: "normal" | "patrocinado";
  views?: number;
  favCount?: number;
  clicks?: number;
  delivery?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "seller";
  time: string;
}

export interface ChatThread {
  id: string;
  sellerId: string;
  productId: string;
  messages: Message[];
  lastMessage: string;
  lastTime: string;
}

export const sellers: Seller[] = [
  {
    id: "s1",
    name: "Auto Performance RS",
    location: "Porto Alegre, RS",
    rating: 5.0,
    sales: 234,
    isPro: true,
    description: "Especialistas em turbo e performance para carros clássicos e modernos. Mais de 10 anos no mercado.",
  },
  {
    id: "s2",
    name: "Clássicos Garage",
    location: "São Paulo, SP",
    rating: 4.5,
    sales: 128,
    isPro: true,
    description: "Peças originais e restauração de carros clássicos brasileiros. Fusca, Opala, Maverick e mais.",
  },
];

export const products: Product[] = [
  {
    id: "p1",
    title: "Kit Turbo T3/T4",
    price: 3500,
    description: "Kit turbo completo T3/T4 com intercooler, tubulações em alumínio, mangueiras de silicone e todos os componentes necessários para instalação. Produto novo com garantia de 6 meses.",
    image: turboKit,
    sellerId: "s1",
    isPro: true,
    category: "Turbo",
    compatibility: ["Opala 4cc", "Opala 6cc", "Chevette"],
    carFilter: ["Opala", "Universal"],
    status: "patrocinado",
    views: 342,
    favCount: 28,
    clicks: 89,
    delivery: "Frete: R$ 45 • Retirada local",
  },
  {
    id: "p2",
    title: "Carburador Weber Fusca",
    price: 900,
    description: "Carburador Weber 40 IDFM para Fusca. Peça restaurada em excelente estado, pronta para uso.",
    image: carburadorWeber,
    sellerId: "s2",
    isPro: false,
    category: "Carburação",
    compatibility: ["Fusca 1300", "Fusca 1500", "Fusca 1600"],
    carFilter: ["Fusca"],
    status: "normal",
    views: 187,
    favCount: 12,
    clicks: 45,
    delivery: "Retirada local",
  },
  {
    id: "p3",
    title: "Volante Esportivo Opala",
    price: 450,
    description: "Volante esportivo em couro legítimo com cubo para Opala/Caravan. Acabamento premium com costura vermelha.",
    image: volanteEsportivo,
    sellerId: "s2",
    isPro: true,
    category: "Interior",
    compatibility: ["Opala", "Caravan", "Diplomata"],
    carFilter: ["Opala"],
    status: "patrocinado",
    views: 256,
    favCount: 19,
    clicks: 67,
    delivery: "Frete: R$ 25 • Retirada local",
  },
  {
    id: "p4",
    title: "Escape 6x2 Opala",
    price: 1800,
    description: "Sistema de escapamento 6x2 em aço inox para Opala 6 cilindros. Aumenta performance e proporciona ronco esportivo.",
    image: escapeOpala,
    sellerId: "s1",
    isPro: true,
    category: "Escapamento",
    compatibility: ["Opala 6cc", "Caravan 6cc"],
    carFilter: ["Opala"],
    status: "normal",
    views: 198,
    favCount: 15,
    clicks: 52,
    delivery: "Frete: R$ 60",
  },
];

export const chatThreads: ChatThread[] = [
  {
    id: "c1",
    sellerId: "s1",
    productId: "p1",
    lastMessage: "Pode sim! Faço um desconto especial.",
    lastTime: "14:32",
    messages: [
      { id: "m1", text: "Opa, boa tarde! O Kit Turbo ainda está disponível?", sender: "user", time: "14:20" },
      { id: "m2", text: "Fala, irmão! Tá sim, pronta entrega aqui na loja.", sender: "seller", time: "14:22" },
      { id: "m3", text: "Massa! Faz entrega pra fora do RS?", sender: "user", time: "14:25" },
      { id: "m4", text: "Faço sim, via transportadora. Chega em 3-5 dias úteis.", sender: "seller", time: "14:27" },
      { id: "m5", text: "Show! Consegue fazer um preço melhor no PIX?", sender: "user", time: "14:30" },
      { id: "m6", text: "Pode sim! Faço um desconto especial.", sender: "seller", time: "14:32" },
    ],
  },
  {
    id: "c2",
    sellerId: "s2",
    productId: "p2",
    lastMessage: "Perfeito, vou separar pra você!",
    lastTime: "Ontem",
    messages: [
      { id: "m7", text: "Olá! O carburador serve no Fusca 1600?", sender: "user", time: "10:15" },
      { id: "m8", text: "Serve sim! Weber 40 encaixa direto no 1600.", sender: "seller", time: "10:18" },
      { id: "m9", text: "Ótimo, quero comprar. Aceita PIX?", sender: "user", time: "10:22" },
      { id: "m10", text: "Perfeito, vou separar pra você!", sender: "seller", time: "10:25" },
    ],
  },
];

export const carFilters = ["Todos", "Fusca", "Opala", "Gol GTI", "JDM", "Muscle", "Europeus", "Clássicos BR", "Universal"];

export const currentUser = {
  id: "u1",
  name: "Renan Schmitt",
  location: "RS - Brasil",
  rating: 4.8,
  sales: 47,
  isPro: true,
  description: "Entusiasta automotivo apaixonado por carros clássicos e performance.",
};
