import { useState, useCallback, useMemo } from "react";
import { StudySessionDto } from "@/src/types";
import { DateRange } from "react-day-picker";
import {
  getPredefinedDateRanges,
  PredefinedDateRangeKey,
} from "@/src/lib/charts/utils";
import { CUSTOM_RANGE, THIS_WEEK } from "@/src/constants/constants.charts";
import { endOfDay, startOfDay } from "date-fns";

interface UseStudySessionFilterProps {
  studySessions: StudySessionDto[];
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
    if (!newRange) {
      setRange(undefined);
      return;
    }

    const { from, to } = newRange;

    if (from && to) {
      const dateEndOfDay = endOfDay(new Date(to));
      const beginningOfDay = startOfDay(new Date(from));
      setRange({ from: beginningOfDay, to: dateEndOfDay });
    } else if (from && !to) {
      const beginningOfDay = startOfDay(new Date(from));
      const endOfSameDay = endOfDay(new Date(from));
      setRange({ from: beginningOfDay, to: endOfSameDay });
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
