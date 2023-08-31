import { FC, useEffect, useState } from "react";
import { studySessionDto } from "@/types";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  PieChart,
  Pie,
} from "recharts";
import { getTotalStudiedTimePerDayOfTheWeek } from "@/lib/charts/utils";
import { convertMillisecondsToString } from "@/lib/export/utils";
interface BarChartProps {
  studySessions: studySessionDto[];
}

const BarChartCustom: FC<BarChartProps> = ({ studySessions }) => {
  const [chartData, setChartData] = useState(null);
  const fontSize = 15;

  useEffect(() => {
    setChartData(getTotalStudiedTimePerDayOfTheWeek(studySessions));
  }, [studySessions]);

  return (
    <div className="mt-4">
      <ResponsiveContainer height={400} width="100%" className={`mt-2`}>
        <BarChart
          width={500}
          max-height={300}
          data={chartData}
          maxBarSize={300}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="name" fontSize={fontSize} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" barSize={25}>
            <LabelList
              dataKey="total"
              position="top"
              content={<CustomLabel />}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartCustom;

const CustomTooltip = ({ payload, label, active }) => {
  if (active) {
    const totalInSeconds = payload[0].value;

    const hours = Math.floor(totalInSeconds / 3600);
    const minutes = Math.floor((totalInSeconds % 3600) / 60);
    const seconds = totalInSeconds % 60;

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    return (
      <div className="custom-tooltip">
        <p className="intro">{`Total Time: ${formattedTime}`}</p>
      </div>
    );
  }
  return null;
};

const CustomLabel = (props) => {
  const { x, y, value } = props;
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = value % 60;

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <text x={x} y={y} dy={-4} fontSize={12} textAnchor="middle">
      {formattedTime}
    </text>
  );
};
