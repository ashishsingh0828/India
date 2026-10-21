import { useEffect, useState } from "react";
import { contacts, getSite, SITES } from "../api";
import { Icon, PageHeader, Spinner, Badge, ConfirmModal, useToast } from "../components/ui";

const fmt = (d) => new Date(d).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function Contacts() {
  const toast = useToast();
  const [items, setItems] = useState(null);
  const [err, setErr] = useState("");
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const siteLabel = SITES.find((s) => s.key === getSite())?.label;

  useEffect(() => { contacts.list().then(setItems).catch((e) => setErr(e.message)); }, []);

  const toggle = async (m) => {
    setItems((s) => s.map((x) => (x.id === m.id ? { ...x, read: !m.read } : x)));
    try { await contacts.setRead(m.id, !m.read); } catch (e) { toast(e.message, "err"); }
  };
  const remove = async () => {
    setBusy(true);
    try {
      await contacts.remove(target.id);
      setItems((s) => s.filter((x) => x.id !== target.id));
      toast("Message deleted");
      setTarget(null);
    } catch (e) { toast(e.message, "err"); }
    setBusy(false);
  };

  return (
    <>
      <PageHeader title="Messages" subtitle={`Contact form submissions from the ${siteLabel} website.`} />
      {err && <div className="alert">{err}</div>}
      {!items && !err ? <Spinner /> : items?.length === 0 ? (
        <div className="card"><div className="empty"><Icon n="mail" size={34} /><h4>No messages yet</h4><p>Messages sent from the contact page will appear here.</p></div></div>
      ) : (
        <div className="msgs">
          {items?.map((m, i) => (
            <article key={m.id} className={`card msg ${m.read ? "" : "unread"}`} style={{ animationDelay: `${i * 50}ms` }}>
              <div className="msg-top">
                <div>
                  <h4>{!m.read && <span className="dot" />}{m.name}</h4>
                  <small>{m.email}{m.phone ? ` · ${m.phone}` : ""}</small>
                </div>
                <div className="msg-meta"><Badge ok={!m.read}>{m.read ? "Read" : "New"}</Badge><small>{fmt(m.createdAt)}</small></div>
              </div>
              {m.subject && <strong className="msg-subject">{m.subject}</strong>}
              {(m.company || m.address) && (
                <small className="msg-extra">{[m.company, m.address].filter(Boolean).join(" · ")}</small>
              )}
              <p>{m.message}</p>
              <div className="msg-actions">
                <a className="btn sm" href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "Your enquiry")}`}><Icon n="mail" size={15} /> Reply</a>
                <button className="btn sm ghost" onClick={() => toggle(m)}><Icon n="check" size={15} /> Mark as {m.read ? "unread" : "read"}</button>
                <button className="btn sm danger" onClick={() => setTarget(m)}><Icon n="trash" size={15} /> Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
      <ConfirmModal open={!!target} busy={busy} title="Delete this message?" text={target ? `The message from ${target.name} will be permanently removed.` : ""}
        onConfirm={remove} onCancel={() => !busy && setTarget(null)} />
    </>
  );
}
