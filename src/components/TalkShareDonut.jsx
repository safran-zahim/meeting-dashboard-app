import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Mic } from 'lucide-react';

export default function TalkShareDonut({ breakdown, effective }) {
  if (!breakdown) return null;

  const { decision, discussion, idle } = breakdown;
  const data = [
    { name: 'Decision', value: decision, color: 'var(--orange)' },
    { name: 'Discussion', value: discussion, color: 'var(--green)' },
    { name: 'Idle / Wasted', value: idle, color: 'var(--yellow)' },
  ];

  return (
    <div className="chart-card">
      <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mic size={16} /> Time Breakdown</div>
      <div className="card-sub" style={{ marginTop: -12, marginBottom: 16 }}>How your meeting time is spent</div>
      <div style={{ position: 'relative' }}>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={50} outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none',
        }}>
          <div style={{
            fontSize: 22, fontWeight: 800, color: 'var(--orange)',
            fontFamily: "'DM Mono', monospace",
          }}>{effective}%</div>
          <div style={{
            fontSize: 12, color: 'var(--muted)',
            letterSpacing: '0.08em',
          }}>EFFECTIVE</div>
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        {data.map((e, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between',
            marginBottom: 4,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, color: 'var(--text)',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: e.color }} />
              {e.name}
            </div>
            <div style={{
              fontSize: 12, fontWeight: 700, color: 'var(--text)',
              fontFamily: "'DM Mono', monospace",
            }}>{e.value}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
