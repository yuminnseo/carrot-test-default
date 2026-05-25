import { useCallback, useEffect, useId, useRef, useState } from "react";
import type {
  Dispatch,
  MouseEvent as ReactMouseEvent,
  PointerEvent,
  SetStateAction,
} from "react";

type ChipOption = {
  label: string;
  selected?: boolean;
};

type RangeFilter = {
  id: string;
  label: string;
  valueLabel?: string;
  marks: string[];
};

export type FilterDraft = {
  activeGroups: string[];
  labels: Record<string, string>;
};

type RangeSelection = {
  isDefault: boolean;
  valueLabel: string;
};

const propertyTypes: ChipOption[] = [
  { label: "원룸" },
  { label: "빌라(투룸 이상)" },
  { label: "오피스텔" },
  { label: "아파트" },
  { label: "상가" },
  { label: "주택" },
  { label: "사무실" },
  { label: "건물" },
  { label: "공장/창고" },
  { label: "토지" },
];

const transactionTypes: ChipOption[] = [
  { label: "전체", selected: true },
  { label: "월세" },
  { label: "전세" },
  { label: "매매" },
  { label: "단기" },
];

const dealMethods: ChipOption[] = [
  { label: "전체", selected: true },
  { label: "직거래 매물" },
  { label: "공인중개사 매물" },
];

const floorOptions: ChipOption[] = [
  { label: "반지하" },
  { label: "1층" },
  { label: "2~5층" },
  { label: "6~9층" },
  { label: "10층 이상" },
];

const approvalDateOptions: ChipOption[] = [
  { label: "2년 이내" },
  { label: "5년 이내" },
  { label: "10년 이내" },
  { label: "15년 이내" },
  { label: "15년 이상" },
];

const propertyConditions: ChipOption[] = [
  { label: "주차 가능" },
  { label: "반려동물 가능" },
  { label: "대출 가능" },
  { label: "엘리베이터" },
  { label: "옥탑" },
  { label: "복층" },
  { label: "즉시 입주 가능" },
];

const priceRanges: RangeFilter[] = [
  {
    id: "deposit",
    label: "보증금",
    valueLabel: "전체",
    marks: ["0", "1억", "10억", "20억~"],
  },
  {
    id: "monthly-rent",
    label: "월세",
    valueLabel: "전체",
    marks: ["0", "150만", "300만~"],
  },
  {
    id: "sale-price",
    label: "매매가",
    valueLabel: "전체",
    marks: ["0", "10억", "20억", "40억~"],
  },
];

const areaRange: RangeFilter = {
  id: "area",
  label: "면적",
  marks: ["0", "35평", "70평~"],
};

const chipBaseClass =
  "relative inline-flex flex-[0_0_auto] cursor-pointer flex-col items-start px-3 py-2 transition-colors";
const chipTextBaseClass =
  "relative w-fit mt-[-1.00px] whitespace-nowrap font-body-small font-[number:var(--body-small-font-weight)] text-[length:var(--body-small-font-size)] leading-[var(--body-small-line-height)] tracking-[var(--body-small-letter-spacing)] [font-style:var(--body-small-font-style)]";

function Chip({
  label,
  selected = false,
  onToggle,
}: {
  label: string;
  selected?: boolean;
  onToggle?: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={chipBaseClass}
    >
      <div
        className={`absolute left-0 top-0 h-full w-full rounded-full border border-solid ${
          selected
            ? "border-zinc-800 bg-[#71717a0d]"
            : "border-[#71717a29] bg-transparent"
        }`}
      />
      <div className="relative inline-flex flex-[0_0_auto] items-center gap-1">
        <div className="relative inline-flex flex-[0_0_auto] items-center justify-center px-0 py-0.5">
          <div
            className={`${chipTextBaseClass} ${
              selected ? "text-zinc-800" : "text-[#111111cc]"
            }`}
          >
            {label}
          </div>
        </div>
      </div>
      <div className="absolute left-0 top-0 h-full w-full rounded-full" />
    </button>
  );
}

function SectionDivider() {
  return (
    <div className="relative h-px w-full self-stretch bg-[#71717a38] opacity-[0.52]" />
  );
}

