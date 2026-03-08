import { useState } from 'react';
import { CheckCircle, Ban, RefreshCw, FileText, Mail, MessageSquare, FileEdit, Clock, Search, Calendar, Target, Repeat, ClipboardList } from 'lucide-react';

const TYPE_COLORS = {
  standup: '#3B82F6', '1:1': '#00C48C', planning: '#EC4899',
  review: '#7C3AED', retrospective: '#14B8A6', 'all-hands': '#FF3B5C',
  sync: '#3B82F6', interview: '#00C48C', workshop: '#FFB800',
  brainstorm: '#FF6600', general: '#6B7280', strategy: '#FF6600',
  status: '#14B8A6', external: '#F97316', compliance: '#6B7280',
};

const REC_STYLES = {
  attend: { bg: 'var(--green-bg, #00C48C22)', border: 'var(--green, #00C48C)', color: 'var(--green, #00C48C)', icon: <CheckCircle size={14} />, label: 'ATTEND' },
  skip: { bg: 'var(--red-bg, #FF3B5C22)', border: 'var(--red, #FF3B5C)', color: 'var(--red, #FF3B5C)', icon: <Ban size={14} />, label: 'SKIP' },
  delegate: { bg: 'var(--orange-bg, #FF660022)', border: 'var(--orange, #FF6600)', color: 'var(--orange, #FF6600)', icon: <RefreshCw size={14} />, label: 'DELEGATE' },
  summary_only: { bg: 'var(--blue-bg, #3B82F622)', border: 'var(--blue, #3B82F6)', color: 'var(--blue, #3B82F6)', icon: <FileText size={14} />, label: 'SUMMARY ONLY' },
};

const REPLACE_LABELS = {
  nothing: null,
  email: <><Mail size={14} /> Email update</>,
  slack_summary: <><MessageSquare size={14} /> Slack summary</>,
  async_doc: <><FileEdit size={14} /> Async doc</>,
  shorter_meeting: <><Clock size={14} /> Shorter meeting</>,
};

function getTypeColor(type) {
  return TYPE_COLORS[type?.toLowerCase()] || '#6B7280';
}

function scoreColor(score) {
  if (score >= 70) return '#00C48C';
  if (score >= 45) return '#FFB800';
  return '#FF3B5C';
}

function scoreLabel(score) {
  if (score >= 80) return 'EXCELLENT';
  if (score >= 70) return 'GOOD';
  if (score >= 50) return 'FAIR';
  if (score >= 30) return 'LOW';
  return 'NEEDS WORK';
}

function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    + ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function SkillBar({ skill }) {
  const color = scoreColor(skill.score);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600 }}>
          {skill.icon} {skill.name}
        </span>
        <span style={{
          fontSize: 12, fontWeight: 700, color,
          fontFamily: "'DM Mono', monospace",
        }}>{skill.score}<span style={{ color: 'var(--overlay-25)' }}>/100</span></span>
      </div>
      <div style={{ height: 6, background: 'var(--overlay-06)', borderRadius: 3 }}>
        <div style={{
          width: `${Math.min(skill.score, 100)}%`, height: '100%',
          background: color, borderRadius: 3,
          transition: 'width 1s ease',
        }} />
      </div>
    </div>
  );
}

