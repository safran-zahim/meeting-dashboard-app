import { Calendar, Clock, Mail, Target } from 'lucide-react';

function TrendIndicator({ value, suffix = '', invert = false }) {
  if (value === 0) return <div className="kpi-trend trend-flat">— steady</div>;
  const positive = invert ? value < 0 : value > 0;
  const arrow = positive ? '↑' : '↓';
  return (
    <div className={`kpi-trend ${positive ? 'trend-up' : 'trend-down'}`}>
      {arrow} {Math.abs(value)}{suffix} from last period
    </div>
  );
}

export default function KPICards({ summary, trends, asyncCount = 0 }) {
  const cards = [
    {
      icon: <Calendar size={22} />, accent: 'var(--blue)',
      value: summary.totalMeetings, label: 'Total Meetings',
      sub: 'in analyzed period',
      trend: <TrendIndicator value={trends.meetingsDelta} />,
    },
    {
      icon: <Clock size={22} />, accent: 'var(--orange)',
      value: `${summary.totalHours}h`, label: 'Hours in Meetings',
      sub: 'of your working time',
      trend: <TrendIndicator value={trends.hoursDelta} suffix="h" invert />,
    },
    {
      icon: <Mail size={22} />, accent: 'var(--red)',
      value: asyncCount, label: 'Could Be Emails',
      sub: 'detected by AI analysis',
    },
    {
      icon: <Target size={22} />, accent: 'var(--green)',
      value: `${summary.avgScore}`, label: 'Avg Score',
      sub: 'out of 100',
      trend: <TrendIndicator value={trends.scoreDelta} suffix=" pts" />,
    },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card, i) => (
        <div className="kpi-card" key={i} style={{ animationDelay: `${0.05 * (i + 1)}s` }}>
          <div className="kpi-accent" style={{ background: card.accent }} />
          <div className="kpi-icon-wrap">{card.icon}</div>
          <div className="kpi-value" style={{ color: card.accent }}>{card.value}</div>
          <div className="kpi-label">{card.label}</div>
          {card.sub && <div className="kpi-sub">{card.sub}</div>}
          {card.trend}
        </div>
      ))}
    </div>
  );
}
