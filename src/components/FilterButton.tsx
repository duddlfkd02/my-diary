import { cn } from "@/lib/utils";

interface FilterButtonsProps {
  selectedMood: string | null;
  sortOrder: "newest" | "oldest";
  setSelectedMood: (mood: string | null) => void;
  setSortOrder: (order: "newest" | "oldest") => void;
}

const FilterButtons = ({ selectedMood, sortOrder, setSelectedMood, setSortOrder }: FilterButtonsProps) => {
  const handleFilterClick = (label: string) => {
    if (label === "전체") {
      setSelectedMood(null);
      setSortOrder("newest");
    } else if (label === "최신순") {
      setSortOrder("newest");
    } else {
      setSortOrder("oldest");
    }
  };

  const isActive = (label: string) => {
    return (
      (label === "전체" && selectedMood === null && sortOrder === "newest") ||
      (label === "최신순" && selectedMood === "newest" && selectedMood !== null) ||
      (label === "오래된순" && sortOrder === "oldest")
    );
  };

  return (
    <div className="mb-4 flex flex-wrap justify-center gap-2">
      {["전체", "최신순", "오래된순"].map((label) => (
        <button
          key={label}
          onClick={() => handleFilterClick(label)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm transition",
            isActive(label)
              ? "bg-ivory font-semibold text-blue"
              : "border-ivory text-ivory hover:bg-ivoryLight hover:text-blue"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