function SelfEvaluation({ ownerInsights }) {
  if (!ownerInsights || !ownerInsights.totalMeetings) return null;

  const o = ownerInsights;
  const sc = scoreColor(o.avgContributionScore);

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Personal Meeting Self-Evaluation</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
          Insights based on your recent meeting performance
        </div>
      </div>

      {/* Overall score + stats */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
            background: `conic-gradient(${sc} ${o.avgContributionScore * 3.6}deg, var(--border) 0deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 58, height: 58, borderRadius: '50%',
              background: 'var(--surface)', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
                {o.avgContributionScore}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', letterSpacing: '0.08em' }}>
                {scoreLabel(o.avgContributionScore)}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Overall Meeting Performance</div>
            <div style={{ fontSize: 12, color: 'var(--overlay-40)', marginTop: 3 }}>
              {o.rank > 0 && <>Rank <strong style={{ color: 'var(--orange)' }}>#{o.rank}</strong> of {o.totalParticipants} participants · </>}
              {o.totalMeetings} meetings attended · {o.totalSpeaking}min speaking
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="owner-stats-grid">
          <div className="owner-stat">
            <div className="owner-stat-value">{o.totalMeetings}</div>
            <div className="owner-stat-label">Meetings<br />attended</div>
          </div>
          <div className="owner-stat">
            <div className="owner-stat-value">{o.totalSpeaking}<span style={{ fontSize: 12 }}>min</span></div>
            <div className="owner-stat-label">Speaking<br />{o.speakingRatio}% of time</div>
          </div>
          <div className="owner-stat">
            <div className="owner-stat-value">{o.totalDecisions}</div>
            <div className="owner-stat-label">Decisions<br />{o.decisionRatio}% ratio</div>
          </div>
          <div className="owner-stat">
            <div className="owner-stat-value" style={{ color: sc, fontSize: 18 }}>{o.avgContributionScore}<span style={{ fontSize: 12, color: 'var(--overlay-30)' }}>/100</span></div>
            <div className="owner-stat-label">Avg Score<br />{o.primaryRole}</div>
          </div>
        </div>
      </div>

      {/* Skill assessment + strengths/improvements */}
      <div className="dash-grid" style={{ marginBottom: 16 }}>
        {/* Skills */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Skill Assessment</div>
          {(o.skills || []).map((sk, i) => <SkillBar key={i} skill={sk} />)}
        </div>

        {/* Strengths + Improvements */}
        <div className="card">
          {/* Strengths */}
          {o.strengths && o.strengths.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#00C48C', marginBottom: 10 }}>
                Your Strengths
              </div>
              {o.strengths.map((s, i) => (
                <div key={i} style={{
                  padding: '10px 14px', borderRadius: 8, marginBottom: 6,
                  background: 'rgba(0,196,140,0.06)', borderLeft: '3px solid #00C48C',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--overlay-40)', marginTop: 3 }}>{s.detail}</div>
                </div>
              ))}
            </div>
          )}

          {/* Improvements */}
          {o.improvements && o.improvements.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#FFB800', marginBottom: 10 }}>
                Areas to Improve
              </div>
              {o.improvements.map((im, i) => (
                <div key={i} style={{
                  padding: '10px 14px', borderRadius: 8, marginBottom: 6,
                  background: 'rgba(255,184,0,0.06)', borderLeft: '3px solid #FFB800',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{im.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--overlay-40)', marginTop: 3 }}>{im.detail}</div>
                </div>
              ))}
            </div>
          )}

          {o.focusArea && (
            <div style={{
              padding: '12px 14px', borderRadius: 10,
              background: 'var(--orange-bg)',
              border: '1px solid rgba(255,102,0,0.15)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--orange)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                #1 Focus for Next Week
              </div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{o.focusArea.title}</div>
              <div style={{ fontSize: 12, color: 'var(--overlay-45)', marginTop: 3 }}>{o.focusArea.detail}</div>
            </div>
          )}
        </div>
      </div>

      {/* Per-meeting feedback */}
      {o.ownerMeetingFeedback && o.ownerMeetingFeedback.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-title" style={{ marginBottom: 14 }}>Meeting-wise Feedback</div>
          {o.ownerMeetingFeedback.map((mf, i) => (
            <div key={i} style={{
              padding: '10px 12px', borderRadius: 8, marginBottom: 6,
              background: 'var(--overlay-02)', border: '1px solid var(--overlay-05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{mf.meeting}</div>
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                  background: `${getTypeColor(mf.type)}20`, color: getTypeColor(mf.type),
                }}>{mf.type}</span>
              </div>
              {mf.feedback && (
                <div style={{ fontSize: 12, color: 'var(--overlay-45)', lineHeight: 1.5, marginBottom: 3, display: 'flex', gap: 6 }}>
                  <MessageSquare size={12} style={{ flexShrink: 0, marginTop: 2 }} /> <span>{mf.feedback}</span>
                </div>
              )}
              {mf.ownerAdvice && mf.ownerAdvice !== mf.feedback && (
                <div style={{ fontSize: 12, color: 'var(--orange)', lineHeight: 1.5, display: 'flex', gap: 6 }}>
                  <Target size={12} style={{ flexShrink: 0, marginTop: 2 }} /> <span>{mf.ownerAdvice}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Attendance overview */}
      {o.meetingsToSkip > 0 && (
        <div style={{
          padding: '14px 16px', borderRadius: 10, marginBottom: 20,
          background: 'var(--red-bg)',
          border: '1px solid rgba(255,59,92,0.15)',
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: '#FF3B5C' }}>
            You could skip {o.meetingsToSkip} meeting{o.meetingsToSkip > 1 ? 's' : ''} and recover ~{o.hoursRecoverable}h
          </div>
          <div style={{ fontSize: 12, color: 'var(--overlay-40)' }}>
            Based on your contribution patterns, these meetings add little value for you specifically.
          </div>
        </div>
      )}
    </>
  );
}

function AttendanceBadge({ recommendation }) {
  const style = REC_STYLES[recommendation] || REC_STYLES.attend;
  return (
    <span className="attendance-badge" style={{
      background: style.bg,
      border: `1px solid ${style.border}55`,
      color: style.color,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    }}>
      {style.icon} {style.label}
    </span>
  );
}

function MeetingDetailCard({ meeting, initialExpanded = false }) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const typeColor = getTypeColor(meeting.type);
  const ownerSc = scoreColor(meeting.ownerScore || 0);
  const meetingSc = scoreColor(meeting.score || 0);
  const rec = (meeting.attendanceRecommendation || 'attend').toLowerCase();
  const replaceLabel = REPLACE_LABELS[(meeting.couldBeReplacedWith || 'nothing').toLowerCase()];

  return (
    <div className="card meeting-detail-card" style={{ marginBottom: 14 }}>
      <div
        onClick={() => setExpanded(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: `${typeColor}20`, border: `1px solid ${typeColor}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: typeColor
          }}><ClipboardList size={18} /></div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {meeting.summary}
            </div>
            <div style={{ fontSize: 12, color: 'var(--overlay-50)', marginTop: 2, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              {formatDateTime(meeting.startTime)}
              <span style={{
                padding: '1px 6px', borderRadius: 4,
                background: `${typeColor}20`, color: typeColor,
                fontSize: 12, fontWeight: 700,
              }}>{meeting.type}</span>
              <span>{meeting.duration}min</span>
              {meeting.isRecurring && <span style={{ color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 4 }}><Repeat size={10} /> Recurring</span>}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <AttendanceBadge recommendation={rec} />
          <span style={{
            fontSize: 12, color: 'var(--orange)', fontWeight: 800,
            transition: 'transform 0.3s',
            transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
          }}>▼</span>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--overlay-06)' }}>
          <div className="meeting-detail-grid">
            <div className="detail-metric">
              <span className="detail-metric-label">Meeting Score</span>
              <span className="detail-metric-value" style={{ color: meetingSc }}>{Math.round(meeting.score || 0)}</span>
            </div>
            <div className="detail-metric">
              <span className="detail-metric-label">Your Score</span>
              <span className="detail-metric-value" style={{ color: ownerSc }}>{Math.round(meeting.ownerScore || 0)}</span>
            </div>
            <div className="detail-metric">
              <span className="detail-metric-label">Value for You</span>
              <span className="detail-metric-value" style={{ color: scoreColor(meeting.meetingValueForOwner || 0) }}>
                {Math.round(meeting.meetingValueForOwner || 0)}
              </span>
            </div>
            <div className="detail-metric">
              <span className="detail-metric-label">Your Role</span>
              <span className="detail-metric-value" style={{ fontSize: 12, textTransform: 'capitalize' }}>
                {meeting.ownerRole || 'contributor'}
              </span>
            </div>
          </div>

          {meeting.attendanceReason && (
            <div className="detail-reason">
              <strong>Recommendation:</strong> {meeting.attendanceReason}
            </div>
          )}

          {replaceLabel && (
            <div className="detail-replace-tag" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              Could be replaced with: <strong style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{replaceLabel}</strong>
            </div>
          )}

          {meeting.ownerFeedback && (
            <div className="detail-feedback">
              <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 4, color: 'var(--orange)' }}>
                Personalized Advice
              </div>
              {meeting.ownerFeedback}
            </div>
          )}

          {meeting.qualitySummary && (
            <div className="detail-quality">
              <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 4, color: 'var(--overlay-50)' }}>
                Meeting Quality
              </div>
              {meeting.qualitySummary}
            </div>
          )}

          {meeting.keyDecisions && meeting.keyDecisions.length > 0 && (
            <div className="detail-decisions">
              <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 6, color: '#00C48C' }}>
                Key Decisions ({meeting.keyDecisions.length})
              </div>
              {meeting.keyDecisions.map((d, i) => (
                <div key={i} style={{ fontSize: 12, padding: '3px 0', color: 'var(--overlay-60)' }}>
                  • {typeof d === 'string' ? d : JSON.stringify(d)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { SelfEvaluation, MeetingDetailCard };

export default function MeetingSummary({ meetings, ownerInsights, attendanceRecs }) {
  if (!meetings || meetings.length === 0) return null;

  const sorted = [...meetings].sort((a, b) => (b.ownerScore || b.score || 0) - (a.ownerScore || a.score || 0));
  const attendMeetings = sorted.filter(m => (m.attendanceRecommendation || 'attend') === 'attend');
  const skipMeetings = sorted.filter(m => ['skip', 'delegate', 'summary_only'].includes(m.attendanceRecommendation));

  return (
    <div>
      <div className="card-title" style={{ marginBottom: 6, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Search size={16} /> Individual Insights
      </div>
      <div style={{ fontSize: 12, color: 'var(--overlay-35)', marginBottom: 24 }}>
        Personal self-evaluation across {meetings.length} meetings — skills, strengths, and actionable advice
      </div>

      {/* Self-evaluation section */}
      <SelfEvaluation ownerInsights={ownerInsights} />

      {/* Attendance breakdown by meeting */}
      {skipMeetings.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: 'var(--red)', marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'var(--red-bg)', border: '1px solid var(--red-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Ban size={14} color="var(--red)" /></span>
            Meetings You Can Skip ({skipMeetings.length})
          </div>
          {skipMeetings.map(m => <MeetingDetailCard key={m.id} meeting={m} />)}
        </div>
      )}

      {attendMeetings.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: 'var(--green)', marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'var(--green-bg)', border: '1px solid var(--green-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><CheckCircle size={14} color="var(--green)" /></span>
            Meetings Worth Attending ({attendMeetings.length})
          </div>
          {attendMeetings.map(m => <MeetingDetailCard key={m.id} meeting={m} />)}
        </div>
      )}

      <div style={{
        display: 'flex', alignItems: 'center', gap: 20, marginTop: 20,
        padding: '12px 14px', borderRadius: 8,
        background: 'var(--overlay-04)', border: '1px solid var(--overlay-06)',
        fontSize: 12, color: 'var(--overlay-40)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> <strong style={{ color: 'var(--overlay-60)' }}>{meetings.length}</strong> meetings</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12} color="var(--green)" /> <strong style={{ color: 'var(--green)' }}>{attendMeetings.length}</strong> attend</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Ban size={12} color="var(--red)" /> <strong style={{ color: 'var(--red)' }}>{skipMeetings.length}</strong> skip/delegate</span>
        {ownerInsights && ownerInsights.hoursRecoverable > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} color="var(--yellow, #FFB800)" /> <strong style={{ color: 'var(--yellow, #FFB800)' }}>{ownerInsights.hoursRecoverable}h</strong> recoverable</span>
        )}
      </div>
    </div>
  );
}
