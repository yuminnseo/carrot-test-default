const navigationItems = [
  {
    key: "home",
    label: "홈",
    iconAlt: "Icon home",
    iconSrc: "https://c.animaapp.com/AVxPi6PT/img/icon-home.svg",
    current: true,
  },
  {
    key: "community",
    label: "동네생활",
    iconAlt: "Icon community",
    iconSrc: "https://c.animaapp.com/AVxPi6PT/img/icon-community.svg",
    current: false,
  },
  {
    key: "near-me",
    label: "내 근처",
    iconAlt: "Icon near me",
    iconSrc: "https://c.animaapp.com/AVxPi6PT/img/icon-near-me.svg",
    current: false,
  },
  {
    key: "chatting",
    label: "채팅",
    iconAlt: "Icon chatting",
    iconSrc: "https://c.animaapp.com/AVxPi6PT/img/icon-chatting.svg",
    current: false,
  },
  {
    key: "profile",
    label: "나의 당근",
    iconAlt: "Icon profile",
    iconSrc: "https://c.animaapp.com/AVxPi6PT/img/icon-profile.svg",
    current: false,
  },
];

export const PrimaryNavigationSection = (): JSX.Element => {
  return (
    <footer
      className="inline-flex flex-col items-center justify-end relative flex-[0_0_auto]"
      aria-label="하단 내비게이션"
    >
      <nav
        className="relative w-[375px] h-14 bg-theme-lightsemanticpaper-default"
        aria-label="주요 탐색"
      >
        <div className="absolute top-0 left-0 w-[375px] h-px bg-theme-lightsemanticdivider-3" />
        <ul className="flex w-[375px] items-start justify-between px-2 py-0 absolute top-0 right-0 list-none m-0">
          {navigationItems.map((item) => (
            <li
              key={item.key}
              className="inline-flex flex-col items-center gap-[3px] pt-0 pb-1.5 px-0 relative flex-[0_0_auto]"
            >
              <button
                type="button"
                className="inline-flex flex-col items-center gap-[3px] pt-0 pb-0 px-0 relative flex-[0_0_auto] cursor-pointer"
                aria-current={item.current ? "page" : undefined}
                aria-label={item.label}
              >
                <div className="relative w-[60px] h-8">
                  <img
                    className="absolute top-2 left-[18px] w-6 h-6"
                    alt={item.iconAlt}
                    src={item.iconSrc}
                  />
                </div>
                <div
                  className={`w-[60px] relative flex items-center justify-center h-[15px] font-platform-label5-regular font-[number:var(--platform-label5-regular-font-weight)] text-[#212124] text-[length:var(--platform-label5-regular-font-size)] text-center tracking-[var(--platform-label5-regular-letter-spacing)] leading-[var(--platform-label5-regular-line-height)] whitespace-nowrap [font-style:var(--platform-label5-regular-font-style)] ${
                    item.key === "home" ? "self-stretch" : ""
                  }`}
                >
                  {item.label}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="relative w-[375px] h-[34px] bg-white" aria-hidden="true">
        <div className="absolute left-[calc(50.00%_-_68px)] bottom-[7px] w-[136px] h-[7px] bg-theme-lightscalegray-900 rounded-[100px]" />
      </div>
    </footer>
  );
};
