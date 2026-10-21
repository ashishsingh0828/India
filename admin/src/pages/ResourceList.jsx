import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { resource, idOf, asset } from "../api";
import { getResources } from "../config";
import { Icon, PageHeader, Badge, Spinner, ConfirmModal, useToast } from "../components/ui";

const PAGE = 8;
const fmt = (d) => new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

export default function ResourceList() {
  const { resource: rk } = useParams();
  const cfg = getResources()[rk];
  const toast = useToast();
  const [items, setItems] = useState(null);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!cfg) return;
    setItems(null); setErr(""); setQ(""); setStatus("all"); setPage(1);
    resource(cfg.key).list().then(setItems).catch((e) => setErr(e.message));
  }, [rk]); // eslint-disable-line

  const filtered = useMemo(() => {
    if (!items) return [];
    const s = q.trim().toLowerCase();
    return items.filter((x) =>
      (status === "all" || (status === "published") === !!x.published) &&
      (!s || `${x[cfg.titleField]} ${x[cfg.categoryField] || ""}`.toLowerCase().includes(s)));
  }, [items, q, status, cfg]);

  if (!cfg) return <Navigate to="/" replace />;

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const view = filtered.slice((page - 1) * PAGE, page * PAGE);

  const remove = async () => {
    setBusy(true);
    try {
      await resource(cfg.key).remove(idOf(target));
      setItems((s) => s.filter((x) => idOf(x) !== idOf(target)));
      toast(`${cfg.label} deleted`);
      setTarget(null);
    } catch (e) { toast(e.message, "err"); }
    setBusy(false);
  };

  return (
    <>
      <PageHeader title={cfg.plural} subtitle={`Manage the ${cfg.plural.toLowerCase()} shown on your website.`}>
        <Link className="btn" to={`/${cfg.key}/new`}><Icon n="plus" size={16} /> Add {cfg.label}</Link>
      </PageHeader>

      <div className="card">
        <div className="toolbar">
          <span className="search">
            <Icon n="search" size={17} />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder={`Search ${cfg.plural.toLowerCase()}…`} />
          </span>
          <div className="seg">
            {["all", "published", "draft"].map((s) => (
              <button key={s} className={status === s ? "on" : ""} onClick={() => { setStatus(s); setPage(1); }}>{s[0].toUpperCase() + s.slice(1)}</button>
            ))}
          </div>
        </div>

        {err && <div className="alert">{err}</div>}
        {!items && !err ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <div className="empty">
            <Icon n={cfg.icon} size={34} />
            <h4>{items?.length ? "No results found" : `No ${cfg.plural.toLowerCase()} yet`}</h4>
            <p>{items?.length ? "Try a different search or filter." : `Create your first ${cfg.label.toLowerCase()} to see it here.`}</p>
            {!items?.length && <Link className="btn" to={`/${cfg.key}/new`}><Icon n="plus" size={16} /> Add {cfg.label}</Link>}
          </div>
        ) : (
          <div className="table-wrap">
            <table className="rtable">
              <thead>
                <tr><th>Image</th><th>Title</th>{cfg.categoryField && <th>Category</th>}<th>Status</th><th>Updated</th><th className="r">Actions</th></tr>
              </thead>
              <tbody>
                {view.map((it, i) => (
                  <tr key={idOf(it)} style={{ animationDelay: `${i * 40}ms` }}>
                    <td data-label="Image"><img className="thumb" src={asset(it[cfg.imageField]) || undefined} alt="" /></td>
                    <td data-label="Title"><Link className="row-title" to={`/${cfg.key}/${idOf(it)}/edit`}>{it[cfg.titleField]}</Link><small>/{it.slug}</small></td>
                    {cfg.categoryField && <td data-label="Category">{it[cfg.categoryField] || "—"}</td>}
                    <td data-label="Status"><Badge ok={it.published}>{it.published ? "Published" : "Draft"}</Badge></td>
                    <td data-label="Updated">{fmt(it.updatedAt)}</td>
                    <td data-label="Actions" className="r">
                      <span className="row-actions">
                        <Link className="icon-btn" to={`/${cfg.key}/${idOf(it)}/edit`} aria-label="Edit" title="Edit"><Icon n="edit" size={17} /></Link>
                        <button className="icon-btn danger" onClick={() => setTarget(it)} aria-label="Delete" title="Delete"><Icon n="trash" size={17} /></button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > PAGE && (
          <div className="pager">
            <small>Showing {(page - 1) * PAGE + 1}–{Math.min(page * PAGE, filtered.length)} of {filtered.length}</small>
            <div>
              <button className="icon-btn" disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous page"><Icon n="left" size={16} /></button>
              {Array.from({ length: pages }, (_, i) => (
                <button key={i} className={`pg ${page === i + 1 ? "on" : ""}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
              <button className="icon-btn" disabled={page === pages} onClick={() => setPage(page + 1)} aria-label="Next page"><Icon n="right" size={16} /></button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!target} busy={busy}
        title={`Delete this ${cfg.label.toLowerCase()}?`}
        text={target ? `“${target[cfg.titleField]}” will be permanently removed. This can’t be undone.` : ""}
        onConfirm={remove} onCancel={() => !busy && setTarget(null)}
      />
    </>
  );
}
