import { DateRange } from "react-day-picker";
import { CalendarDateRangePicker } from "../Date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  PredefinedDateRangeKey,
  PredefinedDateRanges,
} from "@/src/lib/charts/utils";
import { CUSTOM_RANGE } from "@/src/constants/constants.charts";

interface DateRangeSelectorProps {
  range: DateRange | undefined;
  selectedPredefinedRange: string;
  predefinedDateRanges: PredefinedDateRanges;
  onPredefinedRangeSelect: (value: PredefinedDateRangeKey) => void;
  onCustomRangeSelect: (newRange: DateRange | undefined) => void;
}

export const DateRangeSelector = ({
  range,
  selectedPredefinedRange,
  predefinedDateRanges,
  onPredefinedRangeSelect,
  onCustomRangeSelect,
}: DateRangeSelectorProps) => {
  return (
    <div className="flex gap-x-3">
      <CalendarDateRangePicker date={range} setDate={onCustomRangeSelect} />
      <Select
        value={selectedPredefinedRange || undefined}
        onValueChange={onPredefinedRangeSelect}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(predefinedDateRanges).map((rangeKey) => (
            <SelectItem key={rangeKey} value={rangeKey}>
              {rangeKey}
            </SelectItem>
          ))}
          <SelectItem value={CUSTOM_RANGE} disabled>
            {CUSTOM_RANGE}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
