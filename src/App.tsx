import { MouseEvent, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { fallbackEstate, type EstateItem } from "./data/estateData";
import { recordCardClick } from "./data/estateStats";
import { Estate } from "./screens/Estate";
import { Filtering } from "./screens/Filtering";
import type { FilterDraft } from "./screens/Filtering/sections/FilterControlsSection/FilterControlsSection";
import { Home } from "./screens/Home";
import { Product } from "./screens/Product";

const PAGE_LABELS: Record<string, string> = {
  "/": "홈",
  "/estate": "부동산",
  "/filter": "필터",
  "/product": "매물 상세",
};

const AppShell = (): JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [activeFilters, setActiveFilters] = useState<FilterDraft>({
    activeGroups: [],
    labels: {},
  });
  const [selectedEstate, setSelectedEstate] = useState<EstateItem>(fallbackEstate);

  const openEstate = (item: EstateItem) => {
    setSelectedEstate(item);
    recordCardClick(item.id);
    navigate("/product");
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const button = target.closest("button");
    const label = button?.getAttribute("aria-label") ?? "";
    const text = button?.textContent?.trim() ?? "";

    if (button && (label === "홈" || (pathname === "/" && text === "전체"))) {
      navigate("/");
      return;
    }

    if (button && (text === "부동산" || label === "내 근처")) {
      navigate("/estate");
      return;
    }

    if (pathname === "/estate" && button && label.endsWith("필터")) {
      navigate("/filter");
      return;
    }

    if (pathname === "/estate" && target.closest('[aria-label="매물 목록"] article')) {
      navigate("/product");
      return;
    }

    if (
      pathname === "/estate" &&
      target.closest('[aria-labelledby="recommended-estates-heading"] article')
    ) {
      navigate("/product");
      return;
    }

    if (button && (label === "뒤로 가기" || label === "닫기")) {
      navigate(pathname === "/filter" || pathname === "/product" ? "/estate" : "/");
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f2f3f5] text-zinc-900" onClick={handleClick}>
      <div className="mx-auto flex h-screen w-full max-w-[430px] items-start justify-center bg-[#f2f3f5]">
        <div
          className="relative h-[min(812px,100vh)] w-[375px] overflow-hidden bg-white shadow-[0_24px_80px_rgba(17,17,17,0.18)]"
          aria-label={`${PAGE_LABELS[pathname] ?? "당근"} 모바일 화면`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/estate"
              element={
                <Estate
                  activeFilters={activeFilters}
                  onResetFilters={() => setActiveFilters({ activeGroups: [], labels: {} })}
                  onOpenEstate={openEstate}
                />
              }
            />
            <Route
              path="/filter"
              element={
                <Filtering
                  onApplyFilters={(draft) => {
                    setActiveFilters(draft);
                    navigate("/estate");
                  }}
                />
              }
            />
            <Route path="/product" element={<Product item={selectedEstate} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export const App = (): JSX.Element => {
  return <AppShell />;
};
