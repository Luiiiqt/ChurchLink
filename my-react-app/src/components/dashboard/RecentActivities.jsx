const RecentActivities = ({ activities }) => {
  return (
    <div className="bg-white shadow rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-3">Recent Activities</h3>
      <ul className="divide-y divide-gray-200">
        {activities.map((act, idx) => (
          <li key={idx} className="py-3 flex justify-between">
            <span>{act.name}</span>
            <span className="text-gray-500 text-sm">{new Date(act.date).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;
