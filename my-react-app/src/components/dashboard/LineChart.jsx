import { LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const LineChart = ({ data, title, dataKey, labelKey }) => {
  return (
    <div className="bg-white shadow rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <ReLineChart data={data}>
          <XAxis dataKey={labelKey} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke="#6366F1" strokeWidth={2} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
