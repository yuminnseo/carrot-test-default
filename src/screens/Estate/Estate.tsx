import { useEffect, useMemo, useRef, useState } from "react";
import {
  adRounds,
  generateAdRecommendations,
  generateListings,
  getImagesForCategory,
  type EstateItem,
} from "../../data/estateData";
import {
  getEstateLiked,
  recordHeartClick,
} from "../../data/estateStats";
import { trackHypothesisClick, trackHypothesisEvent } from "../../analytics";
import type { FilterDraft } from "../Filtering/sections/FilterControlsSection/FilterControlsSection";

const filterChips = [
  "매물 종류",
  "거래 유형",
  "가격",
  "평수",
  "거래 방식",
  "층수",
  "사용승인일",
  "기타",
];

type EstateCardType = "Ad" | "List";

const getCardAnalyticsProperties = (
  item: EstateItem,
  cardType: EstateCardType,
  component: string,
) => ({
  page: "Estate",
  component,
  card_id: item.id,
  card_type: cardType,
  is_ad: cardType === "Ad",
  category: item.category,
  transaction_type: item.transactionType,
  price: item.price,
  area_pyeong: item.areaPyeong,
  neighborhood: item.neighborhood,
});

const useCardImpression = (
  item: EstateItem,
  cardType: EstateCardType,
  component: string,
  impressionSurface: string,
  impressionPosition: number,
  activeFilterGroups: string,
) => {
  const ref = useRef<HTMLElement | null>(null);
  const sentRef = useRef(false);

  useEffect(() => {
    sentRef.current = false;
  }, [item.id, cardType, component, impressionSurface, impressionPosition, activeFilterGroups]);

  useEffect(() => {
    const element = ref.current;

    if (!element || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5 || sentRef.current) {
          return;
        }

        sentRef.current = true;
        trackHypothesisEvent("Estate Card Impression", {
          ...getCardAnalyticsProperties(item, cardType, component),
          impression_surface: impressionSurface,
          impression_position: impressionPosition,
          active_filter_groups: activeFilterGroups,
        });
        observer.disconnect();
      },
      { threshold: [0.5] },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [activeFilterGroups, cardType, component, impressionPosition, impressionSurface, item]);

  return ref;
};

const makeImagesUnique = (
  items: EstateItem[],
  reservedImages = new Set<string>(),
) => {
  const usedImages = new Set(reservedImages);

  return items.map((item) => {
    const images = getImagesForCategory(item.category);
    const image =
      images.find((candidate) => !usedImages.has(candidate)) ?? item.image;

    if (image) {
      usedImages.add(image);
    }

    return { ...item, image };
  });
};

const HeaderIconButton = ({
  alt,
  src,
  ariaLabel,
  trackingName,
}: {
  alt: string;
  src: string;
  ariaLabel: string;
  trackingName: string;
}) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="inline-flex flex-col items-center justify-center relative flex-[0_0_auto]"
      onClick={() => {
        trackHypothesisClick(trackingName, {
          page: "Estate",
          component: "Header",
        });
      }}
    >
      <div className="inline-flex flex-col items-center justify-center relative flex-[0_0_auto]">
        <img className="relative h-6" alt={alt} src={src} />
      </div>
      <div className="absolute w-[calc(100%_+_16px)] h-[calc(100%_+_16px)] -top-2 -left-2 rounded-full" />
    </button>
  );
};

