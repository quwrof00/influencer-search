import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";

interface PlatformFilterProps {
  selected: Platform | null;
  onChange: (platform: Platform) => void;
}

export function PlatformFilter({ selected, onChange }: PlatformFilterProps) {
  return (
    <div className="flex gap-4 justify-center">
      {PLATFORMS.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`font-semibold text-sm tracking-wide px-4 py-2 rounded-full border-2 transition-all ${
            selected === p
              ? "border-black bg-black text-white"
              : "border-black/10 text-gray-500 hover:border-black hover:text-black bg-white"
          }`}
        >
          {getPlatformLabel(p)}
        </button>
      ))}
    </div>
  );
}
