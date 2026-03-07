import { Sun, Moon } from 'lucide-react';

export default function Topbar({ weekLabel, onRefresh, dbConnected, loading, theme, onToggleTheme }) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">Meeting Efficiency Dashboard</h1>
      </div>
      <div className="topbar-right">
        {dbConnected !== null && (
          <span className="db-status-badge">
            <span className={`connection-dot ${dbConnected ? 'connected' : 'disconnected'}`} />
            {dbConnected ? 'DB Connected' : 'DB Offline'}
          </span>
        )}
        <button
          onClick={onToggleTheme}
          className="btn-icon theme-toggle-btn"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="topbar-user-profile">
          <div className="user-avatar">
            <img src="/images/Team_logo.png" alt="User Profile" onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = 'JW'; }} />
          </div>
          <span className="user-name">Jaxx Wagner</span>
        </div>
      </div>
    </div>
  );
}