const HeartButton = ({
  itemId,
  cardType,
  category,
  className,
  defaultStroke = "#9CA3AF",
  labelPrefix = "관심 매물",
}: {
  itemId: string;
  cardType: EstateCardType;
  category: string;
  className?: string;
  defaultStroke?: string;
  labelPrefix?: string;
}) => {
  const [liked, setLiked] = useState(() => getEstateLiked(itemId));

  return (
    <button
      type="button"
      aria-label={liked ? `${labelPrefix} 해제` : `${labelPrefix} 추가`}
      aria-pressed={liked}
      className={className}
      onClick={(event) => {
        event.stopPropagation();
        setLiked((current) => {
          const next = !current;
          recordHeartClick(itemId, next);
          trackHypothesisEvent("Estate Heart Click", {
            page: "Estate",
            component: "Heart",
            card_id: itemId,
            card_type: cardType,
            is_ad: cardType === "Ad",
            category,
            active: next,
            action: next ? "heart_on" : "heart_off",
          });
          trackHypothesisClick("Estate Heart Button", {
            page: "Estate",
            component: "Heart",
            card_id: itemId,
            card_type: cardType,
            is_ad: cardType === "Ad",
            category,
            active: next,
            action: next ? "heart_on" : "heart_off",
          });
          return next;
        });
      }}
    >
      <svg
        className="relative h-5 w-5"
        viewBox="0 0 20 20"
        fill={liked ? "#EE1C1C" : "none"}
        aria-hidden="true"
      >
        <path
          d="M10 17.25C5.35 13.1 3 10.72 3 7.64C3 5.22 4.84 3.5 7.08 3.5C8.38 3.5 9.46 4.1 10 5.02C10.54 4.1 11.62 3.5 12.92 3.5C15.16 3.5 17 5.22 17 7.64C17 10.72 14.65 13.1 10 17.25Z"
          stroke={liked ? "#EE1C1C" : defaultStroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

const RecommendationCard = ({
  item,
  impressionPosition,
  activeFilterGroups,
  onOpen,
}: {
  item: EstateItem;
  impressionPosition: number;
  activeFilterGroups: string;
  onOpen: (item: EstateItem) => void;
}) => {
  const impressionRef = useCardImpression(
    item,
    "Ad",
    "Ad Card Content",
    "recommended_ad",
    impressionPosition,
    activeFilterGroups,
  );

  return (
    <article
      ref={impressionRef}
      className="flex-col w-[124px] gap-2 flex items-start relative shrink-0 cursor-pointer"
      aria-label={`${item.category} ${item.transactionType} ${item.price} ${item.area} · ${item.floor} ${item.neighborhood}`}
      data-estate-id={item.id}
      onClick={() => {
        trackHypothesisEvent(
          "Estate Card Click",
          getCardAnalyticsProperties(item, "Ad", "Ad Card Content"),
        );
        trackHypothesisClick("Estate Card", {
          ...getCardAnalyticsProperties(item, "Ad", "Ad Card Content"),
          click_target: "card",
        });
        onOpen(item);
      }}
    >
      <div className="relative w-[124px] h-[84px] bg-zinc-100 rounded-lg overflow-hidden aspect-[1.48]">
        {item.image ? (
          <img
            className="absolute w-full h-full top-0 left-0 object-cover"
            alt={item.category}
            src={item.image}
          />
        ) : null}
        <HeartButton
          itemId={item.id}
          cardType="Ad"
          category={item.category}
          className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center"
          defaultStroke="#FFFFFF"
          labelPrefix="추천 관심 매물"
        />
      </div>
      <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col items-start gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
          <div className="relative flex items-center self-stretch mt-[-1.00px] font-caption-medium font-[number:var(--caption-medium-font-weight)] text-[#111111cc] text-[length:var(--caption-medium-font-size)] tracking-[var(--caption-medium-letter-spacing)] leading-[var(--caption-medium-line-height)] [font-style:var(--caption-medium-font-style)]">
            {item.category}
          </div>
          <div className="flex items-center gap-1 relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative flex items-center w-fit mt-[-1.00px] font-label-medium font-[number:var(--label-medium-font-weight)] text-zinc-800 text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] whitespace-nowrap [font-style:var(--label-medium-font-style)]">
              {item.transactionType}
            </div>
            <div className="relative flex items-center w-fit mt-[-1.00px] font-label-medium font-[number:var(--label-medium-font-weight)] text-zinc-800 text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] whitespace-nowrap [font-style:var(--label-medium-font-style)]">
              {item.price}
            </div>
          </div>
          <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
            <div className="relative flex items-center w-fit mt-[-1.00px] font-caption-medium font-[number:var(--caption-medium-font-weight)] text-[#111111cc] text-[length:var(--caption-medium-font-size)] tracking-[var(--caption-medium-letter-spacing)] leading-[var(--caption-medium-line-height)] whitespace-nowrap [font-style:var(--caption-medium-font-style)]">
              {item.area}
            </div>
            <div className="relative flex items-center w-fit mt-[-1.00px] font-caption-medium font-[number:var(--caption-medium-font-weight)] text-[#111111cc] text-[length:var(--caption-medium-font-size)] tracking-[var(--caption-medium-letter-spacing)] leading-[var(--caption-medium-line-height)] whitespace-nowrap [font-style:var(--caption-medium-font-style)]">
              ·
            </div>
            <div className="relative flex items-center w-fit mt-[-1.00px] font-caption-medium font-[number:var(--caption-medium-font-weight)] text-[#111111cc] text-[length:var(--caption-medium-font-size)] tracking-[var(--caption-medium-letter-spacing)] leading-[var(--caption-medium-line-height)] whitespace-nowrap [font-style:var(--caption-medium-font-style)]">
              {item.floor}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
          <div className="relative flex items-center flex-1 mt-[-1.00px] font-caption-medium font-[number:var(--caption-medium-font-weight)] text-[#11111170] text-[length:var(--caption-medium-font-size)] tracking-[var(--caption-medium-letter-spacing)] leading-[var(--caption-medium-line-height)] [font-style:var(--caption-medium-font-style)]">
            {item.neighborhood}
          </div>
        </div>
      </div>
    </article>
  );
};

const FilterChip = ({
  active,
  label,
  displayLabel,
  onClick,
}: {
  active: boolean;
  label: string;
  displayLabel: string;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      aria-label={`${label} 필터`}
      aria-pressed={active}
      className="inline-flex flex-col items-start px-2 py-1.5 relative flex-[0_0_auto]"
      onClick={onClick}
    >
      <div
        className={`absolute w-full h-full top-0 left-0 rounded-full border border-solid ${
          active ? "border-zinc-800 bg-zinc-800" : "border-[#71717a29]"
        }`}
      />
      <div className="inline-flex items-center gap-1 px-0.5 py-0 relative flex-[0_0_auto]">
        <div className="inline-flex items-center justify-center px-0 py-0.5 relative flex-[0_0_auto]">
          <div
            className={`relative w-fit mt-[-1.00px] font-body-small font-[number:var(--body-small-font-weight)] text-[length:var(--body-small-font-size)] tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] whitespace-nowrap [font-style:var(--body-small-font-style)] ${
              active ? "text-white" : "text-[#111111cc]"
            }`}
          >
            {displayLabel}
          </div>
        </div>
        <div className="self-stretch inline-flex items-center relative flex-[0_0_auto]">
          <div className="inline-flex flex-col items-center justify-center relative flex-[0_0_auto]">
            <img
              className={`relative h-4 ${active ? "brightness-0 invert" : ""}`}
              alt="Icon variant"
              src="https://c.animaapp.com/CCu1lgJX/img/--icon-variant---11.svg"
            />
          </div>
        </div>
      </div>
      <div className="w-full left-0 rounded-full absolute h-full top-0" />
    </button>
  );
};

const ListingCard = ({
  item,
  impressionPosition,
  activeFilterGroups,
  onOpen,
}: {
  item: EstateItem;
  impressionPosition: number;
  activeFilterGroups: string;
  onOpen: (item: EstateItem) => void;
}) => {
  const impressionRef = useCardImpression(
    item,
    "List",
    "List Card Content",
    "listing",
    impressionPosition,
    activeFilterGroups,
  );

  return (
    <article
      ref={impressionRef}
      className="gap-3 self-stretch w-full flex-[0_0_auto] flex items-start relative cursor-pointer"
      data-estate-id={item.id}
      aria-label={`${item.transactionType} ${item.price} ${item.category} · ${item.area} · ${item.floor}`}
      onClick={() => {
        trackHypothesisEvent(
          "Estate Card Click",
          getCardAnalyticsProperties(item, "List", "List Card Content"),
        );
        trackHypothesisClick("Estate Card", {
          ...getCardAnalyticsProperties(item, "List", "List Card Content"),
          click_target: "card",
        });
        onOpen(item);
      }}
    >
      <div className="relative w-[104px] h-[104px] bg-zinc-100 rounded-lg shrink-0 overflow-hidden">
        {item.image ? (
          <img
            className="absolute left-0 top-0 h-full w-full object-cover"
            alt={item.category}
            src={item.image}
          />
        ) : null}
      </div>
      <div className="flex flex-col items-start px-0 py-0.5 relative flex-1 self-stretch">
        <div className="flex flex-col items-start justify-between relative self-stretch w-full flex-1">
          <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
            <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
              <div className="flex items-center gap-1 relative self-stretch w-full flex-[0_0_auto]">
                <div className="relative flex items-center w-fit mt-[-1.00px] font-title-xsmall font-[number:var(--title-xsmall-font-weight)] text-zinc-800 text-[length:var(--title-xsmall-font-size)] tracking-[var(--title-xsmall-letter-spacing)] leading-[var(--title-xsmall-line-height)] whitespace-nowrap [font-style:var(--title-xsmall-font-style)]">
                  {item.transactionType}
                </div>
                <div className="relative flex items-center w-fit mt-[-1.00px] font-title-xsmall font-[number:var(--title-xsmall-font-weight)] text-zinc-800 text-[length:var(--title-xsmall-font-size)] tracking-[var(--title-xsmall-letter-spacing)] leading-[var(--title-xsmall-line-height)] whitespace-nowrap [font-style:var(--title-xsmall-font-style)]">
                  {item.price}
                </div>
              </div>
              <div className="inline-flex items-start gap-0.5 relative flex-[0_0_auto]">
                <div className="relative flex items-center w-fit mt-[-1.00px] font-body-small font-[number:var(--body-small-font-weight)] text-[#111111cc] text-[length:var(--body-small-font-size)] tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] whitespace-nowrap [font-style:var(--body-small-font-style)]">
                  {item.category}
                </div>
                <div className="relative flex items-center w-fit mt-[-1.00px] font-body-small font-[number:var(--body-small-font-weight)] text-[#111111cc] text-[length:var(--body-small-font-size)] tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] whitespace-nowrap [font-style:var(--body-small-font-style)]">
                  ·
                </div>
                <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                  <div className="relative flex items-center w-fit mt-[-1.00px] font-body-small font-[number:var(--body-small-font-weight)] text-[#111111cc] text-[length:var(--body-small-font-size)] tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] whitespace-nowrap [font-style:var(--body-small-font-style)]">
                    {item.area}
                  </div>
                  <div className="relative flex items-center w-fit mt-[-1.00px] font-body-small font-[number:var(--body-small-font-weight)] text-[#111111cc] text-[length:var(--body-small-font-size)] tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] whitespace-nowrap [font-style:var(--body-small-font-style)]">
                    ·
                  </div>
                  <div className="relative flex items-center w-fit mt-[-1.00px] font-body-small font-[number:var(--body-small-font-weight)] text-[#111111cc] text-[length:var(--body-small-font-size)] tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] whitespace-nowrap [font-style:var(--body-small-font-style)]">
                    {item.floor}
                  </div>
                </div>
              </div>
              <div className="inline-flex items-start gap-0.5 relative flex-[0_0_auto]">
                <div className="relative flex items-center w-fit mt-[-1.00px] font-caption-medium font-[number:var(--caption-medium-font-weight)] text-[#11111170] text-[length:var(--caption-medium-font-size)] tracking-[var(--caption-medium-letter-spacing)] leading-[var(--caption-medium-line-height)] whitespace-nowrap [font-style:var(--caption-medium-font-style)]">
                  {item.maintenance}
                </div>
                <div className="relative flex items-center w-fit mt-[-1.00px] font-caption-medium font-[number:var(--caption-medium-font-weight)] text-[#11111170] text-[length:var(--caption-medium-font-size)] tracking-[var(--caption-medium-letter-spacing)] leading-[var(--caption-medium-line-height)] whitespace-nowrap [font-style:var(--caption-medium-font-style)]">
                  ·
                </div>
                <div className="relative flex items-center w-fit mt-[-1.00px] font-caption-medium font-[number:var(--caption-medium-font-weight)] text-[#11111170] text-[length:var(--caption-medium-font-size)] tracking-[var(--caption-medium-letter-spacing)] leading-[var(--caption-medium-line-height)] whitespace-nowrap [font-style:var(--caption-medium-font-style)]">
                  {item.station}
                </div>
              </div>
            </div>
            <HeartButton
              itemId={item.id}
              cardType="List"
              category={item.category}
              className="inline-flex flex-col items-start relative flex-[0_0_auto]"
            />
          </div>
          <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex items-center justify-center gap-2.5 relative flex-1 grow">
              <div className="relative flex items-center flex-1 mt-[-1.00px] font-caption-small font-[number:var(--caption-small-font-weight)] text-[#11111170] text-[length:var(--caption-small-font-size)] tracking-[var(--caption-small-letter-spacing)] leading-[var(--caption-small-line-height)] [font-style:var(--caption-small-font-style)]">
                {item.neighborhood}
              </div>
            </div>
            <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
              <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                <img
                  className="relative flex-[0_0_auto] h-3"
                  alt="Icon normal bubble"
                  src="https://c.animaapp.com/CCu1lgJX/img/icon-normal-bubble-6.svg"
                />
                <div className="relative flex items-center w-fit mt-[-1.00px] font-caption-small font-[number:var(--caption-small-font-weight)] text-[#11111170] text-[length:var(--caption-small-font-size)] tracking-[var(--caption-small-letter-spacing)] leading-[var(--caption-small-line-height)] whitespace-nowrap [font-style:var(--caption-small-font-style)]">
                  {item.comments}
                </div>
              </div>
              <div className="relative flex items-center w-fit mt-[-1.00px] font-caption-small font-[number:var(--caption-small-font-weight)] text-[#11111170] text-[length:var(--caption-small-font-size)] tracking-[var(--caption-small-letter-spacing)] leading-[var(--caption-small-line-height)] whitespace-nowrap [font-style:var(--caption-small-font-style)]">
                ·
              </div>
              <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                <img
                  className="relative flex-[0_0_auto] h-3"
                  alt="Icon normal heart"
                  src="https://c.animaapp.com/CCu1lgJX/img/icon-normal-heart-13.svg"
                />
                <div className="relative flex items-center w-fit mt-[-1.00px] font-caption-small font-[number:var(--caption-small-font-weight)] text-[#11111170] text-[length:var(--caption-small-font-size)] tracking-[var(--caption-small-letter-spacing)] leading-[var(--caption-small-line-height)] whitespace-nowrap [font-style:var(--caption-small-font-style)]">
                  {item.likes}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export const Estate = ({
  activeFilters,
  onResetFilters,
  onOpenEstate,
}: {
  activeFilters: FilterDraft;
  onResetFilters: () => void;
  onOpenEstate: (item: EstateItem) => void;
}): JSX.Element => {
  const hasActiveFilters = activeFilters.activeGroups.length > 0;
  const [adRoundIndex, setAdRoundIndex] = useState(0);
  const recommendationCards = useMemo(
    () => makeImagesUnique(generateAdRecommendations(activeFilters, adRoundIndex)),
    [activeFilters, adRoundIndex],
  );
  const listingItems = useMemo(
    () =>
      makeImagesUnique(
        generateListings(activeFilters),
        new Set(recommendationCards.map((item) => item.image).filter(Boolean)),
      ),
    [activeFilters, recommendationCards],
  );
  const activeFilterGroups = activeFilters.activeGroups.join(",") || "none";

  return (
    <main
      className="flex h-full flex-col items-start relative bg-white"
      data-model-id="4001:152980"
    >
      <header className="sticky top-0 z-20 flex flex-col w-[375px] items-start flex-[0_0_auto] bg-white">
        <div className="flex flex-col w-[375px] h-11 items-center justify-center relative">
          <div className="flex flex-col items-center justify-center relative self-stretch w-full flex-[0_0_auto]" />
        </div>
        <div className="flex items-center justify-around gap-[104px] px-5 py-2 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center justify-between relative flex-1 grow">
            <div className="flex w-[60px] gap-5 items-center relative">
              <HeaderIconButton
                alt="Icon variant"
                src="https://c.animaapp.com/CCu1lgJX/img/--icon-variant--.svg"
                ariaLabel="뒤로 가기"
                trackingName="Estate Header Back"
              />
            </div>
            <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
              <div className="inline-flex items-center gap-1 px-0 py-0.5 relative flex-[0_0_auto]">
                <h1 className="relative w-fit mt-[-1.00px] font-headline font-[number:var(--headline-font-weight)] text-zinc-800 text-[length:var(--headline-font-size)] tracking-[var(--headline-letter-spacing)] leading-[var(--headline-line-height)] whitespace-nowrap [font-style:var(--headline-font-style)]">
                  당근 부동산
                </h1>
              </div>
            </div>
            <div className="inline-flex items-center gap-3 relative self-stretch flex-[0_0_auto]">
              <HeaderIconButton
                alt="Icon variant"
                src="https://c.animaapp.com/CCu1lgJX/img/--icon-variant---1.svg"
                ariaLabel="글쓰기"
                trackingName="Estate Header Write"
              />
              <HeaderIconButton
                alt="Icon variant"
                src="https://c.animaapp.com/CCu1lgJX/img/--icon-variant---2.svg"
                ariaLabel="메뉴 열기"
                trackingName="Estate Header Menu"
              />
            </div>
          </div>
        </div>
      </header>
      <div className="scrollbar-hidden flex min-h-0 flex-1 flex-col w-[375px] items-start relative overflow-y-scroll">
        <section className="flex flex-col items-start px-5 py-2 self-stretch w-full relative flex-[0_0_auto]">
          <div className="flex items-center gap-2 self-stretch w-full relative flex-[0_0_auto]">
            <button
              type="button"
              aria-label="지역 선택, 서울시 강남구"
              className="flex items-center gap-1 px-3 py-2 relative flex-1 grow bg-zinc-100 rounded-lg overflow-hidden text-left"
              onClick={() => {
                trackHypothesisClick("Estate Location Button", {
                  page: "Estate",
                  component: "Search Wrapper",
                  location: "서울시 강남구",
                });
              }}
            >
              <div className="flex items-center gap-0.5 px-0 py-0.5 relative flex-1 grow">
                <img
                  className="h-5 relative flex-[0_0_auto]"
                  alt="Leading button"
                  src="https://c.animaapp.com/CCu1lgJX/img/leading-button.svg"
                />
                <div className="relative flex items-center w-fit [font-family:'Pretendard-Regular',Helvetica] font-normal text-zinc-800 text-sm tracking-[0] leading-[16.8px] whitespace-nowrap">
                  서울시 강남구
                </div>
              </div>
            </button>
            <button
              type="button"
              aria-label="지도 보기"
              className="all-[unset] box-border flex flex-col w-10 items-center px-2 py-1 relative rounded-lg overflow-hidden"
              onClick={() => {
                trackHypothesisClick("Estate Map Button", {
                  page: "Estate",
                  component: "Search Wrapper",
                });
              }}
            >
              <div className="bg-[#111111] rounded-lg opacity-[0.88] absolute w-full h-full top-0 left-0" />
              <img
                className="relative w-5 h-5 aspect-[1]"
                alt="Material symbols map"
                src="https://c.animaapp.com/CCu1lgJX/img/material-symbols-map-outline.svg"
              />
              <div className="relative flex items-center w-fit [font-family:'Pretendard-Regular',Helvetica] font-normal text-white text-[10px] tracking-[0] leading-[12.0px] whitespace-nowrap">
                지도
              </div>
            </button>
          </div>
        </section>
        <section
          className="sticky top-0 z-10 flex flex-col items-start px-5 py-2 self-stretch w-full flex-[0_0_auto] bg-white"
          aria-label="매물 필터"
        >
          <div className="scrollbar-hidden flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto] overflow-x-scroll">
            {hasActiveFilters ? (
              <button
                type="button"
                aria-label="필터 초기화"
                className="inline-flex h-9 w-9 flex-col items-center justify-center relative flex-[0_0_auto]"
                onClick={(event) => {
                  event.stopPropagation();
                  trackHypothesisClick("Estate Filter Reset Button", {
                    page: "Estate",
                    component: "Filtering_Wrapper",
                    active_groups: activeFilters.activeGroups.join(","),
                  });
                  onResetFilters();
                }}
              >
                <div className="absolute w-full h-full top-0 left-0 rounded-full bg-[#71717a14]" />
                <img
                  className="relative h-4"
                  alt=""
                  aria-hidden="true"
                  src="https://c.animaapp.com/CCu1lgJX/img/--icon-variant---3.svg"
                />
              </button>
            ) : null}
            {filterChips.map((chip) => (
              <FilterChip
                key={chip}
                active={activeFilters.activeGroups.includes(chip)}
                label={chip}
                displayLabel={activeFilters.labels[chip] ?? chip}
                onClick={() => {
                  trackHypothesisClick("Estate Filter Chip", {
                    page: "Estate",
                    component: "Filtering_Wrapper",
                    filter_group: chip,
                    filter_label: activeFilters.labels[chip] ?? chip,
                    active: activeFilters.activeGroups.includes(chip),
                  });
                }}
              />
            ))}
          </div>
        </section>
        <section className="flex flex-col items-start pt-0 pb-3 px-5 relative self-stretch w-full flex-[0_0_auto]">
          <label className="inline-flex items-center gap-2 relative flex-[0_0_auto] cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              defaultChecked
              aria-label="평수로 보기"
              onChange={(event) => {
                trackHypothesisClick("Estate Area Unit Toggle", {
                  page: "Estate",
                  component: "Toggle_Wrapper",
                  active: event.currentTarget.checked,
                });
              }}
            />
            <div className="flex w-8 items-center justify-end p-0.5 relative">
              <div className="bg-zinc-800 rounded-full absolute w-full h-full top-0 left-0 peer-checked:bg-zinc-800 peer-not-checked:bg-zinc-300" />
              <div className="relative w-4 h-4 bg-white rounded-full aspect-[1] transition-transform peer-checked:translate-x-0 peer-not-checked:-translate-x-3" />
            </div>
            <div className="relative flex items-center w-fit font-label-small font-[number:var(--label-small-font-weight)] text-[#111111cc] text-[length:var(--label-small-font-size)] tracking-[var(--label-small-letter-spacing)] leading-[var(--label-small-line-height)] whitespace-nowrap [font-style:var(--label-small-font-style)]">
              평수로 보기
            </div>
          </label>
        </section>
        <section
          className="flex flex-col items-start px-5 py-1 relative self-stretch w-full flex-[0_0_auto]"
          aria-labelledby="recommended-estates-heading"
        >
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-start px-0 py-0.5 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-end justify-between relative self-stretch w-full flex-[0_0_auto]">
                <h2
                  id="recommended-estates-heading"
                  className="relative flex items-center w-fit mt-[-1.00px] font-title-xsmall font-[number:var(--title-xsmall-font-weight)] text-zinc-900 text-[length:var(--title-xsmall-font-size)] tracking-[var(--title-xsmall-letter-spacing)] leading-[var(--title-xsmall-line-height)] whitespace-nowrap [font-style:var(--title-xsmall-font-style)]"
                >
                  강남구 추천 매물
                </h2>
                <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                  <div className="relative flex items-center w-fit mt-[-1.00px] font-label-small font-[number:var(--label-small-font-weight)] text-[#11111138] text-[length:var(--label-small-font-size)] tracking-[var(--label-small-letter-spacing)] leading-[var(--label-small-line-height)] whitespace-nowrap [font-style:var(--label-small-font-style)]">
                    광고
                  </div>
                  <img
                    className="h-4 relative flex-[0_0_auto]"
                    alt="Leading button"
                    src="https://c.animaapp.com/CCu1lgJX/img/leading-button-1.svg"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start px-0 py-1 relative self-stretch w-full flex-[0_0_auto]">
              <div className="scrollbar-hidden -mx-5 flex w-[375px] items-center gap-3 overflow-x-scroll overflow-y-visible px-5 relative flex-[0_0_auto]">
                {recommendationCards.map((card, index) => (
                  <RecommendationCard
                    key={card.id}
                    item={card}
                    impressionPosition={index + 1}
                    activeFilterGroups={activeFilterGroups}
                    onOpen={onOpenEstate}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="flex flex-col items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
          <div className="h-px bg-[#71717a38] relative self-stretch w-full" />
          <div className="inline-flex flex-col items-start px-0 py-0.5 relative flex-[0_0_auto]">
            <button
              type="button"
              aria-label="더 많은 매물 보기"
              className="all-[unset] box-border inline-flex flex-col items-start relative flex-[0_0_auto]"
              onClick={(event) => {
                event.stopPropagation();
                trackHypothesisClick("Estate More Ad Button", {
                  page: "Estate",
                  component: "Ad",
                  current_round: adRoundIndex + 1,
                  next_round: ((adRoundIndex + 1) % adRounds.length) + 1,
                });
                setAdRoundIndex((current) => (current + 1) % adRounds.length);
              }}
            >
              <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                  <div className="inline-flex flex-col justify-center flex-[0_0_auto] items-center relative">
                    <img
                      className="relative h-4"
                      alt="Icon variant"
                      src="https://c.animaapp.com/CCu1lgJX/img/--icon-variant---3.svg"
                    />
                  </div>
                  <div className="inline-flex items-center justify-center relative flex-[0_0_auto]">
                    <div className="relative w-fit mt-[-1.00px] font-body-small font-[number:var(--body-small-font-weight)] text-zinc-800 text-[length:var(--body-small-font-size)] tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] whitespace-nowrap [font-style:var(--body-small-font-style)]">
                      더 많은 매물 보기
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[calc(100%_+_8px)] -left-1 rounded absolute h-full top-0" />
            </button>
          </div>
          <div className="h-2 bg-[#71717a0d] relative self-stretch w-full" />
        </section>
        <section
          className="flex items-center px-5 py-3 self-stretch w-full relative flex-[0_0_auto]"
          aria-label="매물 목록"
        >
          <div className="flex flex-col items-start gap-4 relative flex-1 grow">
            {listingItems.map((item, index) => (
              <div key={item.id} className="w-full">
                <ListingCard
                  item={item}
                  impressionPosition={index + 1}
                  activeFilterGroups={activeFilterGroups}
                  onOpen={onOpenEstate}
                />
                {index < listingItems.length - 1 && (
                  <div className="relative self-stretch w-full h-px bg-[#71717a38] opacity-[0.61] mt-4" />
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
