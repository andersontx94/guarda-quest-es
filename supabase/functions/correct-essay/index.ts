import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { tema, titulo, conteudo } = await req.json();

    if (!conteudo || conteudo.trim().length < 50) {
      return new Response(JSON.stringify({ error: "A redação precisa ter pelo menos 50 caracteres." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Você é um corretor de redações especializado em concursos públicos e ENEM. 
Avalie a redação de forma justa, construtiva e detalhada.

IMPORTANTE: Responda EXCLUSIVAMENTE usando a tool "essay_correction" fornecida. Não responda em texto livre.

Critérios de avaliação (cada um de 0 a 200 pontos, total máximo 1000):
1. Competência 1 - Domínio da norma culta da língua escrita
2. Competência 2 - Compreensão da proposta e aplicação de conceitos de várias áreas do conhecimento
3. Competência 3 - Seleção, organização e interpretação de informações, fatos, opiniões e argumentos
4. Competência 4 - Conhecimento dos mecanismos linguísticos necessários para a construção da argumentação (coesão)
5. Competência 5 - Elaboração de proposta de intervenção para o problema abordado

Avalie com rigor mas de forma encorajadora. Identifique erros gramaticais específicos com trechos do texto.
Esta é uma correção orientativa, não oficial.`;

    const userPrompt = `Tema: ${tema || "Tema livre"}
${titulo ? `Título: ${titulo}` : ""}

Redação:
${conteudo}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "essay_correction",
              description: "Return the full essay correction with scores and feedback.",
              parameters: {
                type: "object",
                properties: {
                  nota_geral: { type: "number", description: "Nota geral de 0 a 1000" },
                  notas_por_criterio: {
                    type: "object",
                    properties: {
                      competencia_1: { type: "number" },
                      competencia_2: { type: "number" },
                      competencia_3: { type: "number" },
                      competencia_4: { type: "number" },
                      competencia_5: { type: "number" },
                    },
                    required: ["competencia_1", "competencia_2", "competencia_3", "competencia_4", "competencia_5"],
                  },
                  feedback_geral: { type: "string", description: "Resumo geral do desempenho" },
                  pontos_fortes: { type: "array", items: { type: "string" }, description: "Lista de pontos fortes" },
                  pontos_fracos: { type: "array", items: { type: "string" }, description: "Lista de pontos fracos" },
                  erros_gramaticais: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        trecho: { type: "string" },
                        erro: { type: "string" },
                        correcao: { type: "string" },
                      },
                      required: ["trecho", "erro", "correcao"],
                    },
                  },
                  sugestoes_melhoria: { type: "array", items: { type: "string" } },
                  trechos_reescrever: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        original: { type: "string" },
                        sugestao: { type: "string" },
                      },
                      required: ["original", "sugestao"],
                    },
                  },
                },
                required: ["nota_geral", "notas_por_criterio", "feedback_geral", "pontos_fortes", "pontos_fracos", "erros_gramaticais", "sugestoes_melhoria", "trechos_reescrever"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "essay_correction" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes para correção." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const correction = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(correction), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("correct-essay error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
