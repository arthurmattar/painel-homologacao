import { useState, useMemo, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LabelList,
} from "recharts";

// ── CONSTANTES ────────────────────────────────────────────────────────────────

const FUNIL_ORDER = [
  "Backlog","ENVIO DA DOCUMENTAÇÃO","Aguardando documentação",
  "Documentação Irregular","Elaboração de Contrato",
  "Cadastro nos sistemas internos","Conferir credenciais",
  "Rejeitado","Deletar - duplicado",
];

const ACTIVE_STATUSES = [
  "Aguardando documentação","Elaboração de Contrato",
  "Documentação Irregular","Backlog","ENVIO DA DOCUMENTAÇÃO",
];

const ESTADO_COLORS = {
  SP:"#3b82f6",RS:"#10b981",SC:"#f59e0b",DF:"#ef4444",MG:"#8b5cf6",
  PR:"#06b6d4",GO:"#f97316",MA:"#ec4899",MT:"#84cc16",AM:"#14b8a6",
  AL:"#fb923c",ES:"#a78bfa","Não inf.":"#9ca3af",
};

const SERVICO_COLORS = {
  "Somente Transportador":"#3b82f6",
  "Somente Receptor":"#10b981",
  "Transp. e Receptor":"#f59e0b",
  "Não inf.":"#9ca3af",
};

const STATUS_COLORS = {
  "Backlog":"#6b7280","Aguardando documentação":"#3b82f6",
  "Elaboração de Contrato":"#f59e0b","Documentação Irregular":"#ef4444",
  "Homologado":"#22c55e","Rejeitado":"#94a3b8","Tarefas pendentes":"#fcd34d",
};

const SERVICO_ORDER = ["Somente Transportador","Somente Receptor","Transp. e Receptor","Não inf."];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function getWeek(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().split("T")[0];
}

