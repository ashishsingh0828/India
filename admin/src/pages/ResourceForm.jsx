import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { resource } from "../api";
import { getResources } from "../config";
import { FieldInput, PageHeader, Spinner, Icon, useToast } from "../components/ui";

const emptyFor = (cfg) => {
  const v = {};
  cfg.sections.forEach((s) => s.fields.forEach((f) => (v[f.name] = f.type === "switch" ? false : f.type === "image" ? "" : "")));
  return { ...v, ...cfg.defaults };
};

export default function ResourceForm() {
  const { resource: rk, id } = useParams();
  const cfg = getResources()[rk];
  const nav = useNavigate();
  const toast = useToast();
  const [values, setValues] = useState(() => (cfg ? emptyFor(cfg) : {}));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!cfg) return;
    setErrors({});
    if (!id) { setValues(emptyFor(cfg)); setLoading(false); return; }
    setLoading(true);
    resource(cfg.key).get(id)
      .then((it) => setValues({ ...emptyFor(cfg), ...it }))
      .catch((e) => { toast(e.message, "err"); nav(`/${cfg.key}`); })
      .finally(() => setLoading(false));
  }, [rk, id]); // eslint-disable-line

  if (!cfg) return <Navigate to="/" replace />;
  if (loading) return <Spinner />;

  const set = (name) => (v) => { setValues((s) => ({ ...s, [name]: v })); if (errors[name]) setErrors((e) => ({ ...e, [name]: "" })); };

  const validate = () => {
    const e = {};
    cfg.sections.forEach((s) => s.fields.forEach((f) => {
      if (f.required && !values[f.name]) e[f.name] = `${f.label} is required`;
    }));
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      toast("Please fill in the required fields", "err");
      document.querySelector(".has-err")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSaving(true);
    try {
      id ? await resource(cfg.key).update(id, values) : await resource(cfg.key).create(values);
      toast(`${cfg.label} ${id ? "updated" : "created"}`);
      nav(`/${cfg.key}`);
    } catch (e) { toast(e.message, "err"); setSaving(false); }
  };

  return (
    <form onSubmit={submit} noValidate>
      <PageHeader title={id ? `Edit ${cfg.label}` : `New ${cfg.label}`} subtitle="Fields marked * are required.">
        <Link className="btn ghost" to={`/${cfg.key}`}><Icon n="left" size={16} /> Back</Link>
      </PageHeader>

      {cfg.sections.map((s, i) => (
        <section className="card form-card" key={s.title} style={{ animationDelay: `${i * 70}ms` }}>
          <div className="card-top"><div><h3>{s.title}</h3>{s.desc && <p className="muted small">{s.desc}</p>}</div></div>
          <div className={`grid ${s.cols === 3 ? "three" : s.cols === 2 ? "two-img" : ""}`}>
            {s.fields.map((f) => (
              <div key={f.name} className={f.wide || f.type === "textarea" ? "span-2" : ""}>
                <FieldInput field={f} value={values[f.name]} onChange={set(f.name)} error={errors[f.name]} />
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="savebar">
        <Link className="btn ghost" to={`/${cfg.key}`}>Cancel</Link>
        <button className="btn" disabled={saving}>{saving ? "Saving…" : id ? "Save changes" : `Create ${cfg.label.toLowerCase()}`}</button>
      </div>
    </form>
  );
}
