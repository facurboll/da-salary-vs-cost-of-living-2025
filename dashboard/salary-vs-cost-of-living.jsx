import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, CartesianGrid, LineChart, Line, ComposedChart } from "recharts";

const C = {
  bg: "#06080d",
  card: "#0d1117",
  border: "#1b2332",
  accent1: "#34d399",
  accent1d: "#065f46",
  accent2: "#60a5fa",
  accent2d: "#1e3a5f",
  accent3: "#fbbf24",
  accent3d: "#78350f",
  text: "#e8edf5",
  sub: "#8b99ad",
  dim: "#4e5a6e",
  danger: "#f87171",
  white: "#fff",
};

const fmt = (n) => "$" + Math.round(n).toLocaleString("en-US");
const KEYS = { Junior: "jr", "Semi Senior": "ssr", Senior: "sr" };

const scenarios = [
  {
    id: "ar", label: "Argentina Local", short: "AR Local", color: C.accent1, bg: C.accent1d,
    jr: [600, 750, 900], ssr: [1000, 1250, 1500], sr: [1800, 2200, 2800],
    note: "Incluye grandes empresas y PyMEs. Salario bruto convertido a USD al TC blue/MEP.",
    src: "SysArmy, HuCap, Glassdoor AR, Coderhouse"
  },
  {
    id: "remote", label: "Remoto LATAM", short: "Remoto", color: C.accent3, bg: C.accent3d,
    jr: [1500, 2000, 2500], ssr: [2500, 3200, 4000], sr: [4000, 5000, 6500],
    note: "Contractor para empresas US/EU. Cobro en USD. Sin obra social ni aguinaldo.",
    src: "Near, Interfell, RemoteRocketship, Tecla, GetOnBoard"
  },
  {
    id: "us", label: "EEUU Local", short: "EEUU", color: C.accent2, bg: C.accent2d,
    jr: [4500, 5500, 6500], ssr: [6500, 7500, 8500], sr: [8000, 9500, 11000],
    note: "Salario bruto. Luego de impuestos federales+estatales queda ~70-78% según estado.",
    src: "BLS, Glassdoor, Indeed, Salary.com, ZipRecruiter"
  },
];

const cities = [
  { name: "Corrientes", flag: "🇦🇷", grp: "ar", rent: 180, expensas: 40, utilities: 35, transport: 20, groceries: 150, health: 35, total: 460 },
  { name: "Buenos Aires", flag: "🇦🇷", grp: "ar", rent: 500, expensas: 80, utilities: 50, transport: 30, groceries: 200, health: 50, total: 910 },
  { name: "Córdoba", flag: "🇦🇷", grp: "ar", rent: 350, expensas: 55, utilities: 40, transport: 25, groceries: 170, health: 40, total: 680 },
  { name: "Austin, TX", flag: "🇺🇸", grp: "us", rent: 1400, expensas: 0, utilities: 200, transport: 250, groceries: 450, health: 400, total: 2700 },
  { name: "Miami, FL", flag: "🇺🇸", grp: "us", rent: 1800, expensas: 0, utilities: 180, transport: 200, groceries: 480, health: 450, total: 3110 },
  { name: "New York, NY", flag: "🇺🇸", grp: "us", rent: 3100, expensas: 0, utilities: 200, transport: 130, groceries: 500, health: 450, total: 4380 },
];

const Tip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div style={{ background: "#1a2030", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <p style={{ fontWeight: 700, margin: "0 0 6px", color: C.text }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill, margin: "2px 0" }}>
          {p.name}: <strong>{typeof p.value === "number" ? fmt(p.value) : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

function Card({ children, style }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 14, padding: "22px 24px", ...style
    }}>{children}</div>
  );
}

function Pill({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 20px", borderRadius: 24,
      border: active ? `2px solid ${C.accent3}` : `1px solid ${C.border}`,
      cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.15s",
      background: active ? C.accent3 + "18" : "transparent",
      color: active ? C.accent3 : C.sub,
    }}>{children}</button>
  );
}

