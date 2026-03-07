import { useState } from 'react';
import { Target, User, Calendar, Check } from 'lucide-react';

function priorityFromDeadline(deadline) {
  if (!deadline) return 'none';
  const dl = deadline.toLowerCase();
  if (/today|asap|urgent|immediately|now/i.test(dl)) return 'high';
  if (/tomorrow|end of day|eod|next day/i.test(dl)) return 'high';
  if (/this week|next meeting|few days/i.test(dl)) return 'medium';
  return 'low';
}

const priorityConfig = {
  high: { label: 'Urgent', color: 'var(--red)', bg: 'var(--red-bg)' },
  medium: { label: 'Soon', color: 'var(--orange)', bg: 'var(--orange-bg, rgba(255, 123, 29, 0.12))' },
  low: { label: 'Later', color: 'var(--green)', bg: 'var(--green-bg)' },
  none: { label: 'No date', color: 'var(--muted)', bg: 'var(--surface2)' },
};

export default function ActionItems({ items }) {
  const [checked, setChecked] = useState({});

  if (!items || items.length === 0) return null;

  const toggle = (i) => setChecked(prev => ({ ...prev, [i]: !prev[i] }));

  const enriched = items.map((item, i) => ({
    ...item,
    index: i,
    priority: priorityFromDeadline(item.deadline),
  }));

  const sortOrder = { high: 0, medium: 1, low: 2, none: 3 };
  enriched.sort((a, b) => sortOrder[a.priority] - sortOrder[b.priority]);

  return (
    <div className="card">
      <div className="card-title"><Target size={16} /> Action Items</div>
      <div className="ai-list">
        {enriched.map((item) => {
          const p = priorityConfig[item.priority];
          const done = checked[item.index];
          return (
            <div
              className={`ai-card ${done ? 'ai-done' : ''}`}
              key={item.index}
              onClick={() => toggle(item.index)}
            >
              <div className="ai-left">
                <div className={`ai-checkbox ${done ? 'checked' : ''}`}>
                  {done && <Check size={14} />}
                </div>
                <div className="ai-priority-dot" style={{ background: p.color }} title={p.label} />
              </div>
              <div className="ai-center">
                <div className={`ai-task-text ${done ? 'struck' : ''}`}>{item.task}</div>
                <div className="ai-meta">
                  <span className="ai-owner-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><User size={12} /> {item.owner}</span>
                  {item.deadline && (
                    <span className="ai-deadline-chip" style={{ background: p.bg, color: p.color, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={12} /> {item.deadline}
                    </span>
                  )}
                </div>
              </div>
              <div className="ai-right">
                <span className="ai-meeting-chip">{item.meeting}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="ai-summary-bar">
        <span>{Object.values(checked).filter(Boolean).length} / {items.length} completed</span>
        <div className="ai-progress-track">
          <div
            className="ai-progress-fill"
            style={{ width: `${(Object.values(checked).filter(Boolean).length / items.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
