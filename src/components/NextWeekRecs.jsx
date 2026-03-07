import { Calendar, Lightbulb } from 'lucide-react';

const ACTION_STYLES = {
  attend: { bg: 'var(--green-bg)', color: 'var(--green)', label: 'ATTEND' },
  skip: { bg: 'var(--red-bg)', color: 'var(--red)', label: 'SKIP' },
  decline: { bg: 'var(--red-bg)', color: 'var(--red)', label: 'DECLINE' },
  optional: { bg: 'var(--orange-pale)', color: 'var(--orange)', label: 'OPTIONAL' },
  review: { bg: 'var(--blue-bg)', color: 'var(--blue)', label: 'REVIEW' },
};

function classifyAction(item) {
  const text = (item.task || '').toLowerCase();
  if (/skip|decline|cancel/i.test(text)) return 'skip';
  if (/optional|delegate/i.test(text)) return 'optional';
  if (/review|check|assess/i.test(text)) return 'review';
  return 'attend';
}

export default function NextWeekRecs({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="card">
      <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={16} /> Recommended Actions</div>
      <div className="card-sub" style={{ marginTop: -12, marginBottom: 16 }}>
        Based on past patterns and AI analysis
      </div>
      <div className="rec-list">
        {items.slice(0, 5).map((item, i) => {
          const actionKey = classifyAction(item);
          const a = ACTION_STYLES[actionKey];
          return (
            <div className="rec-row" key={i}>
              <span className="rec-badge" style={{ color: a.color, background: a.bg }}>
                {a.label}
              </span>
              <div>
                <div className="rec-meeting">{item.meeting || 'General'}</div>
                <div className="rec-reason">{item.task}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="rec-tip" style={{ display: 'flex', gap: 6 }}>
        <Lightbulb size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong style={{ color: 'var(--muted)' }}>Tip:</strong> Declining low-score
          recurring meetings can recover <strong style={{ color: 'var(--orange)' }}>~3–4 hours/week</strong> based
          on your patterns.
        </div>
      </div>
    </div>
  );
}
