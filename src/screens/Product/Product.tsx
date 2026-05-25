import { useEffect, useMemo, useState } from "react";
import type { EstateItem } from "../../data/estateData";
import {
  getEstateLiked,
  recordChatClick,
  recordHeartClick,
} from "../../data/estateStats";

export const Product = ({ item }: { item: EstateItem }): JSX.Element => {
  const [liked, setLiked] = useState(() => getEstateLiked(item.id));

  useEffect(() => {
    setLiked(getEstateLiked(item.id));
  }, [item.id]);

  const leftDetailItems = useMemo(
    () => [
      {
        label: item.maintenance,
        iconSrc: "https://c.animaapp.com/WG8KVEHL/img/--icon-variant---3.svg",
      },
      {
        label:
          item.rooms > 0
            ? `방 ${item.rooms}개 / 욕실 ${item.baths}개`
            : `전용 공간 / 화장실 ${item.baths}개`,
        iconSrc: "https://c.animaapp.com/WG8KVEHL/img/--icon-variant---4.svg",
      },
      {
        label: item.parking ? "주차 가능" : "주차 협의",
        iconSrc: "https://c.animaapp.com/WG8KVEHL/img/--icon-variant---5.svg",
      },
    ],
    [item],
  );

  const rightDetailItems = useMemo(
    () => [
      {
        label: item.area,
        iconSrc: "https://c.animaapp.com/WG8KVEHL/img/--icon-variant---6.svg",
      },
      {
        label: `${item.floorLevel}층 / ${item.totalFloors}층`,
        iconSrc: "https://c.animaapp.com/WG8KVEHL/img/--icon-variant---7.svg",
      },
    ],
    [item],
  );

  const toggleLiked = () => {
    setLiked((current) => {
      const next = !current;
      recordHeartClick(item.id, next);
      return next;
    });
  };

  return (
    <main
      className="flex h-full w-[375px] flex-col items-start relative bg-white overflow-hidden"
      data-model-id="4014:29542"
    >
      <header className="z-20 flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white">
        <div
          className="w-[375px] h-11 flex flex-col items-center justify-center relative"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center justify-center relative self-stretch w-full flex-[0_0_auto]" />
        </div>
        <div className="flex items-center justify-around gap-[104px] px-5 py-2 relative self-stretch w-full flex-[0_0_auto]">
          <div className="justify-between flex-1 grow flex items-center relative">
            <div className="flex w-[60px] gap-5 items-center relative">
              <button
                type="button"
                aria-label="닫기"
                className="inline-flex flex-col justify-center flex-[0_0_auto] items-center relative"
              >
                <div className="inline-flex flex-col items-center justify-center relative flex-[0_0_auto]">
                  <img
                    className="relative h-6"
                    alt=""
                    aria-hidden="true"
                    src="https://c.animaapp.com/WG8KVEHL/img/--icon-variant--.svg"
                  />
                </div>
                <div className="absolute w-[calc(100%_+_16px)] h-[calc(100%_+_16px)] -top-2 -left-2 rounded-full" />
              </button>
            </div>
            <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
              <div className="inline-flex items-center gap-1 px-0 py-0.5 relative flex-[0_0_auto]">
                <h1 className="relative w-fit mt-[-1.00px] font-headline font-[number:var(--headline-font-weight)] text-zinc-800 text-[length:var(--headline-font-size)] tracking-[var(--headline-letter-spacing)] leading-[var(--headline-line-height)] whitespace-nowrap [font-style:var(--headline-font-style)]">
                  당근 부동산
                </h1>
              </div>
            </div>
            <div className="gap-3 self-stretch inline-flex items-center relative flex-[0_0_auto]">
              <button
                type="button"
                aria-label="수정"
                className="flex-col justify-center inline-flex items-center relative flex-[0_0_auto]"
              >
                <div className="inline-flex flex-col items-center justify-center relative flex-[0_0_auto]">
                  <img
                    className="relative h-6"
                    alt=""
                    aria-hidden="true"
                    src="https://c.animaapp.com/WG8KVEHL/img/--icon-variant---1.svg"
                  />
                </div>
                <div className="absolute w-[calc(100%_+_16px)] h-[calc(100%_+_16px)] -top-2 -left-2 rounded-full" />
              </button>
              <button
                type="button"
                aria-label="메뉴 열기"
                className="inline-flex flex-col items-center justify-center relative flex-[0_0_auto]"
              >
                <div className="inline-flex flex-col items-center justify-center relative flex-[0_0_auto]">
                  <img
                    className="relative h-6"
                    alt=""
                    aria-hidden="true"
                    src="https://c.animaapp.com/WG8KVEHL/img/--icon-variant---2.svg"
                  />
                </div>
                <div className="absolute w-[calc(100%_+_16px)] h-[calc(100%_+_16px)] -top-2 -left-2 rounded-full" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="scrollbar-hidden flex min-h-0 flex-col items-start relative flex-1 self-stretch w-full overflow-y-scroll">
        <section
          className="relative self-stretch w-full bg-zinc-100 aspect-[1.48]"
          aria-label="매물 이미지"
        >
          <img
            className="absolute w-full h-full top-0 left-0 object-cover"
            alt={`${item.building} 매물 이미지`}
            src={item.image}
          />
        </section>
        <section
          className="flex p-5 self-stretch w-full flex-[0_0_auto] flex-col items-start relative"
          aria-label="매물 요약 정보"
        >
          <div className="flex flex-col items-start gap-5 self-stretch w-full relative flex-[0_0_auto]">
            <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
              <div className="inline-flex items-start gap-0.5 relative flex-[0_0_auto]">
                <div className="relative flex items-center w-fit mt-[-1.00px] font-body-small font-[number:var(--body-small-font-weight)] text-[#111111cc] text-[length:var(--body-small-font-size)] tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] whitespace-nowrap [font-style:var(--body-small-font-style)]">
                  {item.category}
                </div>
                <div className="relative flex items-center w-fit mt-[-1.00px] font-body-small font-[number:var(--body-small-font-weight)] text-[#111111cc] text-[length:var(--body-small-font-size)] tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] whitespace-nowrap [font-style:var(--body-small-font-style)]">
                  ·
                </div>
                <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                  <div className="relative flex items-center w-fit mt-[-1.00px] font-body-small font-[number:var(--body-small-font-weight)] text-[#111111cc] text-[length:var(--body-small-font-size)] tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] whitespace-nowrap [font-style:var(--body-small-font-style)]">
                    {item.building}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 relative self-stretch w-full flex-[0_0_auto]">
                <div className="relative flex items-center w-fit mt-[-1.00px] font-title-medium font-[number:var(--title-medium-font-weight)] text-zinc-800 text-[length:var(--title-medium-font-size)] tracking-[var(--title-medium-letter-spacing)] leading-[var(--title-medium-line-height)] whitespace-nowrap [font-style:var(--title-medium-font-style)]">
                  {item.transactionType}
                </div>
                <div className="relative flex items-center w-fit mt-[-1.00px] font-title-medium font-[number:var(--title-medium-font-weight)] text-zinc-800 text-[length:var(--title-medium-font-size)] tracking-[var(--title-medium-letter-spacing)] leading-[var(--title-medium-line-height)] whitespace-nowrap [font-style:var(--title-medium-font-style)]">
                  {item.price}
                </div>
              </div>
              <div className="inline-flex items-start gap-0.5 relative flex-[0_0_auto]">
                <div className="relative flex items-center w-fit mt-[-1.00px] font-body-small font-[number:var(--body-small-font-weight)] text-[#11111170] text-[length:var(--body-small-font-size)] tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] whitespace-nowrap [font-style:var(--body-small-font-style)]">
                  {item.station}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
              <div className="gap-5 self-stretch w-full flex-[0_0_auto] flex items-start relative">
                <div className="flex-col gap-3 flex-1 grow flex items-start relative">
                  {leftDetailItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-1 self-stretch w-full relative flex-[0_0_auto]"
                    >
                      <div className="inline-flex flex-col items-center justify-center relative flex-[0_0_auto]">
                        <img
                          className="relative h-4"
                          aria-hidden="true"
                          src={item.iconSrc}
                        />
                      </div>
                      <div className="relative flex items-center w-fit mt-[-1.00px] font-caption-medium font-[number:var(--caption-medium-font-weight)] text-[#111111cc] text-[length:var(--caption-medium-font-size)] tracking-[var(--caption-medium-letter-spacing)] leading-[var(--caption-medium-line-height)] whitespace-nowrap [font-style:var(--caption-medium-font-style)]">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex-col gap-3 flex-1 grow flex items-start relative">
                  {rightDetailItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-1 self-stretch w-full relative flex-[0_0_auto]"
                    >
                      <div className="inline-flex flex-col items-center justify-center relative flex-[0_0_auto]">
                        <img
                          className="relative h-4"
                          aria-hidden="true"
                          src={item.iconSrc}
                        />
                      </div>
                      <div className="relative flex items-center w-fit mt-[-1.00px] font-caption-medium font-[number:var(--caption-medium-font-weight)] text-[#111111cc] text-[length:var(--caption-medium-font-size)] tracking-[var(--caption-medium-letter-spacing)] leading-[var(--caption-medium-line-height)] whitespace-nowrap [font-style:var(--caption-medium-font-style)]">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="inline-flex items-start gap-0.5 relative flex-[0_0_auto]">
                <time className="relative flex items-center w-fit mt-[-1.00px] font-body-small font-[number:var(--body-small-font-weight)] text-[#11111170] text-[length:var(--body-small-font-size)] tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] whitespace-nowrap [font-style:var(--body-small-font-style)]">
                  5일 전
                </time>
              </div>
            </div>
          </div>
        </section>
        <div
          className="relative h-2 w-full shrink-0 self-stretch bg-[#71717a14]"
          aria-hidden="true"
        />
        <section
          className="flex p-5 flex-1 self-stretch w-full grow flex-col items-start relative"
          aria-labelledby="product-description-heading"
        >
          <div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
            <h2
              id="product-description-heading"
              className="relative flex items-center self-stretch mt-[-1.00px] font-headline font-[number:var(--headline-font-weight)] text-zinc-800 text-[length:var(--headline-font-size)] tracking-[var(--headline-letter-spacing)] leading-[var(--headline-line-height)] [font-style:var(--headline-font-style)]"
            >
              {item.description}
            </h2>
            <p className="relative flex items-center self-stretch font-body-small font-[number:var(--body-small-font-weight)] text-[#111111cc] text-[length:var(--body-small-font-size)] tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] [font-style:var(--body-small-font-style)]">
              매물 설명
            </p>
          </div>
        </section>
      </div>
      <footer className="z-20 flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white">
        <div className="p-5 self-stretch w-full flex-[0_0_auto] flex items-center relative">
          <div className="flex w-[335px] items-center justify-between relative">
            <div className="gap-2 inline-flex items-center relative flex-[0_0_auto]">
              <button
                type="button"
                aria-label={liked ? "관심 매물 해제" : "관심 매물 추가"}
                aria-pressed={liked}
                className="inline-flex flex-col items-start relative flex-[0_0_auto]"
                onClick={toggleLiked}
              >
                <svg
                  className="relative h-6 w-6"
                  viewBox="0 0 20 20"
                  fill={liked ? "#EE1C1C" : "none"}
                  aria-hidden="true"
                >
                  <path
                    d="M10 17.25C5.35 13.1 3 10.72 3 7.64C3 5.22 4.84 3.5 7.08 3.5C8.38 3.5 9.46 4.1 10 5.02C10.54 4.1 11.62 3.5 12.92 3.5C15.16 3.5 17 5.22 17 7.64C17 10.72 14.65 13.1 10 17.25Z"
                    stroke={liked ? "#EE1C1C" : "#9CA3AF"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="flex flex-col w-[157px] items-start gap-1 relative">
                <div className="flex items-center gap-1 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-center relative w-fit mt-[-1.00px] font-headline font-[number:var(--headline-font-weight)] text-zinc-800 text-[length:var(--headline-font-size)] tracking-[var(--headline-letter-spacing)] leading-[var(--headline-line-height)] whitespace-nowrap [font-style:var(--headline-font-style)]">
                    {item.transactionType}
                  </div>
                  <div className="flex items-center relative w-fit mt-[-1.00px] font-headline font-[number:var(--headline-font-weight)] text-zinc-800 text-[length:var(--headline-font-size)] tracking-[var(--headline-letter-spacing)] leading-[var(--headline-line-height)] whitespace-nowrap [font-style:var(--headline-font-style)]">
                    {item.price}
                  </div>
                </div>
                <div className="relative flex items-center self-stretch font-label-small font-[number:var(--label-small-font-weight)] text-[#11111170] text-[length:var(--label-small-font-size)] tracking-[var(--label-small-letter-spacing)] leading-[var(--label-small-line-height)] [font-style:var(--label-small-font-style)]">
                  {item.direct ? "직거래 매물" : "중개 매물"}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="all-[unset] box-border flex flex-col items-center justify-center px-6 py-3 relative flex-1 grow bg-zinc-800 rounded-xl overflow-hidden cursor-pointer"
              aria-label="채팅하기"
              onClick={() => recordChatClick(item.id)}
            >
              <div className="inline-flex px-0 py-0.5 flex-[0_0_auto] flex-col items-start relative">
                <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                  <div className="inline-flex items-center justify-center relative flex-[0_0_auto]">
                    <div className="relative w-fit mt-[-1.00px] font-label-large font-[number:var(--label-large-font-weight)] text-white text-[length:var(--label-large-font-size)] tracking-[var(--label-large-letter-spacing)] leading-[var(--label-large-line-height)] whitespace-nowrap [font-style:var(--label-large-font-style)]">
                      채팅하기
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="absolute w-full h-full top-0 left-0"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
        <div
          className="h-[34px] self-stretch w-full flex flex-col items-center justify-center relative"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center justify-center relative self-stretch w-full flex-[0_0_auto]" />
        </div>
      </footer>
    </main>
  );
};
