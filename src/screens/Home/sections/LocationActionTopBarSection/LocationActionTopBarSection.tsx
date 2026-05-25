const actionIcons = [
  {
    src: "https://c.animaapp.com/AVxPi6PT/img/--icon-variant---1.svg",
    alt: "검색",
    label: "검색",
  },
  {
    src: "https://c.animaapp.com/AVxPi6PT/img/--icon-variant---2.svg",
    alt: "글쓰기",
    label: "글쓰기",
  },
  {
    src: "https://c.animaapp.com/AVxPi6PT/img/--icon-variant---3.svg",
    alt: "메뉴",
    label: "메뉴",
  },
];

export const LocationActionTopBarSection = (): JSX.Element => {
  return (
    <header className="relative flex w-[375px] flex-[0_0_auto] items-center justify-around gap-[104px] px-5 py-1.5">
      <div className="relative flex flex-1 grow items-center justify-between">
        <button
          type="button"
          className="relative inline-flex flex-[0_0_auto] items-center gap-1"
          aria-label="현재 지역 당근동, 인근 지역 단추동"
        >
          <span className="relative inline-flex flex-[0_0_auto] flex-col items-center justify-center">
            <img
              className="relative h-6"
              alt=""
              src="https://c.animaapp.com/AVxPi6PT/img/--icon-variant--.svg"
            />
          </span>
          <span className="relative inline-flex flex-[0_0_auto] items-center gap-2">
            <span className="relative inline-flex flex-[0_0_auto] items-center gap-3">
              <span className="relative inline-flex flex-[0_0_auto] items-center gap-1 px-0 py-0.5">
                <span className="relative mt-[-1.00px] w-fit whitespace-nowrap font-title-small text-[length:var(--title-small-font-size)] font-[number:var(--title-small-font-weight)] leading-[var(--title-small-line-height)] tracking-[var(--title-small-letter-spacing)] text-zinc-800 [font-style:var(--title-small-font-style)]">
                  당근동
                </span>
              </span>
            </span>
            <span className="relative inline-flex flex-[0_0_auto] items-center gap-3 px-0 py-0.5">
              <span className="relative inline-flex flex-[0_0_auto] items-center gap-1 px-0 py-0.5">
                <span className="relative mt-[-1.00px] w-fit whitespace-nowrap font-headline text-[length:var(--headline-font-size)] font-[number:var(--headline-font-weight)] leading-[var(--headline-line-height)] tracking-[var(--headline-letter-spacing)] text-[#11111138] [font-style:var(--headline-font-style)]">
                  단추동
                </span>
              </span>
            </span>
          </span>
        </button>
        <nav
          className="relative inline-flex flex-[0_0_auto] self-stretch items-center gap-3"
          aria-label="상단 작업"
        >
          {actionIcons.map((icon) => (
            <button
              key={icon.label}
              type="button"
              className="relative inline-flex flex-[0_0_auto] flex-col items-center justify-center"
              aria-label={icon.label}
              title={icon.label}
            >
              <span className="relative inline-flex flex-[0_0_auto] flex-col items-center justify-center">
                <img className="relative h-6" alt="" src={icon.src} />
              </span>
              <span className="absolute -left-2 -top-2 h-[calc(100%_+_16px)] w-[calc(100%_+_16px)] rounded-full" />
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
