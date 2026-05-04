import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Package, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [salesTrend, setSalesTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [statsRes, trendRes] = await Promise.all([
        api.get('/reports/dashboard'),
        api.get('/reports/sales-trend'),
      ]);
      setStats(statsRes.data);
      setSalesTrend(trendRes.data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-gray-600">Loading dashboard...</div>;
  }

  const cards = [
    {
      label: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'blue',
    },
    {
      label: 'Total Stock Units',
      value: stats?.totalStockUnits || 0,
      icon: TrendingUp,
      color: 'green',
    },
    {
      label: 'Stock Value',
      value: `₹${(stats?.totalStockValue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'purple',
    },
    {
      label: 'Low Stock Alerts',
      value: stats?.lowStockCount || 0,
      icon: AlertCircle,
      color: 'red',
    },
  ];

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">{card.label}</p>
                <Icon size={20} className={`text-${card.color}-500`} />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-800 break-all">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
          Sales Trend (Last 30 Days)
        </h2>
        {salesTrend.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            No sales data yet. Create some stock movements with type "OUT" and reason "SALE" to see trends.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="totalQuantity"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default Dashboard;