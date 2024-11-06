import { useState, useCallback, useMemo } from "react";
import { studySessionDto } from "@/src/types";
import { DateRange } from "react-day-picker";
import {
  getPredefinedDateRanges,
  PredefinedDateRangeKey,
} from "@/src/lib/charts/utils";
import { CUSTOM_RANGE, THIS_WEEK } from "@/src/constants/constants.charts";

interface UseStudySessionFilterProps {
  studySessions: studySessionDto[];
}

const useStudySessionFilter = ({
  studySessions,
}: UseStudySessionFilterProps) => {
  const studySessionsDates = useMemo(
    () => studySessions.map((session) => new Date(session.date)),
    [studySessions]
  );

  const predefinedDateRanges = useMemo(
    () => getPredefinedDateRanges(studySessionsDates),
    [studySessionsDates]
  );

  const [range, setRange] = useState<DateRange | undefined>(
    predefinedDateRanges[THIS_WEEK]
  );

  const [selectedPredefinedRange, setSelectedPredefinedRange] =
    useState<string>(THIS_WEEK);

  const isMessageVisible = useMemo(() => range?.from && range?.to, [range]);

  const filterStudySessions = useCallback(() => {
    if (!range?.from) {
      return studySessions;
    }

    const from = range.from;
    const to = range.to ?? from;

    return studySessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= from && sessionDate <= to;
    });
  }, [range, studySessions]);

  const handlePredefinedRangeSelect = (value: PredefinedDateRangeKey) => {
    const selectedRange = predefinedDateRanges[value];
    if (selectedRange) {
      setRange(selectedRange);
      setSelectedPredefinedRange(value);
    }
  };

  const handleCustomRangeSelect = (newRange: DateRange | undefined) => {
    if (!newRange) return;

    const { from, to } = newRange;
    if (from && !to) {
      setRange({ from, to: from });
    } else {
      setRange(newRange);
    }
    setSelectedPredefinedRange(CUSTOM_RANGE);
  };

  const filteredStudySessions = useMemo(
    () => filterStudySessions(),
    [filterStudySessions]
  );

  return {
    range,
    selectedPredefinedRange,
    predefinedDateRanges,
    isMessageVisible,
    handlePredefinedRangeSelect,
    handleCustomRangeSelect,
    filteredStudySessions,
  };
};

export default useStudySessionFilter;
