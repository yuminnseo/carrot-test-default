const actionButtons = [
  {
    type: "button",
    label: "초기화",
    variant: "secondary",
    icon: "https://c.animaapp.com/WkbC3lqE/img/--icon-variant---1.svg",
    widthClass: "w-auto",
  },
  {
    type: "submit",
    label: "10개 매물 보기",
    variant: "primary",
    widthClass: "flex-1 grow",
  },
] as const;

export const FilterActionSection = ({
  onApply,
  onReset,
}: {
  onApply: () => void;
  onReset: () => void;
}): JSX.Element => {
  return (
    <section
      className="flex flex-col w-[375px] items-start relative z-20 flex-[0_0_auto] bg-white"
      aria-label="필터 액션"
    >
      <div className="p-5 self-stretch w-full flex-[0_0_auto] flex items-center relative">
        <div className="flex w-[335px] items-center gap-2 relative">
          {actionButtons.map((button) =>
            button.variant === "secondary" ? (
              <button
                key={button.label}
                type={button.type}
                className="flex-col px-6 py-3 rounded-xl overflow-hidden inline-flex items-center justify-center relative flex-[0_0_auto]"
                aria-label={button.label}
                onClick={onReset}
              >
                <div className="bg-[#71717a14] absolute w-full h-full top-0 left-0" />
                <div className="inline-flex px-0 py-0.5 flex-[0_0_auto] flex-col items-start relative">
                  <div className="inline-flex gap-1 items-center relative flex-[0_0_auto]">
                    <div className="flex-col justify-center inline-flex items-center relative flex-[0_0_auto]">
                      <img
                        className="relative h-5"
                        alt=""
                        aria-hidden="true"
                        src={button.icon}
                      />
                    </div>
                    <div className="inline-flex items-center justify-center relative flex-[0_0_auto]">
                      <div className="font-label-large font-[number:var(--label-large-font-weight)] text-zinc-800 text-[length:var(--label-large-font-size)] leading-[var(--label-large-line-height)] relative w-fit mt-[-1.00px] tracking-[var(--label-large-letter-spacing)] whitespace-nowrap [font-style:var(--label-large-font-style)]">
                        {button.label}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute w-full h-full top-0 left-0" />
              </button>
            ) : (
              <button
                key={button.label}
                type={button.type}
                className="all-[unset] box-border flex flex-col items-center justify-center px-6 py-3 relative flex-1 grow bg-zinc-800 rounded-xl overflow-hidden cursor-pointer"
                aria-label={button.label}
                onClick={onApply}
              >
                <div className="inline-flex px-0 py-0.5 flex-[0_0_auto] flex-col items-start relative">
                  <div className="inline-flex gap-1 items-center relative flex-[0_0_auto]">
                    <div className="inline-flex items-center justify-center relative flex-[0_0_auto]">
                      <div className="font-label-large font-[number:var(--label-large-font-weight)] text-white text-[length:var(--label-large-font-size)] leading-[var(--label-large-line-height)] relative w-fit mt-[-1.00px] tracking-[var(--label-large-letter-spacing)] whitespace-nowrap [font-style:var(--label-large-font-style)]">
                        {button.label}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute w-full h-full top-0 left-0" />
              </button>
            ),
          )}
        </div>
      </div>
      <div
        className="h-[34px] self-stretch w-full flex flex-col items-center justify-center relative"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center justify-center relative self-stretch w-full flex-[0_0_auto]" />
      </div>
    </section>
  );
};
