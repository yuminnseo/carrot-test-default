import type { FilterDraft } from "../screens/Filtering/sections/FilterControlsSection/FilterControlsSection";

export type EstateCategory =
  | "원룸"
  | "빌라"
  | "오피스텔"
  | "아파트"
  | "상가"
  | "사무실"
  | "공장";

export type EstateItem = {
  id: string;
  category: EstateCategory;
  building: string;
  transactionType: "월세" | "전세" | "매매" | "단기";
  price: string;
  deposit: number;
  monthlyRent: number;
  salePrice: number;
  areaPyeong: number;
  area: string;
  floorLevel: number;
  totalFloors: number;
  floor: string;
  maintenance: string;
  station: string;
  neighborhood: string;
  comments: number;
  likes: number;
  rooms: number;
  baths: number;
  parking: boolean;
  direct: boolean;
  image?: string;
  description: string;
};

const imageByCategory: Record<EstateCategory, string[]> = {
  원룸: [
    "/estate-photos/room01.png",
    "/estate-photos/room06.png",
    "/estate-photos/room08.jpg",
    "/estate-photos/room09.png",
  ],
  빌라: [
    "/estate-photos/villa01.png",
    "/estate-photos/villa04.jpg",
    "/estate-photos/villa05.jpg",
    "/estate-photos/villa08.png",
  ],
  오피스텔: [
    "/estate-photos/villa01.png",
    "/estate-photos/villa04.jpg",
    "/estate-photos/villa05.jpg",
    "/estate-photos/villa08.png",
  ],
  아파트: [
    "/estate-photos/apartment01.png",
    "/estate-photos/apartment03.jpg",
    "/estate-photos/apartment06.jpg",
  ],
  상가: [
    "/estate-photos/office01.png",
    "/estate-photos/office03.jpg",
    "/estate-photos/office05.jpg",
    "/estate-photos/office06.jpg",
  ],
  사무실: [
    "/estate-photos/office01.png",
    "/estate-photos/office03.jpg",
    "/estate-photos/office05.jpg",
    "/estate-photos/office06.jpg",
  ],
  공장: [
    "/estate-photos/factory01.png",
    "/estate-photos/factory02.png",
    "/estate-photos/factory03.jpg",
  ],
};

export const getImagesForCategory = (category: EstateCategory) =>
  imageByCategory[category];

const neighborhoods = ["당근동", "단추동", "모란동", "하늘동", "새싹동"];
const stations = ["당근역 도보 5분", "단추역 도보 7분", "모란역 도보 3분", "하늘역 도보 9분"];
const buildings: Record<EstateCategory, string[]> = {
  원룸: ["그린 원룸", "라이트 스튜디오", "코지 하우스"],
  빌라: ["동진 빌라", "삼풍 빌라", "하우스 더 힐"],
  오피스텔: ["시티 오피스텔", "루프 스튜디오", "스테이 21"],
  아파트: ["한신 아파트", "센트럴 아파트", "리버파크"],
  상가: ["화이트 네일샵", "코너 상가", "역세권 상가"],
  사무실: ["브릭 오피스", "라운지 사무실", "테라스 오피스"],
  공장: ["정안 공장", "라이트 창고", "스마트 물류동"],
};

const categoryBaseArea: Record<EstateCategory, number[]> = {
  원룸: [7, 9, 12, 14],
  빌라: [18, 22, 28, 34],
  오피스텔: [10, 15, 20, 26],
  아파트: [24, 32, 39, 45],
  상가: [36, 52, 68, 80],
  사무실: [30, 48, 64, 90],
  공장: [95, 130, 180, 240],
};

const categoryPool: EstateCategory[] = [
  "원룸",
  "빌라",
  "오피스텔",
  "아파트",
  "상가",
  "사무실",
  "공장",
];

const pick = <T,>(items: T[], index: number) => items[index % items.length];

const priceFor = (category: EstateCategory, index: number) => {
  if (category === "아파트") {
    return { transactionType: "매매" as const, price: `${8 + index}억`, deposit: 0, monthlyRent: 0, salePrice: (8 + index) * 10000 };
  }

  if (category === "공장") {
    return { transactionType: "매매" as const, price: `${18 + index * 2}억`, deposit: 0, monthlyRent: 0, salePrice: (18 + index * 2) * 10000 };
  }

  if (category === "원룸" || category === "오피스텔") {
    const depositOptions = [500, 1000, 1500, 2000];
    const rentOptions = [40, 45, 50, 55, 60, 65];
    const deposit = pick(depositOptions, index);
    const rent = pick(rentOptions, index + 1);

    return {
      transactionType: "월세" as const,
      price: `${deposit} / ${rent}`,
      deposit,
      monthlyRent: rent,
      salePrice: 0,
    };
  }

  const deposit = 1000 + index * 500;
  const rent = category === "상가" || category === "사무실" ? 45 + index * 10 : 35 + index * 5;

  return {
    transactionType: "월세" as const,
    price: `${deposit} / ${rent}`,
    deposit,
    monthlyRent: rent,
    salePrice: 0,
  };
};

