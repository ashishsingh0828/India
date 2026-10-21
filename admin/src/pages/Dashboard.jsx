import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { resource, contacts, idOf, asset } from "../api";
import { getResources, RESOURCE_KEYS } from "../config";
import { Icon, PageHeader, Badge, Spinner } from "../components/ui";

const fmt = (d) => new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

export default function Dashboard() {
  const RESOURCES = getResources();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    Promise.all([...RESOURCE_KEYS.map((k) => resource(k).list()), contacts.list()])
      .then((lists) => setData({ ...Object.fromEntries(RESOURCE_KEYS.map((k, i) => [k, lists[i]])), _msgs: lists[RESOURCE_KEYS.length] }))
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <div className="alert">{err}</div>;
  if (!data) return <Spinner />;

  const recent = RESOURCE_KEYS.flatMap((k) => data[k].map((it) => ({ ...it, _k: k })))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Here’s what’s happening on your website content.">
        {RESOURCE_KEYS.map((k) => (
          <Link key={k} className="btn ghost" to={`/${k}/new`}><Icon n="plus" size={16} /> {RESOURCES[k].label}</Link>
        ))}
      </PageHeader>

      <div className="stats">
        {RESOURCE_KEYS.map((k, i) => {
          const list = data[k];
          const pub = list.filter((x) => x.published).length;
          return (
            <Link key={k} to={`/${k}`} className="stat" style={{ "--c": RESOURCES[k].color, animationDelay: `${i * 90}ms` }}>
              <span className="stat-icon"><Icon n={RESOURCES[k].icon} size={22} /></span>
              <div>
                <small>{RESOURCES[k].plural}</small>
                <strong>{list.length}</strong>
                <span className="stat-sub">{pub} published · {list.length - pub} draft</span>
              </div>
              <Icon n="arrow" size={18} />
            </Link>
          );
        })}
        <Link to="/contacts" className="stat" style={{ "--c": "#96722F", animationDelay: `${RESOURCE_KEYS.length * 90}ms` }}>
          <span className="stat-icon"><Icon n="mail" size={22} /></span>
          <div>
            <small>Messages</small>
            <strong>{data._msgs.length}</strong>
            <span className="stat-sub">{data._msgs.filter((m) => !m.read).length} unread</span>
          </div>
          <Icon n="arrow" size={18} />
        </Link>
      </div>

      <div className="card">
        <div className="card-top"><h3>Recently updated</h3></div>
        {recent.length === 0 ? (
          <p className="muted">Nothing here yet.</p>
        ) : (
          <ul className="recent">
            {recent.map((it) => (
              <li key={it._k + idOf(it)}>
                <img src={asset(it[RESOURCES[it._k].imageField]) || undefined} alt="" />
                <div className="recent-main">
                  <Link to={`/${it._k}/${idOf(it)}/edit`}>{it.title}</Link>
                  <small>{RESOURCES[it._k].label} · {fmt(it.updatedAt)}</small>
                </div>
                <Badge ok={it.published}>{it.published ? "Published" : "Draft"}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
