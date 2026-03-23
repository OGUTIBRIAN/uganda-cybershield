import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://uganda-cybershield-api.onrender.com";

// ── PASSWORD CHECKER ─────────────────────────────────────────
function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkPassword = async () => {
    if (!password) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/check-password`, { password });
      setResult(res.data);
    } catch {
      window.alert("Could not connect to server.");
    }
    setLoading(false);
  };

  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <span style={s.cardIcon}>🔐</span>
        <h2 style={s.cardTitle}>Password Checker</h2>
        <p style={s.cardSubtitle}>Test how strong your password is</p>
      </div>
      <div style={s.inputRow}>
        <input type={showPassword ? "text" : "password"} placeholder="Type your password here..."
          value={password} onChange={(e) => { setPassword(e.target.value); setResult(null); }}
          onKeyDown={(e) => e.key === "Enter" && checkPassword()} style={s.input} />
        <button onClick={() => setShowPassword(!showPassword)} style={s.eyeBtn}>
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>
      <button onClick={checkPassword} style={s.btn} disabled={loading || !password}>
        {loading ? "Checking..." : "Check Password"}
      </button>
      {result && (
        <div style={s.result}>
          <div style={s.barBg}><div style={{ ...s.barFill, width: `${result.percentage}%`, background: result.color }} /></div>
          <p style={{ ...s.strengthLabel, color: result.color }}>Strength: <strong>{result.strength}</strong></p>
          {result.feedback.length > 0 && (
            <div style={s.feedbackBox}>
              <p style={s.feedbackTitle}>💡 Suggestions:</p>
              {result.feedback.map((tip, i) => <p key={i} style={s.feedbackItem}>• {tip}</p>)}
            </div>
          )}
        </div>
      )}
      <div style={s.tipsBox}>
        <p style={s.tipsTitle}>🇺🇬 Cyber tip for Ugandans</p>
        <p style={s.tipsText}>Never use your phone number, name, or "Uganda" as your password — these are the first things hackers try on Ugandan accounts.</p>
      </div>
    </div>
  );
}

// ── PHISHING DETECTOR ────────────────────────────────────────
function PhishingDetector() {
  const [inputType, setInputType] = useState("url");
  const [content, setContent] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkPhishing = async () => {
    if (!content) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/check-phishing`, { type: inputType, content });
      setResult(res.data);
    } catch {
      window.alert("Could not connect to server.");
    }
    setLoading(false);
  };

  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <span style={s.cardIcon}>🎣</span>
        <h2 style={s.cardTitle}>Phishing Detector</h2>
        <p style={s.cardSubtitle}>Check suspicious links and messages</p>
      </div>
      <div style={s.toggleRow}>
        <button onClick={() => { setInputType("url"); setResult(null); setContent(""); }}
          style={{ ...s.toggleBtn, ...(inputType === "url" ? s.toggleActive : {}) }}>🔗 Check a URL</button>
        <button onClick={() => { setInputType("text"); setResult(null); setContent(""); }}
          style={{ ...s.toggleBtn, ...(inputType === "text" ? s.toggleActive : {}) }}>💬 Check a Message</button>
      </div>
      {inputType === "url"
        ? <input type="text" placeholder="Paste a suspicious URL here..." value={content}
            onChange={(e) => { setContent(e.target.value); setResult(null); }}
            style={{ ...s.input, marginBottom: "12px" }} />
        : <textarea placeholder="Paste a suspicious SMS or email message here..." value={content}
            onChange={(e) => { setContent(e.target.value); setResult(null); }}
            style={s.textarea} />
      }
      <button onClick={checkPhishing} style={s.btn} disabled={loading || !content}>
        {loading ? "Analysing..." : "Analyse Now"}
      </button>
      {result && (
        <div style={s.result}>
          <div style={s.barBg}><div style={{ ...s.barFill, width: `${result.percentage}%`, background: result.color }} /></div>
          <p style={{ ...s.strengthLabel, color: result.color }}>Verdict: <strong>{result.verdict}</strong></p>
          <div style={{ ...s.feedbackBox, borderLeft: `4px solid ${result.color}` }}>
            <p style={{ ...s.feedbackTitle, color: result.color }}>⚠️ {result.advice}</p>
            {result.reasons.map((r, i) => <p key={i} style={s.feedbackItem}>• {r}</p>)}
          </div>
        </div>
      )}
      <div style={s.tipsBox}>
        <p style={s.tipsTitle}>🇺🇬 Common Uganda scams to watch for</p>
        <p style={s.tipsText}>Fake MTN/Airtel messages asking for your PIN, fake job offers, and "you have won" messages are the most common scams targeting Ugandans.</p>
      </div>
    </div>
  );
}