function formatWeek(w) {
  const d = new Date(w + "T12:00:00");
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}`;
}

function getLast6Weeks() {
  const today = new Date();
  const weeks = new Set();
  for (let i = 0; i < 42; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    weeks.add(getWeek(d.toISOString().split("T")[0]));
  }
  return [...weeks].sort().slice(-6);
}

function classifyServico(servicoList) {
  if (!servicoList || servicoList.length === 0) return "Não inf.";
  const hasT = servicoList.includes("Transportador");
  const hasR = servicoList.includes("Receptor");
  if (hasT && hasR) return "Transp. e Receptor";
  if (hasT) return "Somente Transportador";
  if (hasR) return "Somente Receptor";
  return "Não inf.";
}

function normalizeStatus(s) {
  if (s === "Homologado" || s === "ENVIO DA DOCUMENTAÇÃO" || s === "Tarefas pendentes")
    return "Elaboração de Contrato";
  return s;
}

const TotalLabel = ({ x, y, width, value }) => {
  if (!value) return null;
  return (
    <text x={x + width / 2} y={y - 5} fill="#374151"
      textAnchor="middle" fontSize={11} fontWeight={700}>{value}</text>
  );
};

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    fetch("/api/jira")
      .then((r) => r.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setIssues(json.issues || []);
        setFetchedAt(json.fetchedAt);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const weeks = useMemo(() => getLast6Weeks(), []);

  // Cutoff dinâmico: 7 dias atrás
  const cutoffDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  }, []);

  const enriched = useMemo(() =>
    issues.map((i) => ({
      ...i,
      statusNorm: normalizeStatus(i.status),
      week: i.created ? getWeek(i.created) : null,
      estadoList: i.estado || [],
      servicoList: i.servico || [],
      servicoKey: classifyServico(i.servico),
    })), [issues]);

  const recent = useMemo(() =>
    enriched.filter((i) => i.week && weeks.includes(i.week)), [enriched, weeks]);

  // Chart 1 — Por Estado
  const allEstados = useMemo(() => {
    const s = new Set();
    recent.forEach((i) => {
      if (i.estadoList.length) i.estadoList.forEach((e) => s.add(e));
      else s.add("Não inf.");
    });
    return [...s].sort((a, b) =>
      a === "Não inf." ? 1 : b === "Não inf." ? -1 : a.localeCompare(b));
  }, [recent]);

  const chart1 = useMemo(() => weeks.map((w) => {
    const row = { week: formatWeek(w) };
    allEstados.forEach((e) => (row[e] = 0));
    recent.filter((i) => i.week === w).forEach((i) => {
      const tags = i.estadoList.length ? i.estadoList : ["Não inf."];
      tags.forEach((e) => { row[e] = (row[e] || 0) + 1; });
    });
    row.total = recent.filter((i) => i.week === w).length;
    return row;
  }), [weeks, recent, allEstados]);

  // Chart 2 — Por Tipo de Serviço
  const allServicos = useMemo(() => {
    const s = new Set();
    recent.forEach((i) => s.add(i.servicoKey));
    return SERVICO_ORDER.filter((k) => s.has(k));
  }, [recent]);

  const chart2 = useMemo(() => weeks.map((w) => {
    const row = { week: formatWeek(w) };
    allServicos.forEach((s) => (row[s] = 0));
    recent.filter((i) => i.week === w).forEach((i) => {
      row[i.servicoKey] = (row[i.servicoKey] || 0) + 1;
    });
    row.total = recent.filter((i) => i.week === w).length;
    return row;
  }), [weeks, recent, allServicos]);

  // Chart 3 — Por Status
  const statusCounts = useMemo(() => {
    const counts = {}, stuckBy = {};
    issues.forEach((i) => {
      counts[i.status] = (counts[i.status] || 0) + 1;
      if (ACTIVE_STATUSES.includes(i.status) && i.created && new Date(i.created + "T00:00:00") <= cutoffDate)
        stuckBy[i.status] = (stuckBy[i.status] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([s, c]) => ({
        status: s, count: c,
        stuck: stuckBy[s] || 0,
        stuckPct: stuckBy[s] ? Math.round((stuckBy[s] / c) * 100) : 0,
      }))
      .sort((a, b) => {
        const ia = FUNIL_ORDER.indexOf(a.status);
        const ib = FUNIL_ORDER.indexOf(b.status);
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      });
  }, [issues, cutoffDate]);

  const stuckCount = useMemo(() =>
    issues.filter((i) =>
      ACTIVE_STATUSES.includes(i.status) &&
      i.created && new Date(i.created + "T00:00:00") <= cutoffDate
    ).length, [issues, cutoffDate]);

  const tabs = ["📊 Por Estado", "🚚 Por Tipo de Serviço", "📋 Por Status"];

  const kpis = [
    { label: "Total de cards", value: issues.length, color: "#1e3a5f" },
    { label: "Novos (6 semanas)", value: recent.length, color: "#3b82f6" },
    { label: "Parados >7 dias", value: stuckCount, color: "#ef4444" },
  ];

  const updatedLabel = fetchedAt
    ? `Atualizado em ${new Date(fetchedAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" })}`
    : "Carregando...";

  return (
    <>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: Inter, sans-serif; background: #f0f4f8; }`}</style>
      <div style={{ minHeight: "100vh", padding: "20px" }}>

        {/* Header */}
        <div style={{ background: "#1e3a5f", borderRadius: "12px", padding: "20px 28px", marginBottom: "20px", color: "#fff" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.6, marginBottom: "4px" }}>
            Musa Tecnologia · Jira AS
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Dashboard — Homologação de Operadores</h1>
              <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "4px" }}>
                Últimas 6 semanas · {issues.length} cards totais · {updatedLabel}
              </div>
            </div>
            <button
              onClick={fetchData}
              style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
            >
              ↻ Atualizar
            </button>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div style={{ background: "#fff", borderRadius: "12px", padding: "40px", textAlign: "center", color: "#888", fontSize: "14px", marginBottom: "20px" }}>
            Buscando dados do Jira...
          </div>
        )}
        {error && (
          <div style={{ background: "#fff5f5", border: "1px solid #ffcdd2", borderRadius: "12px", padding: "16px 20px", color: "#c0392b", fontSize: "13px", marginBottom: "20px" }}>
            Erro: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "20px" }}>
              {kpis.map((k, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: "10px", padding: "16px 20px", borderLeft: `4px solid ${k.color}` }}>
                  <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{k.label}</div>
                  <div style={{ fontSize: "28px", fontWeight: 700, color: k.color }}>{k.value}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
              {tabs.map((t, i) => (
                <button key={i} onClick={() => setTab(i)} style={{
                  padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer",
                  fontSize: "13px", fontWeight: 600,
                  background: tab === i ? "#1e3a5f" : "#fff",
                  color: tab === i ? "#fff" : "#555",
                  boxShadow: tab === i ? "0 2px 8px rgba(30,58,95,0.3)" : "0 1px 3px rgba(0,0,0,0.1)",
                }}>{t}</button>
              ))}
            </div>

            {/* Conteúdo */}
            <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>

              {/* Tab 0 — Por Estado */}
              {tab === 0 && (
                <>
                  <h2 style={{ margin: "0 0 4px", fontSize: "16px", color: "#1e3a5f" }}>Novos cards por semana · por Estado</h2>
                  <p style={{ margin: "0 0 20px", fontSize: "12px", color: "#888" }}>
                    Campo <strong>📍 customfield_12555 — Localização do Operador</strong> · "Não inf." = campo vazio no Jira
                  </p>
                  <ResponsiveContainer width="100%" height={340}>
                    <BarChart data={chart1} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      {allEstados.map((e, idx) => (
                        <Bar key={e} dataKey={e} stackId="a" fill={ESTADO_COLORS[e] || "#ccc"}>
                          {idx === allEstados.length - 1 && <LabelList dataKey="total" content={TotalLabel} />}
                        </Bar>
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}

              {/* Tab 1 — Por Tipo de Serviço */}
              {tab === 1 && (
                <>
                  <h2 style={{ margin: "0 0 4px", fontSize: "16px", color: "#1e3a5f" }}>Novos cards por semana · por Tipo de Serviço</h2>
                  <p style={{ margin: "0 0 20px", fontSize: "12px", color: "#888" }}>
                    Campo <strong>🚚 customfield_12557 — Tipo de Serviço</strong> · "Não inf." = campo vazio no Jira
                  </p>
                  <ResponsiveContainer width="100%" height={340}>
                    <BarChart data={chart2} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      {allServicos.map((s, idx) => (
                        <Bar key={s} dataKey={s} stackId="a" fill={SERVICO_COLORS[s] || "#aaa"}>
                          {idx === allServicos.length - 1 && <LabelList dataKey="total" content={TotalLabel} />}
                        </Bar>
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}

              {/* Tab 2 — Por Status */}
              {tab === 2 && (
                <>
                  <h2 style={{ margin: "0 0 4px", fontSize: "16px", color: "#1e3a5f" }}>Total de cards por Status</h2>
                  <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#888" }}>
                    Ordenado pela sequência do funil · {issues.length} cards totais
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", background: "#fff5f5", border: "1px solid #ffcdd2", borderRadius: "8px", padding: "10px 16px" }}>
                    <div style={{ width: "32px", height: "4px", background: "#ef4444", borderRadius: "2px", flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", color: "#c0392b", fontWeight: 600 }}>
                      {stuckCount} operadores parados há mais de 7 dias na mesma etapa
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "20px", marginBottom: "12px", paddingLeft: "195px" }}>
                    {[["#94a3b8", "Total de cards"], ["#ef4444", "% parados >7 dias"]].map(([c, l]) => (
                      <div key={l} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: c }} />
                        <span style={{ fontSize: "12px", color: "#555" }}>{l}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                          <th style={{ textAlign: "left", padding: "8px 12px", color: "#6b7280", fontWeight: 600, width: "190px" }}>Status</th>
                          <th style={{ textAlign: "left", padding: "8px 12px", color: "#6b7280", fontWeight: 600, width: "220px" }}>Total de cards</th>
                          <th style={{ width: "20px" }} />
                          <th style={{ textAlign: "left", padding: "8px 12px", color: "#ef4444", fontWeight: 600, width: "220px" }}>% parados &gt;7 dias</th>
                          <th style={{ width: "20px" }} />
                        </tr>
                      </thead>
                      <tbody>
                        {statusCounts.map((s, i) => {
                          const maxCount = Math.max(...statusCounts.map((x) => x.count));
                          const barW = Math.round((s.count / maxCount) * 180);
                          const pctBarW = Math.round((s.stuckPct / 100) * 180);
                          const isActive = ACTIVE_STATUSES.includes(s.status);
                          return (
                            <tr key={i} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                              <td style={{ padding: "9px 12px", color: "#374151", fontWeight: 500 }}>
                                <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", background: STATUS_COLORS[s.status] || "#bbb", marginRight: "7px", verticalAlign: "middle" }} />
                                {s.status}
                              </td>
                              <td style={{ padding: "9px 12px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div style={{ background: "#94a3b8", height: "16px", width: `${barW}px`, borderRadius: "0 3px 3px 0" }} />
                                  <span style={{ fontWeight: 700, color: "#374151", minWidth: "24px" }}>{s.count}</span>
                                </div>
                              </td>
                              <td />
                              <td style={{ padding: "9px 12px" }}>
                                {isActive ? (
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div style={{ background: s.stuckPct >= 80 ? "#ef4444" : s.stuckPct >= 50 ? "#f97316" : "#fbbf24", height: "16px", width: `${pctBarW}px`, borderRadius: "0 3px 3px 0" }} />
                                    <span style={{ fontWeight: 700, color: s.stuckPct >= 80 ? "#ef4444" : s.stuckPct >= 50 ? "#f97316" : "#d97706", minWidth: "36px" }}>
                                      {s.stuckPct > 0 ? `${s.stuckPct}%` : "—"}
                                    </span>
                                    {s.stuck > 0 && <span style={{ fontSize: "11px", color: "#9ca3af" }}>({s.stuck} cards)</span>}
                                  </div>
                                ) : <span style={{ color: "#d1d5db", fontSize: "11px" }}>não aplicável</span>}
                              </td>
                              <td />
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ textAlign: "center", fontSize: "11px", color: "#aaa", marginTop: "12px" }}>
                    % parados &gt;7 dias = cards criados há mais de 7 dias ainda em etapas ativas · 🟡 &lt;50% · 🟠 50–79% · 🔴 ≥80%
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
