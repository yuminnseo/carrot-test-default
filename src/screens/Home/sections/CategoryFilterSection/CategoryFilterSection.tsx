const categories = [
  { id: "all", label: "전체", active: true, hasIcon: false },
  { id: "real-estate", label: "부동산", active: false, hasIcon: true },
  { id: "nearby", label: "가까운 동네", active: false, hasIcon: false },
  { id: "recent", label: "방금 전", active: false, hasIcon: false },
  { id: "used-cars", label: "중고차", active: false, hasIcon: true },
];

export const CategoryFilterSection = (): JSX.Element => {
  return (
    <section
      aria-label="카테고리 필터"
      className="flex flex-col items-start px-5 py-3 relative self-stretch w-full flex-[0_0_auto]"
    >
      <div
        className="flex w-[335px] items-center gap-2 relative flex-[0_0_auto] overflow-x-scroll whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-orientation="horizontal"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={category.active}
            className="inline-flex flex-col items-start px-3 py-2 relative flex-[0_0_auto] rounded-full"
          >
            <div
              className={`absolute w-full h-full top-0 left-0 rounded-full ${
                category.active ? "bg-zinc-800" : "bg-[#71717a0d]"
              }`}
            />
            <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
              <span className="inline-flex items-center justify-center px-0 py-0.5 relative flex-[0_0_auto]">
                <span
                  className={`relative w-fit mt-[-1.00px] font-body-small font-[number:var(--body-small-font-weight)] text-[length:var(--body-small-font-size)] tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] whitespace-nowrap [font-style:var(--body-small-font-style)] ${
                    category.active ? "text-white" : "text-[#111111cc]"
                  }`}
                >
                  {category.label}
                </span>
              </span>
              {category.hasIcon && (
                <span className="self-stretch inline-flex items-center relative flex-[0_0_auto]">
                  <span className="inline-flex flex-col items-center justify-center relative flex-[0_0_auto]">
                    <img
                      className="relative h-4"
                      alt=""
                      aria-hidden="true"
                      src="https://c.animaapp.com/AVxPi6PT/img/icon-normal-arrow-up-right-1.svg"
                    />
                  </span>
                </span>
              )}
            </div>
            <div className="absolute w-full h-full top-0 left-0 rounded-full" />
          </button>
        ))}
      </div>
    </section>
  );
};