const createItem = (id: string, category: EstateCategory, index: number): EstateItem => {
  const areaPyeong = pick(categoryBaseArea[category], index);
  const totalFloors = category === "공장" ? 2 : category === "상가" || category === "사무실" ? 10 : 15;
  const floorLevel = category === "공장" ? 1 : (index % totalFloors) + 1;
  const price = priceFor(category, index);

  return {
    id,
    category,
    building: pick(buildings[category], index),
    ...price,
    areaPyeong,
    area: `${areaPyeong}평`,
    floorLevel,
    totalFloors,
    floor: `${floorLevel}층`,
    maintenance: `관리비 ${5 + (index % 6)}만원`,
    station: pick(stations, index),
    neighborhood: pick(neighborhoods, index),
    comments: index % 4,
    likes: 1 + (index % 8),
    rooms: category === "원룸" ? 1 : category === "공장" || category === "상가" || category === "사무실" ? 0 : 2 + (index % 3),
    baths: category === "원룸" ? 1 : 1 + (index % 2),
    parking: index % 2 === 0 || category === "공장",
    direct: index % 3 !== 0,
    image: pick(imageByCategory[category], index),
    description: `${pick(buildings[category], index)} 매물입니다. 채광과 접근성이 좋고 바로 확인 가능한 공간이에요.`,
  };
};

export const adRounds: EstateItem[][] = [
  ["원룸", "공장", "오피스텔", "사무실", "아파트"].map((category, index) =>
    createItem(`ad-1-${index + 1}`, category as EstateCategory, index + 1),
  ),
  ["빌라", "사무실", "원룸", "공장", "오피스텔"].map((category, index) =>
    createItem(`ad-2-${index + 1}`, category as EstateCategory, index + 7),
  ),
  ["아파트", "공장", "빌라", "오피스텔", "사무실"].map((category, index) =>
    createItem(`ad-3-${index + 1}`, category as EstateCategory, index + 13),
  ),
];

export const baseListings: EstateItem[] = Array.from({ length: 18 }, (_, index) =>
  createItem(`listing-${index + 1}`, pick(categoryPool, index + 2), index + 3),
);

const normalizeCategory = (value: string): EstateCategory | null => {
  if (value.includes("빌라")) return "빌라";
  if (value.includes("오피스텔")) return "오피스텔";
  if (value.includes("공장") || value.includes("창고")) return "공장";
  if (categoryPool.includes(value as EstateCategory)) return value as EstateCategory;
  return null;
};

const splitLabel = (label?: string) =>
  label
    ? label
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    : [];

const parseRange = (label: string | undefined, fieldLabel: string) => {
  const match = label?.match(new RegExp(`${fieldLabel} ([^,]+)`));
  const value = match?.[1];

  if (!value || value === "전체") {
    return null;
  }

  const [min, max] = value.split("~");
  return { min, max };
};

const toNumber = (value: string) => {
  if (value.endsWith("억")) return Number.parseFloat(value) * 10000;
  if (value.endsWith("만")) return Number.parseFloat(value);
  return Number.parseFloat(value) || 0;
};

export const generateListings = (filters: FilterDraft): EstateItem[] => {
  const selectedCategories = splitLabel(filters.labels["매물 종류"])
    .map(normalizeCategory)
    .filter((category): category is EstateCategory => Boolean(category));
  const selectedTransactions = splitLabel(filters.labels["거래 유형"]);
  const areaRange = filters.labels["평수"]?.split("~");
  const depositRange = parseRange(filters.labels["가격"], "보증금");
  const rentRange = parseRange(filters.labels["가격"], "월세");
  const saleRange = parseRange(filters.labels["가격"], "매매가");

  const filtered = baseListings.filter((item) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) {
      return false;
    }

    if (selectedTransactions.length > 0 && !selectedTransactions.includes(item.transactionType)) {
      return false;
    }

    if (areaRange?.length === 2) {
      const min = toNumber(areaRange[0]);
      const max = toNumber(areaRange[1]);
      if (item.areaPyeong < min || item.areaPyeong > max) return false;
    }

    if (depositRange && (item.deposit < toNumber(depositRange.min) || item.deposit > toNumber(depositRange.max))) {
      return false;
    }

    if (rentRange && (item.monthlyRent < toNumber(rentRange.min) || item.monthlyRent > toNumber(rentRange.max))) {
      return false;
    }

    if (saleRange && (item.salePrice < toNumber(saleRange.min) || item.salePrice > toNumber(saleRange.max))) {
      return false;
    }

    return true;
  });

  return (filtered.length > 0 ? filtered : baseListings).slice(0, 8);
};

export const fallbackEstate = baseListings[0];