// ── PORT SCANNER ─────────────────────────────────────────────
function PortScanner() {
  const [target, setTarget] = useState("127.0.0.1");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showClosed, setShowClosed] = useState(false);

  const scanPorts = async () => {
    if (!target) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${API}/api/scan-ports`, { target });
      setResult(res.data);
    } catch (err) {
      const msg = err.response?.data?.error || "Could not connect to server.";
      window.alert(msg);
    }
    setLoading(false);
  };

  const riskColor = (risk) => {
    if (risk === "High") return "#e74c3c";
    if (risk === "Medium") return "#f39c12";
    return "#2ecc71";
  };

  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <span style={s.cardIcon}>🌐</span>
        <h2 style={s.cardTitle}>Port Scanner</h2>
        <p style={s.cardSubtitle}>Check open ports on your own machine</p>
      </div>

      {/* Educational notice */}
      <div style={{ ...s.tipsBox, marginBottom: "16px" }}>
        <p style={s.tipsTitle}><strong>⚠️Only Self-Scan Allowed!!!</strong></p>
        <p style={s.tipsText}>This tool only scans your own machine (localhost / 127.0.0.1). Scanning other people's systems without permission is illegal under Uganda's Computer Misuse Act 2011.</p>
      </div>

      {/* Input */}
      <div style={s.inputRow}>
        <input
          type="text"
          value={target}
          onChange={(e) => { setTarget(e.target.value); setResult(null); }}
          placeholder="127.0.0.1 or localhost"
          style={{ ...s.input, marginBottom: 0 }}
        />
        <button onClick={scanPorts} style={{ ...s.eyeBtn, padding: "0 16px", background: "#2980b9", color: "#fff", fontSize: "13px", whiteSpace: "nowrap" }}
          disabled={loading}>
          {loading ? "Scanning..." : "Scan"}
        </button>
      </div>
      <p style={{ color: "#7f8c9a", fontSize: "12px", margin: "6px 0 16px" }}>
        Only localhost and private network addresses are allowed.
      </p>

      {/* Loading animation */}
      {loading && (
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <p style={{ color: "#2980b9", fontSize: "16px" }}>🔍 Scanning ports...</p>
          <p style={{ color: "#7f8c9a", fontSize: "13px" }}>Checking {18} common ports. Please wait.</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div>
          {/* Overall verdict */}
          <div style={{ ...s.feedbackBox, borderLeft: `4px solid ${result.overall_color}`, marginBottom: "16px" }}>
            <p style={{ ...s.feedbackTitle, color: result.overall_color, fontSize: "16px" }}>
              {result.overall === "Excellent" || result.overall === "Good" ? "✅" : "⚠️"} {result.overall}
            </p>
            <p style={s.feedbackItem}>{result.advice}</p>
            <p style={{ ...s.feedbackItem, marginTop: "6px" }}>
              Scanned: <strong style={{ color: "#fff" }}>{result.ip}</strong> —
              <strong style={{ color: result.overall_color }}> {result.total_open} open port(s)</strong> found
            </p>
          </div>

          {/* Open ports */}
          {result.open_ports.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ color: "#ffffff", fontWeight: "600", fontSize: "14px", marginBottom: "8px" }}>
                🔓 Open Ports ({result.open_ports.length})
              </p>
              {result.open_ports.map((p) => (
                <div key={p.port} style={{ ...s.tipCard, borderLeft: `3px solid ${riskColor(p.risk)}`, marginBottom: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ color: "#ffffff", fontWeight: "700", fontSize: "15px" }}>
                      Port {p.port} — {p.service}
                    </span>
                    <span style={{ background: riskColor(p.risk) + "22", color: riskColor(p.risk), fontSize: "11px", padding: "2px 10px", borderRadius: "10px", fontWeight: "600" }}>
                      {p.risk} Risk
                    </span>
                  </div>
                  <p style={{ color: "#7f8c9a", fontSize: "13px", margin: 0, lineHeight: "1.5" }}>{p.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Toggle closed ports */}
          <button onClick={() => setShowClosed(!showClosed)}
            style={{ ...s.toggleBtn, width: "100%", marginBottom: "8px" }}>
            {showClosed ? "▲ Hide" : "▼ Show"} closed ports ({result.closed_ports.length})
          </button>

          {showClosed && result.closed_ports.map((p) => (
            <div key={p.port} style={{ ...s.tipCard, opacity: 0.5, marginBottom: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#7f8c9a", fontSize: "14px" }}>Port {p.port} — {p.service}</span>
                <span style={{ color: "#2ecc71", fontSize: "12px" }}>✅ Closed</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── CYBER AWARENESS HUB ──────────────────────────────────────
function AwarenessHub() {
  const [tab, setTab] = useState("tips");
  const [tips, setTips] = useState([]);
  const [category, setCategory] = useState("All");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const categories = ["All", "Mobile Money", "Passwords", "Scams", "Phishing", "Device Security", "Network", "Network Security"];

  useEffect(() => {
    axios.get(`${API}/api/tips?category=${category}`).then(r => setTips(r.data));
  }, [category]);

  useEffect(() => {
    if (tab === "quiz") {
      axios.get(`${API}/api/quiz`).then(r => setQuestions(r.data));
      setCurrent(0); setSelected(null); setFeedback(null); setScore(0); setFinished(false);
    }
  }, [tab]);

  const submitAnswer = async () => {
    if (selected === null) return;
    const q = questions[current];
    const res = await axios.post(`${API}/api/quiz/check`, { question_id: q.id, selected });
    setFeedback(res.data);
    if (res.data.correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (current + 1 >= questions.length) { setFinished(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
    setFeedback(null);
  };

  const restartQuiz = () => {
    setCurrent(0); setSelected(null); setFeedback(null); setScore(0); setFinished(false);
  };

  const getScoreColor = () => {
    const pct = score / questions.length;
    if (pct >= 0.8) return "#2ecc71";
    if (pct >= 0.5) return "#f39c12";
    return "#e74c3c";
  };

  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <span style={s.cardIcon}>📚</span>
        <h2 style={s.cardTitle}>Cyber Awareness Hub</h2>
        <p style={s.cardSubtitle}>Learn to stay safe online in Uganda</p>
      </div>

      {/* Tab switcher */}
      <div style={s.toggleRow}>
        <button onClick={() => setTab("tips")} style={{ ...s.toggleBtn, ...(tab === "tips" ? s.toggleActive : {}) }}>💡 Tips</button>
        <button onClick={() => setTab("quiz")} style={{ ...s.toggleBtn, ...(tab === "quiz" ? s.toggleActive : {}) }}>🧠 Quiz</button>
      </div>

      {/* ── TIPS TAB ── */}
      {tab === "tips" && (
        <div>
          {/* Category filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{ ...s.catBtn, ...(category === cat ? s.catActive : {}) }}>{cat}</button>
            ))}
          </div>
          {/* Tips list */}
          {tips.map(tip => (
            <div key={tip.id} style={s.tipCard}>
              <div style={s.tipTop}>
                <span style={s.tipIcon}>{tip.icon}</span>
                <div>
                  <p style={s.tipTitle}>{tip.title}</p>
                  <span style={s.tipBadge}>{tip.category}</span>
                </div>
              </div>
              <p style={s.tipText}>{tip.tip}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── QUIZ TAB ── */}
      {tab === "quiz" && questions.length > 0 && !finished && (
        <div>
          {/* Progress */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: "#7f8c9a", fontSize: "13px" }}>Question {current + 1} of {questions.length}</span>
            <span style={{ color: "#2ecc71", fontSize: "13px" }}>Score: {score}</span>
          </div>
          <div style={s.barBg}>
            <div style={{ ...s.barFill, width: `${((current) / questions.length) * 100}%`, background: "#2980b9" }} />
          </div>

          {/* Question */}
          <div style={s.questionBox}>
            <p style={s.questionText}>{questions[current].question}</p>
          </div>

          {/* Options */}
          {questions[current].options.map((opt, i) => {
            let optStyle = { ...s.optionBtn };
            if (feedback) {
              if (i === feedback.correct_answer) optStyle = { ...optStyle, ...s.optionCorrect };
              else if (i === selected && !feedback.correct) optStyle = { ...optStyle, ...s.optionWrong };
            } else if (i === selected) {
              optStyle = { ...optStyle, ...s.optionSelected };
            }
            return (
              <button key={i} onClick={() => !feedback && setSelected(i)} style={optStyle}>
                <span style={s.optionLetter}>{["A", "B", "C", "D"][i]}</span> {opt}
              </button>
            );
          })}

          {/* Feedback */}
          {feedback && (
            <div style={{ ...s.feedbackBox, borderLeft: `4px solid ${feedback.correct ? "#2ecc71" : "#e74c3c"}`, marginBottom: "12px" }}>
              <p style={{ ...s.feedbackTitle, color: feedback.correct ? "#2ecc71" : "#e74c3c" }}>
                {feedback.correct ? "✅ Correct!" : "❌ Wrong!"}
              </p>
              <p style={s.feedbackItem}>{feedback.explanation}</p>
            </div>
          )}

          {/* Buttons */}
          {!feedback
            ? <button onClick={submitAnswer} style={s.btn} disabled={selected === null}>Submit Answer</button>
            : <button onClick={nextQuestion} style={s.btn}>
                {current + 1 >= questions.length ? "See Results" : "Next Question →"}
              </button>
          }
        </div>
      )}

      {/* ── QUIZ FINISHED ── */}
      {tab === "quiz" && finished && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <p style={{ fontSize: "48px", margin: "0 0 12px" }}>
            {score === questions.length ? "🏆" : score >= questions.length / 2 ? "👍" : "📖"}
          </p>
          <p style={{ color: "#ffffff", fontSize: "22px", fontWeight: "700", margin: "0 0 8px" }}>
            Quiz Complete!
          </p>
          <p style={{ color: getScoreColor(), fontSize: "32px", fontWeight: "700", margin: "0 0 8px" }}>
            {score} / {questions.length}
          </p>
          <p style={{ color: "#7f8c9a", fontSize: "14px", marginBottom: "24px" }}>
            {score === questions.length ? "Perfect score! You are a cybersecurity champion! 🇺🇬"
              : score >= questions.length / 2 ? "Good job! Keep learning to stay safer online."
              : "Keep studying — your online safety depends on it!"}
          </p>
          <button onClick={restartQuiz} style={s.btn}>🔄 Try Again</button>
        </div>
      )}
    </div>
  );
}
// ── STATS DASHBOARD ──────────────────────────────────────────
function StatsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/stats`)
      .then(r => { setStats(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <span style={s.cardIcon}>📊</span>
        <h2 style={s.cardTitle}>Stats Dashboard</h2>
      </div>
      <p style={{ color: "#7f8c9a", textAlign: "center" }}>Loading statistics...</p>
    </div>
  );

  if (!stats) return (
    <div style={s.card}>
      <p style={{ color: "#e74c3c", textAlign: "center" }}>Could not load stats. Make sure backend is running.</p>
    </div>
  );

  const statBoxes = [
    { label: "Passwords Checked", value: stats.totals.passwords_checked, icon: "🔐", color: "#2980b9" },
    { label: "Phishing Scans", value: stats.totals.phishing_checked, icon: "🎣", color: "#e67e22" },
    { label: "Port Scans", value: stats.totals.port_scans, icon: "🌐", color: "#9b59b6" },
    { label: "Quizzes Taken", value: stats.totals.quizzes_taken, icon: "🧠", color: "#2ecc71" },
    { label: "Quiz Avg Score", value: `${stats.quiz_average}%`, icon: "🏆", color: "#f1c40f" },
  ];

  const pwColors = { Strong: "#2ecc71", Good: "#f1c40f", Fair: "#f39c12", Weak: "#e67e22", "Very Weak": "#e74c3c" };
  const phishColors = { "Likely Safe": "#2ecc71", Suspicious: "#f39c12", "Likely Phishing": "#e67e22", Dangerous: "#e74c3c" };

  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <span style={s.cardIcon}>📊</span>
        <h2 style={s.cardTitle}>Stats Dashboard</h2>
        <p style={s.cardSubtitle}>Live usage statistics from the database</p>
      </div>

      {/* Stat boxes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
        {statBoxes.map((box, i) => (
          <div key={i} style={{ background: "#0f1923", borderRadius: "12px", padding: "16px", border: `1px solid ${box.color}33`, textAlign: "center" }}>
            <p style={{ fontSize: "24px", margin: "0 0 4px" }}>{box.icon}</p>
            <p style={{ color: box.color, fontSize: "28px", fontWeight: "700", margin: "0 0 4px" }}>{box.value}</p>
            <p style={{ color: "#7f8c9a", fontSize: "12px", margin: 0 }}>{box.label}</p>
          </div>
        ))}
      </div>

      {/* Password breakdown */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "#ffffff", fontWeight: "600", fontSize: "14px", marginBottom: "10px" }}>🔐 Password Strength Breakdown</p>
        {Object.entries(stats.password_breakdown).map(([label, count]) => {
          const total = stats.totals.passwords_checked || 1;
          const pct = Math.round((count / total) * 100);
          return (
            <div key={label} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ color: pwColors[label], fontSize: "13px" }}>{label}</span>
                <span style={{ color: "#7f8c9a", fontSize: "13px" }}>{count} ({pct}%)</span>
              </div>
              <div style={s.barBg}>
                <div style={{ ...s.barFill, width: `${pct}%`, background: pwColors[label] }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Phishing breakdown */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "#ffffff", fontWeight: "600", fontSize: "14px", marginBottom: "10px" }}>🎣 Phishing Scan Verdicts</p>
        {Object.entries(stats.phishing_breakdown).map(([label, count]) => {
          const total = stats.totals.phishing_checked || 1;
          const pct = Math.round((count / total) * 100);
          return (
            <div key={label} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ color: phishColors[label], fontSize: "13px" }}>{label}</span>
                <span style={{ color: "#7f8c9a", fontSize: "13px" }}>{count} ({pct}%)</span>
              </div>
              <div style={s.barBg}>
                <div style={{ ...s.barFill, width: `${pct}%`, background: phishColors[label] }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Port scan breakdown */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "#ffffff", fontWeight: "600", fontSize: "14px", marginBottom: "10px" }}>🌐 Port Scan Results</p>
        {Object.entries(stats.scan_breakdown).map(([label, count]) => {
          const total = stats.totals.port_scans || 1;
          const pct = Math.round((count / total) * 100);
          const scanColors = { Danger: "#e74c3c", Caution: "#f39c12", Good: "#2ecc71", Excellent: "#2ecc71" };
          return (
            <div key={label} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ color: scanColors[label], fontSize: "13px" }}>{label}</span>
                <span style={{ color: "#7f8c9a", fontSize: "13px" }}>{count} ({pct}%)</span>
              </div>
              <div style={s.barBg}>
                <div style={{ ...s.barFill, width: `${pct}%`, background: scanColors[label] }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent quiz results */}
      {stats.recent.quizzes.length > 0 && (
        <div>
          <p style={{ color: "#ffffff", fontWeight: "600", fontSize: "14px", marginBottom: "10px" }}>🧠 Recent Quiz Results</p>
          {stats.recent.quizzes.map((q, i) => (
            <div key={i} style={{ ...s.tipCard, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ color: "#7f8c9a", fontSize: "13px" }}>{q.date_taken}</span>
              <span style={{ color: q.percentage >= 80 ? "#2ecc71" : q.percentage >= 50 ? "#f39c12" : "#e74c3c", fontWeight: "700", fontSize: "14px" }}>
                {q.score}/{q.total} ({q.percentage}%)
              </span>
            </div>
          ))}
        </div>
      )}

      {stats.totals.passwords_checked === 0 && stats.totals.phishing_checked === 0 && stats.totals.quizzes_taken === 0 && (
        <div style={s.tipsBox}>
          <p style={s.tipsTitle}>📭 No data yet</p>
          <p style={s.tipsText}>Start using the other modules — check a password, scan a URL, or take the quiz. Your activity will appear here!</p>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────
function App() {
  const [activeModule, setActiveModule] = useState("password");

 const navItems = [
  { id: "password",  label: "🔐 Password" },
  { id: "phishing",  label: "🎣 Phishing" },
  { id: "scanner",   label: "🌐 Scanner" },
  { id: "awareness", label: "📚 Awareness" },
  { id: "stats",     label: "📊 Stats" },
];

  return (
    <div style={s.page}>
      <div style={s.nav}>
        <span style={s.navBrand}>🛡️ Uganda CyberShield</span>
        <div style={s.navLinks}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveModule(item.id)}
              style={{ ...s.navBtn, ...(activeModule === item.id ? s.navActive : {}) }}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {/* Hero Section */}
      {activeModule === "password" && (
        <div style={s.hero}>
          <div style={s.heroBadge}>🇺🇬 Made for Uganda</div>
          <h1 style={s.heroTitle}>Cyber attacks are rising<br />in Uganda.</h1>
          <p style={s.heroSubtitle}>Protect yourself today — for free.</p>
          <div style={s.heroStats}>
            <div style={s.heroStat}><span style={s.heroStatNum}>4</span><span style={s.heroStatLabel}>Security Tools</span></div>
            <div style={s.heroStatDivider}/>
            <div style={s.heroStat}><span style={s.heroStatNum}>100%</span><span style={s.heroStatLabel}>Free Forever</span></div>
            <div style={s.heroStatDivider}/>
            <div style={s.heroStat}><span style={s.heroStatNum}>24/7</span><span style={s.heroStatLabel}>Always Available</span></div>
          </div>
        </div>
      )}
      <div style={s.content}>
        {activeModule === "password" && <PasswordChecker />}
        {activeModule === "phishing" && <PhishingDetector />}
        {activeModule === "scanner" && <PortScanner />}
        {activeModule === "awareness" && <AwarenessHub />}
        {activeModule === "stats" && <StatsDashboard />}
      </div>
    </div>
  );
}

// ── STYLES ───────────────────────────────────────────────────
const s = {
  page: { minHeight: "100vh", background: "#0f1923", fontFamily: "Segoe UI, sans-serif" },
  nav: { background: "#1a2535", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #2c3e50", flexWrap: "wrap", gap: "10px" },
  navBrand: { color: "#ffffff", fontWeight: "700", fontSize: "18px" },
  navLinks: { display: "flex", gap: "8px", flexWrap: "wrap" },
  navBtn: { background: "transparent", border: "1px solid #2c3e50", color: "#7f8c9a", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "14px" },
  navActive: { background: "#2980b9", border: "1px solid #2980b9", color: "#ffffff" },
  content: { display: "flex", justifyContent: "center", padding: "40px 20px" },
  card: { background: "#1a2535", borderRadius: "16px", padding: "36px", width: "100%", maxWidth: "560px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" },
  cardHeader: { textAlign: "center", marginBottom: "28px" },
  cardIcon: { fontSize: "42px", display: "block", marginBottom: "8px" },
  cardTitle: { color: "#ffffff", fontSize: "22px", margin: "0 0 4px", fontWeight: "700" },
  cardSubtitle: { color: "#7f8c9a", fontSize: "14px", margin: 0 },
  toggleRow: { display: "flex", gap: "8px", marginBottom: "16px" },
  toggleBtn: { flex: 1, padding: "10px", background: "#0f1923", border: "1px solid #2c3e50", color: "#7f8c9a", borderRadius: "8px", cursor: "pointer", fontSize: "13px" },
  toggleActive: { background: "#2980b9", border: "1px solid #2980b9", color: "#ffffff" },
  inputRow: { display: "flex", gap: "8px", marginBottom: "12px" },
  input: { flex: 1, padding: "12px 16px", borderRadius: "10px", border: "1px solid #2c3e50", background: "#0f1923", color: "#ffffff", fontSize: "15px", outline: "none", width: "100%" },
  textarea: { width: "93%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #2c3e50", background: "#0f1923", color: "#ffffff", fontSize: "14px", outline: "none", minHeight: "100px", resize: "vertical", marginBottom: "12px", fontFamily: "Segoe UI, sans-serif" },
  eyeBtn: { background: "#2c3e50", border: "none", borderRadius: "10px", padding: "0 14px", cursor: "pointer", fontSize: "18px" },
  btn: { width: "100%", padding: "13px", background: "#2980b9", color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginBottom: "12px" },
  result: { marginBottom: "20px" },
  barBg: { height: "10px", background: "#2c3e50", borderRadius: "10px", overflow: "hidden", marginBottom: "10px" },
  barFill: { height: "100%", borderRadius: "10px", transition: "width 0.6s ease" },
  strengthLabel: { fontSize: "16px", margin: "0 0 12px" },
  feedbackBox: { background: "#0f1923", borderRadius: "10px", padding: "14px", marginBottom: "8px" },
  feedbackTitle: { fontWeight: "600", margin: "0 0 8px", fontSize: "14px" },
  feedbackItem: { color: "#bdc3c7", fontSize: "14px", margin: "4px 0" },
  tipsBox: { background: "#162033", border: "1px solid #1e3a5f", borderRadius: "10px", padding: "14px" },
  tipsTitle: { color: "#3498db", fontWeight: "600", margin: "0 0 6px", fontSize: "13px" },
  tipsText: { color: "#7f8c9a", fontSize: "13px", margin: 0, lineHeight: "1.5" },
  catBtn: { padding: "6px 12px", borderRadius: "20px", border: "1px solid #2c3e50", background: "#0f1923", color: "#7f8c9a", cursor: "pointer", fontSize: "12px" },
  catActive: { background: "#2980b9", border: "1px solid #2980b9", color: "#ffffff" },
  tipCard: { background: "#0f1923", borderRadius: "12px", padding: "16px", marginBottom: "12px", border: "1px solid #2c3e50" },
  tipTop: { display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "8px" },
  tipIcon: { fontSize: "24px", flexShrink: 0 },
  tipTitle: { color: "#ffffff", fontWeight: "600", fontSize: "15px", margin: "0 0 4px" },
  tipBadge: { background: "#1e3a5f", color: "#3498db", fontSize: "11px", padding: "2px 8px", borderRadius: "10px" },
  tipText: { color: "#7f8c9a", fontSize: "13px", lineHeight: "1.6", margin: 0 },
  questionBox: { background: "#0f1923", borderRadius: "10px", padding: "16px", marginBottom: "16px", border: "1px solid #2c3e50" },
  questionText: { color: "#ffffff", fontSize: "15px", lineHeight: "1.6", margin: 0 },
  optionBtn: { width: "100%", padding: "12px 16px", marginBottom: "8px", background: "#0f1923", border: "1px solid #2c3e50", color: "#bdc3c7", borderRadius: "10px", cursor: "pointer", fontSize: "14px", textAlign: "left", display: "flex", alignItems: "center", gap: "10px" },
  optionSelected: { background: "#1e3a5f", border: "1px solid #2980b9", color: "#ffffff" },
  optionCorrect: { background: "#1a3a2a", border: "1px solid #2ecc71", color: "#2ecc71" },
  optionWrong: { background: "#3a1a1a", border: "1px solid #e74c3c", color: "#e74c3c" },
  optionLetter: { background: "#2c3e50", borderRadius: "50%", width: "24px", height: "24px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", flexShrink: 0 },
hero: { background: "linear-gradient(135deg, #0f1923 0%, #1a2535 50%, #0f1923 100%)", borderBottom: "1px solid #2c3e50", padding: "48px 20px 40px", textAlign: "center" },
  heroBadge: { display: "inline-block", background: "#1e3a5f", color: "#3498db", fontSize: "13px", fontWeight: "600", padding: "6px 16px", borderRadius: "20px", marginBottom: "20px", border: "1px solid #2980b9" },
  heroTitle: { color: "#ffffff", fontSize: "36px", fontWeight: "700", margin: "0 0 12px", lineHeight: "1.3" },
  heroSubtitle: { color: "#7f8c9a", fontSize: "18px", margin: "0 0 32px", lineHeight: "1.5" },
  heroStats: { display: "flex", justifyContent: "center", alignItems: "center", gap: "0", background: "#1a2535", border: "1px solid #2c3e50", borderRadius: "12px", padding: "16px 32px", maxWidth: "420px", margin: "0 auto" },
  heroStat: { display: "flex", flexDirection: "column", alignItems: "center", padding: "0 24px" },
  heroStatNum: { color: "#2980b9", fontSize: "22px", fontWeight: "700" },
  heroStatLabel: { color: "#7f8c9a", fontSize: "11px", marginTop: "2px" },
  heroStatDivider: { width: "1px", height: "36px", background: "#2c3e50" },
};

export default App;