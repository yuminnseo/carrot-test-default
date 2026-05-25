const listings = [
  {
    id: 1,
    title: "테니스 채",
    location: "당근동",
    distance: "1km",
    time: "1시간 전",
    price: "20,000",
    image: "https://c.animaapp.com/AVxPi6PT/img/picture@2x.png",
    imageAlt: "테니스 채 상품 이미지",
    comments: "0",
    likes: "4",
    imageClassName:
      "absolute w-full top-[calc(50.00%_-_52px)] left-0 h-[104px] aspect-[1]",
  },
  {
    id: 2,
    title: "에어팟 pro",
    location: "당근동",
    distance: "2km",
    time: "2시간 전",
    price: "40,000",
    image: "https://c.animaapp.com/AVxPi6PT/img/picture-1@2x.png",
    imageAlt: "에어팟 pro 상품 이미지",
    comments: "3",
    likes: "12",
    imageClassName:
      "absolute w-full top-[calc(50.00%_-_52px)] left-0 h-[104px] aspect-[1]",
  },
  {
    id: 3,
    title: "빈티지 디카",
    location: "당근동",
    distance: "3km",
    time: "4시간 전",
    price: "30,000",
    image: "https://c.animaapp.com/AVxPi6PT/img/picture-2@2x.png",
    imageAlt: "빈티지 디카 상품 이미지",
    comments: "0",
    likes: "1",
    imageClassName:
      "absolute w-full top-[calc(50.00%_-_52px)] left-0 h-[104px] aspect-[1]",
  },
  {
    id: 4,
    title: "픽시 자전거",
    location: "당근동",
    distance: "2km",
    time: "4시간 전",
    price: "180,000",
    image: "https://c.animaapp.com/AVxPi6PT/img/picture-3@2x.png",
    imageAlt: "픽시 자전거 상품 이미지",
    comments: "2",
    likes: "2",
    imageClassName:
      "absolute w-full top-[calc(50.00%_-_52px)] left-0 h-[104px] aspect-[1]",
  },
  {
    id: 5,
    title: "소파",
    location: "당근동",
    distance: "2km",
    time: "1일 전",
    price: "90,000",
    image: "https://c.animaapp.com/AVxPi6PT/img/picture-4@2x.png",
    imageAlt: "소파 상품 이미지",
    comments: "2",
    likes: "2",
    imageClassName:
      "object-cover absolute w-full top-[calc(50.00%_-_52px)] left-0 h-[104px] aspect-[1]",
  },
];

