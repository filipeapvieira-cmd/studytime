export type MonthlyHoursMap = Record<string, number>;

export interface AcademicYearData {
  [academicYearLabel: string]: MonthlyHoursMap;
}

export type ChartItem = {
  name: string;
  total: number;
};

type DataPoint = {
  month: string;
  user: number;
  community: number;
};

export type CommunityDataStructure = {
  academicYearData: {
    [year: string]: DataPoint[];
  };
};