function SectionTitle({ title, helper }: { title: string; helper?: string }) {
  return (
    <div className="relative flex w-full flex-[0_0_auto] items-center justify-between self-stretch">
      <div className="relative inline-flex flex-[0_0_auto] items-center gap-2">
        <div className="relative inline-flex flex-[0_0_auto] items-center gap-1.5">
          <div className="relative mt-[-1.00px] w-fit whitespace-nowrap font-headline font-[number:var(--headline-font-weight)] text-[length:var(--headline-font-size)] leading-[var(--headline-line-height)] tracking-[var(--headline-letter-spacing)] text-zinc-800 [font-style:var(--headline-font-style)]">
            {title}
          </div>
        </div>
        {helper ? (
          <div className="relative inline-flex flex-[0_0_auto] items-center justify-center px-0 pb-0 pt-0.5">
            <div className="relative mt-[-1.00px] w-fit whitespace-nowrap font-caption-medium font-[number:var(--caption-medium-font-weight)] text-[length:var(--caption-medium-font-size)] leading-[var(--caption-medium-line-height)] tracking-[var(--caption-medium-letter-spacing)] text-[#11111170] [font-style:var(--caption-medium-font-style)]">
              {helper}
            </div>
          </div>
        ) : null}
      </div>
      <div className="relative h-5 w-[110px]" />
    </div>
  );
}

