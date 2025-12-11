const StatCard = ({ title, value, icon, iconBgColor, trend, trendValue }) => {
  return (
    <div className="bg-white shadow rounded-xl p-5 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && trendValue && (
          <p className={`mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trendValue} {trend === 'up' ? '▲' : '▼'}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${iconBgColor}`}>{icon}</div>
    </div>
  );
};

export default StatCard;