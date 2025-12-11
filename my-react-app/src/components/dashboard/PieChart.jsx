import { PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#34D399", "#10B981", "#059669", "#047857", "#065F46"];

const PieChart = ({ data, title, dataKey, labelKey }) => {
  return (
    <div className="bg-white shadow rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <RePieChart>
          <Pie data={data} dataKey={dataKey} nameKey={labelKey} cx="50%" cy="50%" outerRadius={80} fill="#10B981" label>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
