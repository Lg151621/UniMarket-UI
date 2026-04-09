import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Messages.css";

export default function Messages() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [threads, setThreads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [thread, setThread] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }

    fetch(`http://localhost:8080/messages/user/${user.id}`)
      .then((r) => r.json())
      .then((msgs) => {
        const threadMap = new Map();
        msgs.forEach((m) => {
          const otherId = m.senderId === user.id ? m.receiverId : m.senderId;
          const otherName = m.senderId === user.id ? m.receiverName : m.senderName;
          const key = `${Math.min(user.id, otherId)}-${Math.max(user.id, otherId)}-${m.listingId}`;
          if (!threadMap.has(key)) {
            threadMap.set(key, { key, otherId, otherName, listingId: m.listingId, listingTitle: m.listingTitle, lastMessage: m.content });
          } else {
            threadMap.get(key).lastMessage = m.content;
          }
        });
        setThreads([...threadMap.values()]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (!user) return null;

  async function selectThread(t) {
    setSelected(t.key);
    try {
      const res = await fetch(`http://localhost:8080/messages/thread?userA=${user.id}&userB=${t.otherId}&listingId=${t.listingId}`);
      const data = await res.json();
      setThread(data);
    } catch {}
  }

  async function sendMessage() {
    if (!input.trim() || !selected) return;
    const t = threads.find((x) => x.key === selected);
    if (!t) return;
    try {
      const res = await fetch("http://localhost:8080/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: user.id, receiverId: t.otherId, listingId: t.listingId, content: input.trim() }),
      });
      const msg = await res.json();
      setThread((prev) => [...prev, msg]);
      setInput("");
    } catch {}
  }

  const selectedThread = threads.find((t) => t.key === selected);

  return (
    <div className="page">
      <Navbar />
      <main className="page-content">
        <section className="page-hero">
          <p className="page-label">Inbox</p>
          <h1>Messages</h1>
          <p className="page-subtext">
            Stay in touch with buyers and sellers in your campus community.
          </p>
        </section>

        <div className="messages-layout">
          <div className="conversations-panel">
            <h3 className="panel-title">Conversations</h3>
            {loading ? (
              <div className="convo-empty"><p>Loading...</p></div>
            ) : threads.length === 0 ? (
              <div className="convo-empty">
                <p>No conversations yet.</p>
                <p>Message a seller from a listing to get started.</p>
              </div>
            ) : (
              threads.map((t) => (
                <button
                  key={t.key}
                  className={`convo-item ${selected === t.key ? "convo-active" : ""}`}
                  onClick={() => selectThread(t)}
                >
                  <div className="convo-name">{t.otherName}</div>
                  <div className="convo-preview">{t.listingTitle} — {t.lastMessage}</div>
                </button>
              ))
            )}
          </div>

          <div className="thread-panel">
            {selectedThread ? (
              <>
                <div className="thread-header">
                  <span>{selectedThread.otherName}</span>
                  <span className="thread-listing">Re: {selectedThread.listingTitle}</span>
                </div>
                <div className="thread-messages">
                  {thread.map((msg) => (
                    <div key={msg.id} className={`message-bubble ${msg.senderId === user.id ? "from-me" : "from-them"}`}>
                      {msg.content}
                    </div>
                  ))}
                </div>
                <div className="thread-input">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button className="send-btn" onClick={sendMessage}>Send</button>
                </div>
              </>
            ) : (
              <div className="thread-empty">
                <div className="empty-icon">💬</div>
                <h2>No conversation selected</h2>
                <p>Choose a conversation from the left or message a seller from a listing.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
