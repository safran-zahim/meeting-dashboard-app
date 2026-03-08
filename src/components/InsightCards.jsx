import { Ban, Mail, Clock, MessageSquare, TrendingUp, Lightbulb, Bot, Rocket } from 'lucide-react';

const SEVERITY_STYLES = {
  high: { bg: 'var(--red-bg)', border: 'var(--red)', label: 'HIGH' },
  medium: { bg: 'var(--orange-bg, rgba(255,123,29,0.12))', border: 'var(--orange)', label: 'MED' },
  low: { bg: 'var(--green-bg)', border: 'var(--green)', label: 'LOW' },
};

const INSIGHT_ICONS = {
  skip: <Ban size={16} />, email: <Mail size={16} />, shorten: <Clock size={16} />, contribute: <MessageSquare size={16} />,
  improve: <TrendingUp size={16} />, async: <Mail size={16} />, general: <Lightbulb size={16} />,
};

function classifyInsight(text) {
  const lower = text.toLowerCase();
  if (/skip|decline|drop|remove/i.test(lower)) return { type: 'skip', severity: 'high' };
  if (/email|async|slack|could be/i.test(lower)) return { type: 'email', severity: 'medium' };
  if (/shorten|cut|reduce|shorter/i.test(lower)) return { type: 'shorten', severity: 'medium' };
  if (/contribut|speak|participat|engage/i.test(lower)) return { type: 'contribute', severity: 'low' };
  if (/improve|increase|raise/i.test(lower)) return { type: 'improve', severity: 'low' };
  return { type: 'general', severity: 'medium' };
}

function AttendanceSummaryBanner({ attendanceRecs, ownerInsights }) {
  if (!attendanceRecs || attendanceRecs.length === 0) return null;

  const skippable = attendanceRecs.filter(r =>
    ['skip', 'delegate', 'summary_only'].includes(r.recommendation)
  );
  if (skippable.length === 0) return null;

  const totalHours = +(skippable.reduce((s, r) => s + (r.duration || 0), 0) / 60).toFixed(1);

  return (
    <div style={{
      padding: '14px 16px', borderRadius: 10, marginBottom: 16,
      background: 'var(--red-bg)', border: '1px solid rgba(255,59,92,0.2)',
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Rocket size={16} /> Skip {skippable.length} meeting{skippable.length > 1 ? 's' : ''} next week to recover ~{totalHours}h
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {skippable.map((r, i) => (
          <span key={i} style={{
            padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
            background: 'rgba(255,59,92,0.15)', color: '#FF3B5C',
            border: '1px solid rgba(255,59,92,0.25)',
          }}>
            {r.meeting}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function InsightCards({ items, attendanceRecs, ownerInsights }) {
  if ((!items || items.length === 0) && (!attendanceRecs || attendanceRecs.length === 0)) return null;

  const insights = (items || []).map(item => {
    const text = typeof item === 'string' ? item : item.text;
    const meetings = typeof item === 'string' ? [] : (item.meetings || []);
    const { type, severity } = classifyInsight(text);
    return { text, meetings, type, severity };
  });

  return (
    <div className="card">
      <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Bot size={16} /> AI-Generated Insights</div>
      <div className="card-sub" style={{ marginTop: -12, marginBottom: 16 }}>
        Personalized recommendations from transcript analysis
      </div>

      <AttendanceSummaryBanner attendanceRecs={attendanceRecs} ownerInsights={ownerInsights} />

      <div className="insight-list">
        {insights.map((ins, i) => {
          const s = SEVERITY_STYLES[ins.severity];
          return (
            <div
              className="insight-card"
              key={i}
              style={{
                background: s.bg,
                border: `1px solid ${s.border}33`,
                borderLeft: `3px solid ${s.border}`,
              }}
            >
              <div className="insight-header">
                <div className="insight-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {INSIGHT_ICONS[ins.type] || <Lightbulb size={16} />}
                  <span>{ins.text}</span>
                </div>
                <span
                  className="insight-severity"
                  style={{
                    color: s.border,
                    background: `${s.border}20`,
                  }}
                >{s.label}</span>
              </div>
              {ins.meetings.length > 0 && (
                <div style={{ marginTop: 6 }}>
                  <div className="ai-rec-meetings">
                    <span className="ai-rec-from">Applies to:</span>
                    {ins.meetings.map((m, j) => (
                      <span className="ai-rec-tag" key={j}>{m.name || m}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