function Head({ title, sub, icon }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
        {icon && <span style={{ fontSize: 20 }}>{icon}</span>}{title}
      </h2>
      {sub && <p style={{ color: C.dim, fontSize: 12, margin: "4px 0 0", lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}

function SalaryGrouped({ sk }) {
  const data = scenarios.map(s => ({
    name: s.short, Mínimo: s[sk][0], Promedio: s[sk][1], Máximo: s[sk][2],
  }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barGap={4} barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
        <XAxis dataKey="name" tick={{ fill: C.sub, fontSize: 12, fontWeight: 600 }} />
        <YAxis tick={{ fill: C.dim, fontSize: 11 }} tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(1)+"k" : v}`} />
        <Tooltip content={<Tip />} />
        <Legend wrapperStyle={{ fontSize: 11, color: C.sub }} />
        <Bar dataKey="Mínimo" fill="#374151" radius={[3,3,0,0]} />
        <Bar dataKey="Promedio" fill={C.accent3} radius={[3,3,0,0]} />
        <Bar dataKey="Máximo" fill={C.accent2} radius={[3,3,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ProgressionChart() {
  const data = ["Junior", "Semi Senior", "Senior"].map(lvl => {
    const sk = KEYS[lvl];
    return { name: lvl, "AR Local": scenarios[0][sk][1], "Remoto": scenarios[1][sk][1], "EEUU": scenarios[2][sk][1] };
  });
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
        <XAxis dataKey="name" tick={{ fill: C.sub, fontSize: 12 }} />
        <YAxis tick={{ fill: C.dim, fontSize: 11 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
        <Tooltip content={<Tip />} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line type="monotone" dataKey="AR Local" stroke={C.accent1} strokeWidth={3} dot={{ r: 5, fill: C.accent1 }} />
        <Line type="monotone" dataKey="Remoto" stroke={C.accent3} strokeWidth={3} dot={{ r: 5, fill: C.accent3 }} />
        <Line type="monotone" dataKey="EEUU" stroke={C.accent2} strokeWidth={3} dot={{ r: 5, fill: C.accent2 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function CostChart() {
  const data = cities.map(c => ({
    name: `${c.flag} ${c.name}`, Alquiler: c.rent, Expensas: c.expensas,
    Servicios: c.utilities, Transporte: c.transport, Canasta: c.groceries, Salud: c.health,
  }));
  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={data} layout="vertical" barSize={14}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
        <XAxis type="number" tick={{ fill: C.dim, fontSize: 11 }} tickFormatter={v => `$${v}`} />
        <YAxis type="category" dataKey="name" tick={{ fill: C.text, fontSize: 12 }} width={120} />
        <Tooltip content={<Tip />} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="Alquiler" stackId="a" fill={C.accent2} />
        <Bar dataKey="Expensas" stackId="a" fill="#818cf8" />
        <Bar dataKey="Servicios" stackId="a" fill={C.accent3} />
        <Bar dataKey="Transporte" stackId="a" fill="#fb923c" />
        <Bar dataKey="Canasta" stackId="a" fill={C.accent1} />
        <Bar dataKey="Salud" stackId="a" fill={C.danger} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function SavingsChart({ sk }) {
  const rows = [];
  cities.filter(c => c.grp === "ar").forEach(c => {
    rows.push({ name: `${c.flag} ${c.name} (Local)`, savings: scenarios[0][sk][1] - c.total, col: C.accent1 });
    rows.push({ name: `${c.flag} ${c.name} (Remoto)`, savings: scenarios[1][sk][1] - c.total, col: C.accent3 });
  });
  cities.filter(c => c.grp === "us").forEach(c => {
    rows.push({ name: `${c.flag} ${c.name}`, savings: scenarios[2][sk][1] - c.total, col: C.accent2 });
  });
  rows.sort((a, b) => b.savings - a.savings);
  return (
    <ResponsiveContainer width="100%" height={460}>
      <BarChart data={rows} layout="vertical" margin={{ left: 0, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
        <XAxis type="number" tick={{ fill: C.dim, fontSize: 11 }} tickFormatter={v => fmt(v)} />
        <YAxis type="category" dataKey="name" tick={{ fill: C.text, fontSize: 11 }} width={175} />
        <Tooltip content={<Tip />} />
        <Bar dataKey="savings" name="Ahorro Neto USD/mes" barSize={16} radius={[0, 4, 4, 0]}>
          {rows.map((r, i) => <Cell key={i} fill={r.savings >= 0 ? r.col : C.danger} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function RatioChart({ sk }) {
  const all = [];
  cities.filter(c => c.grp === "ar").forEach(c => {
    all.push({ name: `${c.name} (Local)`, ratio: +(scenarios[0][sk][1] / c.total).toFixed(1) });
    all.push({ name: `${c.name} (Remoto)`, ratio: +(scenarios[1][sk][1] / c.total).toFixed(1) });
  });
  cities.filter(c => c.grp === "us").forEach(c => {
    all.push({ name: c.name, ratio: +(scenarios[2][sk][1] / c.total).toFixed(1) });
  });
  all.sort((a, b) => b.ratio - a.ratio);
  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart data={all} layout="vertical" barSize={18}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
        <XAxis type="number" tick={{ fill: C.dim, fontSize: 11 }} domain={[0, "auto"]} />
        <YAxis type="category" dataKey="name" tick={{ fill: C.text, fontSize: 11 }} width={160} />
        <Tooltip formatter={(v) => `${v}x`} />
        <Bar dataKey="ratio" name="Ratio Salario/Costo" radius={[0, 6, 6, 0]}>
          {all.map((r, i) => <Cell key={i} fill={r.ratio >= 4 ? C.accent1 : r.ratio >= 2.5 ? C.accent3 : r.ratio >= 1.5 ? C.accent2 : C.danger} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function Dashboard() {
  const [sen, setSen] = useState("Semi Senior");
  const sk = KEYS[sen];

  const ins = useMemo(() => {
    const remCtes = scenarios[1][sk][1] - cities[0].total;
    const remBA = scenarios[1][sk][1] - cities[1].total;
    const usNY = scenarios[2][sk][1] - cities[5].total;
    const usAus = scenarios[2][sk][1] - cities[3].total;
    const ratio = (scenarios[1][sk][1] / scenarios[0][sk][1]).toFixed(1);
    const remCba = scenarios[1][sk][1] - cities[2].total;
    return { remCtes, remBA, usNY, usAus, ratio, remCba };
  }, [sk]);

  const purchaseRows = useMemo(() => {
    const savs = [
      { label: "🇦🇷 Ctes Local", s: scenarios[0][sk][1] - cities[0].total },
      { label: "🇦🇷 Ctes Remoto", s: scenarios[1][sk][1] - cities[0].total },
      { label: "🇦🇷 BA Remoto", s: scenarios[1][sk][1] - cities[1].total },
      { label: "🇺🇸 Austin", s: scenarios[2][sk][1] - cities[3].total },
      { label: "🇺🇸 NYC", s: scenarios[2][sk][1] - cities[5].total },
    ];
    const items = [
      { item: "iPhone 16 (~$1,000)", cost: 1000 },
      { item: "Notebook Pro (~$1,500)", cost: 1500 },
      { item: "Auto usado (~$10,000)", cost: 10000 },
      { item: "Viaje Europa 2 sem (~$3,000)", cost: 3000 },
    ];
    return { savs, items };
  }, [sk]);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* HERO */}
      <div style={{
        background: `linear-gradient(160deg, ${C.bg} 0%, #0f1629 40%, #1a0f2e 70%, ${C.bg} 100%)`,
        padding: "48px 24px 36px", textAlign: "center",
        borderBottom: `1px solid ${C.border}`, position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, background: "radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
        <p style={{ color: C.accent3, fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", margin: "0 0 12px" }}>
          Data Analytics Portfolio · Proyecto #3
        </p>
        <h1 style={{ fontSize: 30, fontWeight: 900, margin: "0 0 6px", lineHeight: 1.15, letterSpacing: -1.5, color: C.white }}>
          Salarios vs. Costo de Vida
        </h1>
        <p style={{ fontSize: 15, color: C.sub, margin: "0 0 4px", fontWeight: 500 }}>
          Data Analyst · Argentina · EEUU · Remoto LATAM
        </p>
        <p style={{ fontSize: 11, color: C.dim, margin: "0 0 24px" }}>
          Datos sintéticos calibrados · Abril 2026 · TC ref: ARS 1.400/USD
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {["Junior", "Semi Senior", "Senior"].map(s => (
            <Pill key={s} active={sen === s} onClick={() => setSen(s)}>{s}</Pill>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "24px 16px 60px", display: "flex", flexDirection: "column", gap: 22 }}>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {scenarios.map((s, i) => (
            <Card key={i} style={{ background: s.bg + "33", borderColor: s.color + "33", textAlign: "center" }}>
              <p style={{ fontSize: 10, color: C.dim, margin: 0, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>{s.short}</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: s.color, margin: "4px 0 0", fontFamily: "'Space Mono', monospace", letterSpacing: -1 }}>{fmt(s[sk][1])}</p>
              <p style={{ fontSize: 10, color: C.dim, margin: "2px 0 0" }}>USD/mes promedio</p>
            </Card>
          ))}
        </div>

        {/* Multiplier */}
        <Card style={{ background: "linear-gradient(135deg, #1a0f2e 0%, #0f1629 100%)", borderColor: C.accent3 + "44", textAlign: "center", padding: "18px 24px" }}>
          <p style={{ fontSize: 13, color: C.sub, margin: 0 }}>
            Un <strong style={{ color: C.accent3 }}>{sen}</strong> remoto gana{" "}
            <span style={{ fontSize: 28, fontWeight: 900, color: C.accent3, fontFamily: "'Space Mono', monospace" }}>{ins.ratio}x</span>
            {" "}más que uno local en Argentina y ahorra{" "}
            <strong style={{ color: C.accent1 }}>{fmt(ins.remCtes)}/mes</strong> viviendo en Corrientes.
          </p>
        </Card>

        {/* 1. Salary */}
        <Card>
          <Head icon="📊" title="Comparativa Salarial" sub={`Rango Data Analyst ${sen} — min / promedio / máx — USD/mes`} />
          <SalaryGrouped sk={sk} />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            {scenarios.map((s, i) => (
              <span key={i} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 12, background: s.color + "15", color: s.color, fontWeight: 600 }}>
                {s.label}: {s.src}
              </span>
            ))}
          </div>
        </Card>

        {/* 2. Progression */}
        <Card>
          <Head icon="📈" title="Progresión Salarial Jr → Sr" sub="Salario promedio USD/mes por seniority" />
          <ProgressionChart />
          <p style={{ fontSize: 11, color: C.dim, marginTop: 8 }}>
            La curva de Remoto LATAM muestra el mayor salto absoluto: de USD 2.000 (Jr) a USD 5.000 (Sr) = +150%. En AR local el crecimiento relativo es similar (~2.9x) pero desde una base 2.7x menor. EEUU crece +73% de Jr a Sr con la base más alta.
          </p>
        </Card>

        {/* 3. Cost */}
        <Card>
          <Head icon="🏠" title="Costo de Vida por Ciudad" sub="Monoambiente · persona sola · alquiler + expensas + servicios + transporte + canasta + salud — USD/mes" />
          <CostChart />
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, fontSize: 11 }}>
            {[
              { color: C.accent1, title: "Argentina", text: "Prepaga básica ~$35-50/mes. Monoambiente Corrientes ~$180 vs CABA ~$500. Canasta INDEC (persona sola) ~$150-200." },
              { color: C.accent2, title: "EEUU", text: "Health insurance $400-450/mes sin empleador — costo invisible que no existe en AR. NYC triplica el alquiler de Austin." },
              { color: C.accent3, title: "Remoto", text: "Mismo costo de vida que AR local pero salario en USD. Todo el delta es ahorro, inversión o calidad de vida extra." },
            ].map((b, i) => (
              <div key={i} style={{ padding: 10, background: b.color + "10", borderRadius: 8, borderLeft: `3px solid ${b.color}` }}>
                <strong style={{ color: b.color }}>{b.title}:</strong>
                <span style={{ color: C.sub }}> {b.text}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 4. Savings */}
        <Card>
          <Head icon="💰" title="Ahorro Neto Mensual" sub={`Salario ${sen} promedio − costo de vida total. Rojo = déficit.`} />
          <SavingsChart sk={sk} />
        </Card>

        {/* 5. Ratio */}
        <Card>
          <Head icon="⚖️" title="Poder Adquisitivo Real" sub={`Ratio salario ${sen} / costo de vida básico mensual`} />
          <RatioChart sk={sk} />
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {[
              { l: "≥ 4x Excelente", c: C.accent1 },
              { l: "2.5x–4x Cómodo", c: C.accent3 },
              { l: "1.5x–2.5x Ajustado", c: C.accent2 },
              { l: "< 1.5x Deficitario", c: C.danger },
            ].map((b, i) => (
              <span key={i} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 10, background: b.c + "18", color: b.c, fontWeight: 600 }}>{b.l}</span>
            ))}
          </div>
        </Card>

        {/* 6. Purchasing Power */}
        <Card>
          <Head icon="🛒" title="Poder de Compra Concreto" sub={`Meses de ahorro neto de un ${sen} para compras reales`} />
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                  <th style={{ textAlign: "left", padding: "10px 8px", color: C.dim, fontWeight: 600 }}>Objetivo</th>
                  {purchaseRows.savs.map((s, i) => (
                    <th key={i} style={{ textAlign: "center", padding: "10px 6px", color: i < 3 ? (i === 0 ? C.accent1 : C.accent3) : C.accent2, fontSize: 11 }}>{s.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {purchaseRows.items.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "10px 8px", fontWeight: 500, color: C.sub }}>{row.item}</td>
                    {purchaseRows.savs.map((s, j) => {
                      const months = s.s > 0 ? Math.ceil(row.cost / s.s) : null;
                      return (
                        <td key={j} style={{
                          textAlign: "center", padding: "10px 6px", fontWeight: 700,
                          fontFamily: "'Space Mono', monospace", fontSize: 13,
                          color: months === null ? C.danger : months <= 3 ? C.accent1 : months <= 6 ? C.accent3 : months <= 12 ? C.accent2 : C.sub
                        }}>
                          {months === null ? "∞" : months}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 10, color: C.dim, marginTop: 8 }}>Valores en meses. Basado en ahorro neto = salario promedio {sen} − costo de vida de cada ciudad.</p>
        </Card>

        {/* 7. Insights */}
        <Card style={{ borderLeft: `3px solid ${C.accent3}` }}>
          <Head icon="💡" title={`Hallazgos Clave — ${sen}`} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 13, lineHeight: 1.75, color: C.sub }}>
            <div style={{ borderLeft: `3px solid ${C.accent1}`, paddingLeft: 16 }}>
              <strong style={{ color: C.accent1 }}>Mejor ratio calidad de vida:</strong> Un {sen} remoto desde Corrientes logra un ratio de <strong>{(scenarios[1][sk][1] / cities[0].total).toFixed(1)}x</strong> (salario/costo), el más alto de todos los escenarios. Ahorra <strong>{fmt(ins.remCtes)}/mes</strong>.
            </div>
            <div style={{ borderLeft: `3px solid ${C.accent3}`, paddingLeft: 16 }}>
              <strong style={{ color: C.accent3 }}>Brecha AR local vs remoto: {ins.ratio}x.</strong> Un {sen} local gana {fmt(scenarios[0][sk][1])}/mes vs {fmt(scenarios[1][sk][1])}/mes remoto. Requisitos clave: inglés avanzado + SQL/Python/BI.
            </div>
            <div style={{ borderLeft: `3px solid ${C.accent2}`, paddingLeft: 16 }}>
              <strong style={{ color: C.accent2 }}>EEUU: alto salario, alto costo.</strong> En NYC el ahorro es {fmt(ins.usNY)}/mes — {ins.usNY < ins.remBA ? "menos" : "más"} que un remoto desde Buenos Aires ({fmt(ins.remBA)}/mes). El health insurance (~$450/mes) es un gasto que en Argentina no existe.
            </div>
            <div style={{ borderLeft: `3px solid ${C.danger}`, paddingLeft: 16 }}>
              <strong style={{ color: C.danger }}>Austin, sweet spot de EEUU:</strong> Ahorro de {fmt(ins.usAus)}/mes (alquiler 55% menor que NYC, sin income tax estatal). Pero un {sen} remoto desde Córdoba ahorra {fmt(ins.remCba)}/mes — aún más.
            </div>
          </div>
        </Card>

        {/* 8. Table */}
        <Card>
          <Head icon="📋" title="Tabla Resumen" />
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                  <th style={{ textAlign: "left", padding: "10px 8px", color: C.dim }}>Escenario</th>
                  <th style={{ textAlign: "right", padding: "10px 8px", color: C.dim }}>Junior</th>
                  <th style={{ textAlign: "right", padding: "10px 8px", color: C.dim }}>Semi Sr</th>
                  <th style={{ textAlign: "right", padding: "10px 8px", color: C.dim }}>Senior</th>
                  <th style={{ textAlign: "left", padding: "10px 8px", color: C.dim, fontSize: 10 }}>Nota</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((s, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "10px 8px", fontWeight: 700, color: s.color }}>{s.label}</td>
                    <td style={{ textAlign: "right", padding: "10px 8px", fontFamily: "'Space Mono', monospace" }}>{fmt(s.jr[1])}</td>
                    <td style={{ textAlign: "right", padding: "10px 8px", fontFamily: "'Space Mono', monospace" }}>{fmt(s.ssr[1])}</td>
                    <td style={{ textAlign: "right", padding: "10px 8px", fontFamily: "'Space Mono', monospace" }}>{fmt(s.sr[1])}</td>
                    <td style={{ padding: "10px 8px", fontSize: 10, color: C.dim, maxWidth: 220 }}>{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 9. Methodology */}
        <Card style={{ borderLeft: `3px solid ${C.dim}` }}>
          <Head icon="📐" title="Metodología y Fuentes" />
          <div style={{ fontSize: 11, lineHeight: 1.9, color: C.dim, display: "flex", flexDirection: "column", gap: 6 }}>
            <p><strong style={{ color: C.sub }}>Dataset:</strong> Sintético, calibrado contra fuentes públicas. No es muestra estadística. Fines educativos y de portafolio.</p>
            <p><strong style={{ color: C.sub }}>Salarios AR:</strong> SysArmy, HuCap (iProfesional feb 2025: Jr $1.58M bruto/mes, Sr $3.71M bruto/mes), Glassdoor AR, Coderhouse. Incluye grandes empresas y PyMEs.</p>
            <p><strong style={{ color: C.sub }}>Salarios Remoto:</strong> Near Salary Guide 2025/26, Interfell Smart Hiring 2025, RemoteRocketship (avg $63,337/año, 653 postings), Tecla, Atlas LATAM Benchmark.</p>
            <p><strong style={{ color: C.sub }}>Salarios EEUU:</strong> BLS, Glassdoor ($93K avg), Indeed ($85K avg), Salary.com ($97.7K median), ZipRecruiter (Jr $79K avg). Rango $55K-$120K según seniority.</p>
            <p><strong style={{ color: C.sub }}>Costo AR:</strong> Zonaprop Q1 2026 (mono CABA $704.704 = ~$500 USD), Infobae. INDEC CBT feb 2026: $1.397.672 (familia 4). Corrientes ~35-40% de CABA.</p>
            <p><strong style={{ color: C.sub }}>Costo EEUU:</strong> RentCafe (studio NYC ~$2,469-$3,124), ApartmentList (Austin studio $1,285), C2ER Index. Health insurance: KFF marketplace avg.</p>
            <p><strong style={{ color: C.sub }}>TC:</strong> ARS 1.400/USD (blue/MEP abril 2026, flotación con bandas).</p>
            <p><strong style={{ color: C.sub }}>Scope:</strong> Persona sola, monoambiente, sin dependientes. AR: salarios netos aprox. EEUU: brutos (retención ~22-30% por impuestos federales+estatales no deducida). Remoto: neto contractor sin retención.</p>
          </div>
          <div style={{
            marginTop: 16, padding: 14, borderRadius: 8, fontSize: 11, lineHeight: 1.6,
            background: C.accent3 + "0a", border: `1px solid ${C.accent3}33`, color: C.accent3
          }}>
            ⚠️ <strong>Disclaimer:</strong> Datos sintéticos calibrados contra fuentes públicas. Los valores reales varían según empleador, negociación, beneficios, impuestos, contrato y contexto individual. No constituye asesoramiento financiero ni laboral.
          </div>
        </Card>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "24px 0 0", color: C.dim, fontSize: 11 }}>
          <p style={{ margin: "0 0 4px" }}>
            Análisis por <strong style={{ color: C.text }}>Facundo Ramírez Boll</strong> · Contador Público & Data Analyst
          </p>
          <p style={{ margin: 0 }}>
            <span style={{ color: C.accent3 }}>github.com/facurboll</span> · LinkedIn · Abril 2026
          </p>
        </div>
      </div>
    </div>
  );
}