function RangeControl({
  filter,
  onRangeChange,
  resetSignal,
}: {
  filter: RangeFilter;
  onRangeChange: (id: string, selection: RangeSelection) => void;
  resetSignal: number;
}) {
  const labelId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [minIndex, setMinIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(filter.marks.length - 1);
  const [draggingThumb, setDraggingThumb] = useState<"min" | "max" | null>(
    null,
  );
  const maxStep = filter.marks.length - 1;
  const minPercent = (minIndex / maxStep) * 100;
  const maxPercent = (maxIndex / maxStep) * 100;
  const thumbRadius = 6;
  const rangeStartLabel = filter.marks[minIndex];
  const rangeEndLabel = filter.marks[maxIndex].replace(/~$/, "");
  const valueLabel =
    minIndex === 0 && maxIndex === maxStep
      ? "전체"
      : `${rangeStartLabel}~${rangeEndLabel}`;

  useEffect(() => {
    setMinIndex(0);
    setMaxIndex(maxStep);
    setDraggingThumb(null);
  }, [maxStep, resetSignal]);

  useEffect(() => {
    onRangeChange(filter.id, {
      isDefault: minIndex === 0 && maxIndex === maxStep,
      valueLabel,
    });
  }, [filter.id, maxIndex, maxStep, minIndex, onRangeChange, valueLabel]);

  const updateRangeFromClientX = (clientX: number, thumb?: "min" | "max") => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const rect = track.getBoundingClientRect();
    const usableLeft = rect.left + thumbRadius;
    const usableWidth = rect.width - thumbRadius * 2;
    const percent = Math.min(
      1,
      Math.max(0, (clientX - usableLeft) / usableWidth),
    );
    const nextIndex = Math.round(percent * maxStep);
    const activeThumb =
      thumb ??
      draggingThumb ??
      (Math.abs(nextIndex - minIndex) <= Math.abs(nextIndex - maxIndex)
        ? "min"
        : "max");

    if (activeThumb === "min") {
      setMinIndex(Math.min(nextIndex, maxIndex));
      return;
    }

    setMaxIndex(Math.max(nextIndex, minIndex));
  };

  const beginDrag = (
    clientX: number,
    capture?: { setPointerCapture: (pointerId: number) => void },
    pointerId?: number,
  ) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const rect = track.getBoundingClientRect();
    const usableLeft = rect.left + thumbRadius;
    const usableWidth = rect.width - thumbRadius * 2;
    const percent = Math.min(
      1,
      Math.max(0, (clientX - usableLeft) / usableWidth),
    );
    const nextIndex = Math.round(percent * maxStep);
    const nextThumb =
      Math.abs(nextIndex - minIndex) <= Math.abs(nextIndex - maxIndex)
        ? "min"
        : "max";

    if (capture && pointerId !== undefined) {
      capture.setPointerCapture(pointerId);
    }

    setDraggingThumb(nextThumb);
    updateRangeFromClientX(clientX, nextThumb);
  };

  return (
    <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-2 self-stretch">
      <div className="relative flex w-full flex-[0_0_auto] items-center justify-between self-stretch">
        <div className="relative inline-flex flex-[0_0_auto] items-center gap-1">
          <div className="relative inline-flex flex-[0_0_auto] flex-col items-start px-0 py-0.5">
            <div className="relative inline-flex flex-[0_0_auto] items-center gap-1.5">
              <div
                id={labelId}
                className="relative mt-[-1.00px] w-fit whitespace-nowrap font-label-medium font-[number:var(--label-medium-font-weight)] text-[length:var(--label-medium-font-size)] leading-[var(--label-medium-line-height)] tracking-[var(--label-medium-letter-spacing)] text-zinc-800 [font-style:var(--label-medium-font-style)]"
              >
                {filter.label}
              </div>
            </div>
          </div>
          <div className="relative inline-flex flex-[0_0_auto] items-center justify-center px-0 py-0.5">
            <div className="relative mt-[-1.00px] w-fit whitespace-nowrap font-caption-medium font-[number:var(--caption-medium-font-weight)] text-[length:var(--caption-medium-font-size)] leading-[var(--caption-medium-line-height)] tracking-[var(--caption-medium-letter-spacing)] text-[#11111170] [font-style:var(--caption-medium-font-style)]">
              {valueLabel}
            </div>
          </div>
        </div>
        <div className="relative h-5 w-[110px]" />
      </div>
      <div className="relative flex w-[335px] flex-[0_0_auto] flex-col items-start justify-center gap-2 pb-0 pt-1.5">
        <div
          role="group"
          aria-labelledby={labelId}
          ref={trackRef}
          className="relative h-5 w-[335px] touch-none cursor-pointer"
          onPointerDown={(event) => {
            beginDrag(event.clientX, event.currentTarget, event.pointerId);
          }}
          onPointerMove={(event) => {
            if (draggingThumb) {
              updateRangeFromClientX(event.clientX);
            }
          }}
          onPointerUp={(event) => {
            event.currentTarget.releasePointerCapture(event.pointerId);
            setDraggingThumb(null);
          }}
          onPointerCancel={() => {
            setDraggingThumb(null);
          }}
          onMouseDown={(event: ReactMouseEvent<HTMLDivElement>) => {
            beginDrag(event.clientX);
          }}
          onMouseMove={(event: ReactMouseEvent<HTMLDivElement>) => {
            if (draggingThumb) {
              updateRangeFromClientX(event.clientX);
            }
          }}
          onMouseUp={() => {
            setDraggingThumb(null);
          }}
        >
          <div className="absolute left-1.5 right-1.5 top-1/2 h-1 -translate-y-1/2 rounded-[100px] bg-[#71717a14]" />
          <div
            className="absolute top-1/2 h-1 -translate-y-1/2 rounded-[100px] bg-zinc-800"
            style={{
              left: `calc(6px + (100% - 12px) * ${minPercent / 100})`,
              width: `calc((100% - 12px) * ${(maxPercent - minPercent) / 100})`,
            }}
          />
          <div
            className="absolute top-1/2 flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ left: `calc(6px + (100% - 12px) * ${minPercent / 100})` }}
          >
            <div className="h-3 w-3 rounded-full bg-zinc-800" />
          </div>
          <div
            className="absolute top-1/2 flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ left: `calc(6px + (100% - 12px) * ${maxPercent / 100})` }}
          >
            <div className="h-3 w-3 rounded-full bg-zinc-800" />
          </div>
        </div>
        <div className="relative h-4 w-[335px] flex-[0_0_auto]">
          {filter.marks.map((mark, index) => (
            <div
              key={mark}
              className={`absolute top-[-1px] flex w-fit items-center whitespace-nowrap font-caption-medium font-[number:var(--caption-medium-font-weight)] text-[length:var(--caption-medium-font-size)] leading-[var(--caption-medium-line-height)] tracking-[var(--caption-medium-letter-spacing)] text-[#11111170] [font-style:var(--caption-medium-font-style)] ${
                index === 0
                  ? "translate-x-0"
                  : index === filter.marks.length - 1
                    ? "-translate-x-full"
                    : "-translate-x-1/2"
              }`}
              style={{ left: `${(index / maxStep) * 100}%` }}
            >
              {mark}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const FilterControlsSection = ({
  onDraftChange,
  resetSignal,
}: {
  onDraftChange: (draft: FilterDraft) => void;
  resetSignal: number;
}): JSX.Element => {
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(
    [],
  );
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<
    string[]
  >(["전체"]);
  const [selectedDealMethods, setSelectedDealMethods] = useState<string[]>([
    "전체",
  ]);
  const [selectedFloors, setSelectedFloors] = useState<string[]>([]);
  const [selectedApprovalDates, setSelectedApprovalDates] = useState<string[]>(
    [],
  );
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [rangeSelections, setRangeSelections] = useState<
    Record<string, RangeSelection>
  >({});

  useEffect(() => {
    setSelectedPropertyTypes([]);
    setSelectedTransactionTypes(["전체"]);
    setSelectedDealMethods(["전체"]);
    setSelectedFloors([]);
    setSelectedApprovalDates([]);
    setSelectedConditions([]);
    setRangeSelections({});
  }, [resetSignal]);

  useEffect(() => {
    const selectedTransactionLabels = selectedTransactionTypes.filter(
      (item) => item !== "전체",
    );
    const selectedDealMethodLabels = selectedDealMethods.filter(
      (item) => item !== "전체",
    );
    const changedPriceRanges = priceRanges
      .filter((range) => rangeSelections[range.id]?.isDefault === false)
      .map((range) => `${range.label} ${rangeSelections[range.id].valueLabel}`);

    const activeGroups = [
      selectedPropertyTypes.length > 0 ? "매물 종류" : null,
      selectedTransactionLabels.length > 0 ? "거래 유형" : null,
      changedPriceRanges.length > 0 ? "가격" : null,
      rangeSelections[areaRange.id]?.isDefault === false ? "평수" : null,
      selectedDealMethodLabels.length > 0 ? "거래 방식" : null,
      selectedFloors.length > 0 ? "층수" : null,
      selectedApprovalDates.length > 0 ? "사용승인일" : null,
      selectedConditions.length > 0 ? "기타" : null,
    ].filter((group): group is string => Boolean(group));

    const labels: Record<string, string> = {};

    if (selectedPropertyTypes.length > 0) {
      labels["매물 종류"] = selectedPropertyTypes.join(", ");
    }

    if (selectedTransactionLabels.length > 0) {
      labels["거래 유형"] = selectedTransactionLabels.join(", ");
    }

    if (changedPriceRanges.length > 0) {
      labels["가격"] = changedPriceRanges.join(", ");
    }

    if (rangeSelections[areaRange.id]?.isDefault === false) {
      labels["평수"] = rangeSelections[areaRange.id].valueLabel;
    }

    if (selectedDealMethodLabels.length > 0) {
      labels["거래 방식"] = selectedDealMethodLabels.join(", ");
    }

    if (selectedFloors.length > 0) {
      labels["층수"] = selectedFloors.join(", ");
    }

    if (selectedApprovalDates.length > 0) {
      labels["사용승인일"] = selectedApprovalDates.join(", ");
    }

    if (selectedConditions.length > 0) {
      labels["기타"] = selectedConditions.join(", ");
    }

    onDraftChange({ activeGroups, labels });
  }, [
    onDraftChange,
    rangeSelections,
    selectedApprovalDates,
    selectedConditions,
    selectedDealMethods,
    selectedFloors,
    selectedPropertyTypes,
    selectedTransactionTypes,
  ]);

  const handleRangeChange = useCallback((id: string, selection: RangeSelection) => {
    setRangeSelections((current) => ({
      ...current,
      [id]: selection,
    }));
  }, []);

  const toggleMulti = (
    value: string,
    state: string[],
    setState: Dispatch<SetStateAction<string[]>>,
    hasAllOption = false,
  ) => {
    if (hasAllOption && value === "전체") {
      setState(["전체"]);
      return;
    }

    setState((prev) => {
      const next = prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev.filter((item) => item !== "전체"), value];

      if (hasAllOption && next.length === 0) {
        return ["전체"];
      }

      return next;
    });
  };

  return (
    <section
      aria-label="필터 조건"
      className="scrollbar-hidden relative flex min-h-0 w-[375px] flex-1 flex-col items-start overflow-y-scroll px-5 py-0"
    >
      <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-5 self-stretch px-0 pb-0 pt-5">
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-4 self-stretch px-0 py-2">
          <SectionTitle title="매물 종류" />
          <div className="scrollbar-hidden relative flex w-full flex-[0_0_auto] flex-wrap items-center gap-[8px_8px] self-stretch overflow-x-scroll">
            {propertyTypes.map((option) => (
              <Chip
                key={option.label}
                label={option.label}
                selected={selectedPropertyTypes.includes(option.label)}
                onToggle={() =>
                  toggleMulti(
                    option.label,
                    selectedPropertyTypes,
                    setSelectedPropertyTypes,
                  )
                }
              />
            ))}
          </div>
        </div>
        <SectionDivider />
      </div>
      <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-5 self-stretch px-0 pb-0 pt-5">
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-4 self-stretch px-0 py-2">
          <SectionTitle title="거래 유형" helper="중복 선택 가능" />
          <div className="scrollbar-hidden relative flex w-full flex-[0_0_auto] flex-wrap items-center gap-[8px_8px] self-stretch overflow-x-scroll">
            {transactionTypes.map((option) => (
              <Chip
                key={option.label}
                label={option.label}
                selected={selectedTransactionTypes.includes(option.label)}
                onToggle={() =>
                  toggleMulti(
                    option.label,
                    selectedTransactionTypes,
                    setSelectedTransactionTypes,
                    true,
                  )
                }
              />
            ))}
          </div>
        </div>
        <SectionDivider />
      </div>
      <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-5 self-stretch px-0 pb-0 pt-5">
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-4 self-stretch px-0 py-2">
          <SectionTitle title="가격" />
          <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-5 self-stretch">
            {priceRanges.map((filter) => (
              <RangeControl
                key={filter.id}
                filter={filter}
                onRangeChange={handleRangeChange}
                resetSignal={resetSignal}
              />
            ))}
          </div>
        </div>
        <SectionDivider />
      </div>
      <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-5 self-stretch px-0 pb-0 pt-5">
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-4 self-stretch px-0 py-2">
          <SectionTitle title="면적" />
          <RangeControl
            filter={areaRange}
            onRangeChange={handleRangeChange}
            resetSignal={resetSignal}
          />
        </div>
        <SectionDivider />
      </div>
      <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-5 self-stretch px-0 pb-0 pt-5">
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-4 self-stretch px-0 py-2">
          <SectionTitle title="거래 방식" />
          <div className="scrollbar-hidden relative flex w-full flex-[0_0_auto] flex-wrap items-center gap-[8px_8px] self-stretch overflow-x-scroll">
            {dealMethods.map((option) => (
              <Chip
                key={option.label}
                label={option.label}
                selected={selectedDealMethods.includes(option.label)}
                onToggle={() =>
                  toggleMulti(
                    option.label,
                    selectedDealMethods,
                    setSelectedDealMethods,
                    true,
                  )
                }
              />
            ))}
          </div>
        </div>
        <SectionDivider />
      </div>
      <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-5 self-stretch px-0 pb-0 pt-5">
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-4 self-stretch px-0 py-2">
          <SectionTitle title="층수" />
          <div className="scrollbar-hidden relative flex w-full flex-[0_0_auto] flex-wrap items-center gap-[8px_8px] self-stretch overflow-x-scroll">
            {floorOptions.map((option) => (
              <Chip
                key={option.label}
                label={option.label}
                selected={selectedFloors.includes(option.label)}
                onToggle={() =>
                  toggleMulti(option.label, selectedFloors, setSelectedFloors)
                }
              />
            ))}
          </div>
        </div>
        <SectionDivider />
      </div>
      <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-5 self-stretch px-0 pb-0 pt-5">
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-4 self-stretch px-0 py-2">
          <SectionTitle title="사용승인일" />
          <div className="scrollbar-hidden relative flex w-full flex-[0_0_auto] flex-wrap items-center gap-[8px_8px] self-stretch overflow-x-scroll">
            {approvalDateOptions.map((option) => (
              <Chip
                key={option.label}
                label={option.label}
                selected={selectedApprovalDates.includes(option.label)}
                onToggle={() =>
                  toggleMulti(
                    option.label,
                    selectedApprovalDates,
                    setSelectedApprovalDates,
                  )
                }
              />
            ))}
          </div>
        </div>
        <SectionDivider />
      </div>
      <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-5 self-stretch px-0 py-5">
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-4 self-stretch px-0 py-2">
          <SectionTitle title="매물 조건" />
          <div className="scrollbar-hidden relative flex w-full flex-[0_0_auto] flex-wrap items-center gap-[8px_8px] self-stretch overflow-x-scroll">
            {propertyConditions.map((option) => (
              <Chip
                key={option.label}
                label={option.label}
                selected={selectedConditions.includes(option.label)}
                onToggle={() =>
                  toggleMulti(
                    option.label,
                    selectedConditions,
                    setSelectedConditions,
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
