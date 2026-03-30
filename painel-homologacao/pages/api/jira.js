export default async function handler(req, res) {
  const domain = process.env.JIRA_DOMAIN;
  const email  = process.env.JIRA_EMAIL;
  const token  = process.env.JIRA_TOKEN;
  const project = process.env.JIRA_PROJECT || "AS";

  if (!domain || !email || !token) {
    return res.status(500).json({ error: "Variáveis de ambiente do Jira não configuradas." });
  }

  const auth = Buffer.from(`${email}:${token}`).toString("base64");
  const fields = "key,created,status,customfield_12555,customfield_12557";
  const maxResults = 100;
  let startAt = 0;
  let allIssues = [];

  try {
    while (true) {
      const jql = encodeURIComponent(`project = ${project} ORDER BY created ASC`);
      const url = `https://${domain}/rest/api/3/search?jql=${jql}&fields=${fields}&maxResults=${maxResults}&startAt=${startAt}`;

      const response = await fetch(url, {
        headers: {
          "Authorization": `Basic ${auth}`,
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        const text = await response.text();
        return res.status(response.status).json({ error: `Jira API error: ${text}` });
      }

      const data = await response.json();
      const issues = data.issues || [];
      allIssues = allIssues.concat(issues);

      if (allIssues.length >= data.total || issues.length < maxResults) break;
      startAt += maxResults;
    }

    const normalized = allIssues.map((issue) => {
      const f = issue.fields;

      // Estado: customfield_12555 pode ser array de objetos {value} ou null
      let estado = null;
      if (Array.isArray(f.customfield_12555) && f.customfield_12555.length > 0) {
        estado = f.customfield_12555.map((e) => (typeof e === "object" ? e.value : e)).filter(Boolean);
      } else if (f.customfield_12555 && typeof f.customfield_12555 === "object" && f.customfield_12555.value) {
        estado = [f.customfield_12555.value];
      }

      // Serviço: customfield_12557 — mesmo padrão
      let servico = null;
      if (Array.isArray(f.customfield_12557) && f.customfield_12557.length > 0) {
        servico = f.customfield_12557.map((s) => (typeof s === "object" ? s.value : s)).filter(Boolean);
      } else if (f.customfield_12557 && typeof f.customfield_12557 === "object" && f.customfield_12557.value) {
        servico = [f.customfield_12557.value];
      }

      return {
        key: issue.key,
        created: f.created ? f.created.split("T")[0] : null,
        status: f.status?.name || null,
        estado,
        servico,
      };
    });

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    return res.status(200).json({ issues: normalized, total: normalized.length, fetchedAt: new Date().toISOString() });
  } catch (err) {
    console.error("Jira fetch error:", err);
    return res.status(500).json({ error: err.message });
  }
}
