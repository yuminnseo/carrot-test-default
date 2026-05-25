import { CategoryFilterSection } from "./sections/CategoryFilterSection";
import { ListingFeedSection } from "./sections/ListingFeedSection";
import { LocationActionTopBarSection } from "./sections/LocationActionTopBarSection";
import { PrimaryNavigationSection } from "./sections/PrimaryNavigationSection";

export const Home = (): JSX.Element => {
  return (
    <main
      className="flex h-full w-[375px] flex-col items-start relative bg-white overflow-hidden"
      data-model-id="4014:29687"
      aria-label="홈 화면"
    >
      <div
        className="flex flex-col w-[375px] h-11 items-center justify-center relative shrink-0"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center justify-center relative self-stretch w-full flex-[0_0_auto]" />
      </div>
      <LocationActionTopBarSection />
      <CategoryFilterSection />
      <section
        className="scrollbar-hidden flex min-h-0 flex-1 flex-col items-start self-stretch w-full overflow-y-scroll"
        aria-label="목록 피드"
      >
        <ListingFeedSection />
      </section>
      <PrimaryNavigationSection />
      <button
        type="button"
        className="inline-flex flex-col items-center justify-center pl-4 pr-5 py-3 absolute right-5 bottom-[110px] bg-[#fe6f0f] rounded-full overflow-hidden shadow-shadow-200 cursor-pointer"
        aria-label="글쓰기"
      >
        <span className="inline-flex flex-[0_0_auto] flex-col items-start relative">
          <span className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
            <span className="inline-flex flex-col items-center justify-center relative flex-[0_0_auto]">
              <img
                className="relative h-4"
                alt=""
                src="https://c.animaapp.com/AVxPi6PT/img/--icon-variant---4.svg"
              />
            </span>
            <span className="inline-flex items-center justify-center relative flex-[0_0_auto]">
              <span className="relative w-fit mt-[-1.00px] font-label-medium font-[number:var(--label-medium-font-weight)] text-white text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] whitespace-nowrap [font-style:var(--label-medium-font-style)]">
                글쓰기
              </span>
            </span>
          </span>
        </span>
        <span
          className="absolute w-full h-full top-0 left-0"
          aria-hidden="true"
        />
      </button>
    </main>
  );
};
