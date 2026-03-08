import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { BarChart2 } from 'lucide-react';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--orange-pale)',
      borderRadius: 8, padding: '10px 14px',
    }}>
      <div style={{ color: 'var(--orange)', fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: 'var(--text)', fontSize: 12 }}>
          {p.name}: <span style={{ color: p.color || 'var(--orange)' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function WeeklyLoadChart({ meetings }) {
  const dayMap = {};
  const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (meetings && meetings.length > 0) {
    meetings.forEach(m => {
      if (!m.startTime) return;
      const d = new Date(m.startTime);
      const day = dayOrder[d.getDay()];
      if (!dayMap[day]) dayMap[day] = { day, meetings: 0, hours: 0 };
      dayMap[day].meetings += 1;
      dayMap[day].hours += (m.duration || 30) / 60;
    });
  }

  const data = dayOrder
    .filter(d => dayMap[d])
    .map(d => ({ ...dayMap[d], hours: Math.round(dayMap[d].hours * 10) / 10 }));

  if (data.length === 0) return null;

  return (
    <div className="chart-card">
      <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><BarChart2 size={16} /> Weekly Meeting Load</div>
      <div className="card-sub" style={{ marginTop: -12, marginBottom: 16 }}>Meeting count and hours by day</div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--overlay-05)" />
          <XAxis dataKey="day" tick={{ fill: 'var(--overlay-40)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--overlay-30)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, color: 'var(--overlay-50)' }} />
          <Bar dataKey="meetings" name="Meeting Count" fill="var(--blue)" radius={[3, 3, 0, 0]} opacity={0.8} />
          <Bar dataKey="hours" name="Hours" fill="var(--orange)" radius={[3, 3, 0, 0]} opacity={0.8} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
