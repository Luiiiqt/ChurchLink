import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const BarChart = ({ data, title, dataKey, labelKey, color }) => {
  return (
    <div className="bg-white shadow rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <ReBarChart data={data}>
          <XAxis dataKey={labelKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill="#10B981" />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