export const ListingFeedSection = (): JSX.Element => {
  return (
    <section
      aria-label="중고거래 상품 목록"
      className="flex items-start px-5 py-2 relative flex-1 self-stretch w-full grow"
    >
      <div className="flex flex-col items-start gap-4 relative flex-1 grow mb-[-111.00px]">
        {listings.map((listing, index) => (
          <article
            key={listing.id}
            className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]"
          >
            <div className="flex items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative w-[104px] h-[104px] bg-zinc-100 rounded-lg overflow-hidden shrink-0">
                <img
                  className={listing.imageClassName}
                  alt={listing.imageAlt}
                  src={listing.image}
                  loading="lazy"
                />
              </div>
              <div className="flex px-0 py-0.5 flex-1 grow flex-col items-start relative min-w-0">
                <div className="flex flex-col items-start justify-between relative flex-1 self-stretch w-full grow min-h-[100px]">
                  <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto] gap-3">
                    <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto] min-w-0">
                      <h3 className="flex w-fit mt-[-1.00px] font-headline font-[number:var(--headline-font-weight)] text-zinc-800 text-[length:var(--headline-font-size)] tracking-[var(--headline-letter-spacing)] leading-[var(--headline-line-height)] whitespace-nowrap items-center relative [font-style:var(--headline-font-style)]">
                        {listing.title}
                      </h3>
                      <div
                        aria-label={`${listing.location}, ${listing.distance}, ${listing.time}`}
                        className="inline-flex items-start gap-0.5 relative flex-[0_0_auto]"
                      >
                        <span className="relative flex items-center w-fit mt-[-1.00px] font-caption-medium font-[number:var(--caption-medium-font-weight)] text-[#11111170] text-[length:var(--caption-medium-font-size)] tracking-[var(--caption-medium-letter-spacing)] leading-[var(--caption-medium-line-height)] whitespace-nowrap [font-style:var(--caption-medium-font-style)]">
                          {listing.location}
                        </span>
                        <span
                          aria-hidden="true"
                          className="relative flex items-center w-fit mt-[-1.00px] font-caption-medium font-[number:var(--caption-medium-font-weight)] text-[#11111170] text-[length:var(--caption-medium-font-size)] tracking-[var(--caption-medium-letter-spacing)] leading-[var(--caption-medium-line-height)] whitespace-nowrap [font-style:var(--caption-medium-font-style)]"
                        >
                          ·
                        </span>
                        <span className="relative flex items-center w-fit mt-[-1.00px] font-caption-medium font-[number:var(--caption-medium-font-weight)] text-[#11111170] text-[length:var(--caption-medium-font-size)] tracking-[var(--caption-medium-letter-spacing)] leading-[var(--caption-medium-line-height)] whitespace-nowrap [font-style:var(--caption-medium-font-style)]">
                          {listing.distance}
                        </span>
                        <span
                          aria-hidden="true"
                          className="relative flex items-center w-fit mt-[-1.00px] font-caption-medium font-[number:var(--caption-medium-font-weight)] text-[#11111170] text-[length:var(--caption-medium-font-size)] tracking-[var(--caption-medium-letter-spacing)] leading-[var(--caption-medium-line-height)] whitespace-nowrap [font-style:var(--caption-medium-font-style)]"
                        >
                          ·
                        </span>
                        <span className="relative flex items-center w-fit mt-[-1.00px] font-caption-medium font-[number:var(--caption-medium-font-weight)] text-[#11111170] text-[length:var(--caption-medium-font-size)] tracking-[var(--caption-medium-letter-spacing)] leading-[var(--caption-medium-line-height)] whitespace-nowrap [font-style:var(--caption-medium-font-style)]">
                          {listing.time}
                        </span>
                      </div>
                      <p className="inline-flex items-start gap-0.5 relative flex-[0_0_auto]">
                        <span className="relative flex items-center w-fit mt-[-1.00px] font-label-large font-[number:var(--label-large-font-weight)] text-[#111111cc] text-[length:var(--label-large-font-size)] tracking-[var(--label-large-letter-spacing)] leading-[var(--label-large-line-height)] whitespace-nowrap [font-style:var(--label-large-font-style)]">
                          {listing.price}
                        </span>
                        <span className="relative flex items-center w-fit mt-[-1.00px] font-label-large font-[number:var(--label-large-font-weight)] text-[#111111cc] text-[length:var(--label-large-font-size)] tracking-[var(--label-large-letter-spacing)] leading-[var(--label-large-line-height)] whitespace-nowrap [font-style:var(--label-large-font-style)]">
                          원
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`${listing.title} 더보기`}
                      className="relative flex-[0_0_auto] h-5 shrink-0 cursor-pointer"
                    >
                      <img
                        className="relative flex-[0_0_auto] h-5"
                        alt=""
                        aria-hidden="true"
                        src="https://c.animaapp.com/AVxPi6PT/img/icon-normal-more-vertical-4.svg"
                      />
                    </button>
                  </div>
                  <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
                    <div className="relative flex-1 grow h-3" />
                    <div
                      aria-label={`댓글 ${listing.comments}개, 관심 ${listing.likes}개`}
                      className="inline-flex items-center gap-1 relative flex-[0_0_auto]"
                    >
                      <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                        <img
                          className="relative flex-[0_0_auto] h-3"
                          alt=""
                          aria-hidden="true"
                          src="https://c.animaapp.com/AVxPi6PT/img/icon-normal-bubble-4.svg"
                        />
                        <span className="relative flex items-center w-fit mt-[-1.00px] font-caption-small font-[number:var(--caption-small-font-weight)] text-[#11111170] text-[length:var(--caption-small-font-size)] tracking-[var(--caption-small-letter-spacing)] leading-[var(--caption-small-line-height)] whitespace-nowrap [font-style:var(--caption-small-font-style)]">
                          {listing.comments}
                        </span>
                      </div>
                      <span
                        aria-hidden="true"
                        className="relative flex items-center w-fit mt-[-1.00px] font-caption-small font-[number:var(--caption-small-font-weight)] text-[#11111170] text-[length:var(--caption-small-font-size)] tracking-[var(--caption-small-letter-spacing)] leading-[var(--caption-small-line-height)] whitespace-nowrap [font-style:var(--caption-small-font-style)]"
                      >
                        ·
                      </span>
                      <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                        <img
                          className="relative flex-[0_0_auto] h-3"
                          alt=""
                          aria-hidden="true"
                          src="https://c.animaapp.com/AVxPi6PT/img/icon-normal-heart-4.svg"
                        />
                        <span className="relative flex items-center w-fit mt-[-1.00px] font-caption-small font-[number:var(--caption-small-font-weight)] text-[#11111170] text-[length:var(--caption-small-font-size)] tracking-[var(--caption-small-letter-spacing)] leading-[var(--caption-small-line-height)] whitespace-nowrap [font-style:var(--caption-small-font-style)]">
                          {listing.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`relative self-stretch w-full h-px bg-[#71717a38] opacity-[0.61] ${
                index === listings.length - 1 ? "mt-4" : "mt-4"
              }`}
            />
          </article>
        ))}
      </div>
    </section>
  );
};
