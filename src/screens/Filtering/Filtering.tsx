import { useState } from "react";
import { FilterActionSection } from "./sections/FilterActionSection";
import { FilterControlsSection } from "./sections/FilterControlsSection";
import type { FilterDraft } from "./sections/FilterControlsSection/FilterControlsSection";

export const Filtering = ({
  onApplyFilters,
}: {
  onApplyFilters: (draft: FilterDraft) => void;
}): JSX.Element => {
  const [resetSignal, setResetSignal] = useState(0);
  const [draft, setDraft] = useState<FilterDraft>({
    activeGroups: [],
    labels: {},
  });

  return (
    <main
      className="flex h-full flex-col items-start relative bg-white"
      data-model-id="4014:29596"
    >
      <header className="inline-flex flex-col items-start relative flex-[0_0_auto] bg-white w-full z-20">
        <div className="w-[375px] h-11 flex flex-col items-center justify-center relative">
          <div className="flex flex-col items-center justify-center relative self-stretch w-full flex-[0_0_auto]" />
        </div>
        <div className="flex w-[375px] items-center justify-around gap-[104px] px-5 py-2 relative flex-[0_0_auto] bg-white">
          <div className="justify-between flex-1 grow flex items-center relative">
            <div className="inline-flex items-center gap-5 relative flex-[0_0_auto]">
              <button
                type="button"
                aria-label="뒤로 가기"
                className="flex-col justify-center inline-flex items-center relative flex-[0_0_auto]"
              >
                <div className="inline-flex flex-col items-center justify-center relative flex-[0_0_auto]">
                  <img
                    className="relative h-6"
                    alt=""
                    aria-hidden="true"
                    src="https://c.animaapp.com/WkbC3lqE/img/--icon-variant--.svg"
                  />
                </div>
                <div className="absolute w-[calc(100%_+_16px)] h-[calc(100%_+_16px)] -top-2 -left-2 rounded-full" />
              </button>
            </div>
            <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
              <div className="inline-flex items-center gap-1 px-0 py-0.5 relative flex-[0_0_auto]">
                <h1 className="relative w-fit mt-[-1.00px] font-headline font-[number:var(--headline-font-weight)] text-zinc-800 text-[length:var(--headline-font-size)] tracking-[var(--headline-letter-spacing)] leading-[var(--headline-line-height)] whitespace-nowrap [font-style:var(--headline-font-style)]">
                  필터
                </h1>
              </div>
            </div>
            <div className="relative w-6 h-6" aria-hidden="true" />
          </div>
          <div className="absolute w-full left-0 bottom-0 h-px bg-[#71717a38] opacity-[0.61]" />
        </div>
      </header>
      <FilterControlsSection resetSignal={resetSignal} onDraftChange={setDraft} />
      <FilterActionSection
        onReset={() => {
          setResetSignal((current) => current + 1);
        }}
        onApply={() => {
          onApplyFilters(draft);
        }}
      />
    </main>
  );
};
