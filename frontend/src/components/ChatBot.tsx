import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

const CONTEXTO_FAZENDA = `
Você é o assistente virtual do AgroDigital, painel de gestão da Fazenda Sao Joao (Mato Grosso, BR).
Responda de forma curta, direta e em português. Use os dados abaixo quando perguntarem sobre a fazenda:

- Lucro Acumulado: R$ 373.000
- Total Receitas: R$ 758.000
- Total Despesas: R$ 385.000
- Margem: 49.2%
- Culturas: Soja (200 ha), Milho (150 ha), Algodao (100 ha)
- Status dos plantios: 1 Crescendo, 1 em Colheita, 1 Plantado
- Alertas ativos: Irrigacao em 2h, Chuva amanha (18mm), Colheita favoravel

Se a pergunta for sobre agricultura em geral (pragas, clima, manejo, etc.) responda com conhecimento
agronômico útil. Se não souber algo específico da fazenda, diga que não tem essa informação ainda.
`.trim();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export default function ChatBot() {
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState([
    { autor: "bot", texto: "Oi! Sou o assistente do AgroDigital. Pode perguntar sobre a fazenda ou sobre agricultura em geral." },
  ]);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens, aberto]);

  async function enviarMensagem(e) {
    e.preventDefault();
    const texto = input.trim();
    if (!texto || carregando) return;

    const novaMsg = { autor: "user", texto };
    const historico = [...mensagens, novaMsg];
    setMensagens(historico);
    setInput("");
    setCarregando(true);
    setErro(null);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("Chave da API Groq não configurada (VITE_GROQ_API_KEY).");
      }

      const respostaApi = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: "system", content: CONTEXTO_FAZENDA },
            ...historico.map((m) => ({
              role: m.autor === "user" ? "user" : "assistant",
              content: m.texto,
            })),
          ],
          temperature: 0.4,
          max_tokens: 500,
        }),
      });

      if (!respostaApi.ok) {
        const detalhe = await respostaApi.text();
        throw new Error(`Erro na API Groq (${respostaApi.status}): ${detalhe}`);
      }

      const dados = await respostaApi.json();
      const textoResposta =
        dados?.choices?.[0]?.message?.content?.trim() ||
        "Desculpe, não consegui gerar uma resposta agora.";

      setMensagens((prev) => [...prev, { autor: "bot", texto: textoResposta }]);
    } catch (err) {
      console.error(err);
      setErro(err.message);
      setMensagens((prev) => [
        ...prev,
        { autor: "bot", texto: "Ops, tive um problema para responder. Tente novamente em instantes." },
      ]);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 50 }}>
      {aberto && (
        <div
          style={{
            width: 340,
            height: 440,
            background: "#0f1a12",
            border: "1px solid #2a3a2e",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            marginBottom: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              background: "#16241a",
              borderBottom: "1px solid #2a3a2e",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#e8f0ea", fontWeight: 600, fontSize: 14 }}>
              Assistente AgroDigital
            </span>
            <button
              onClick={() => setAberto(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9fb3a6" }}
            >
              <X size={18} />
            </button>
          </div>

          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 8,