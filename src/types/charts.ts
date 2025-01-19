export type MonthlyHoursMap = Record<string, number>;

export interface AcademicYearData {
  [academicYearLabel: string]: MonthlyHoursMap;
}

export type ChartItem = {
  name: string;
  total: number;
};
