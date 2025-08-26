import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, assistantId, model, systemPrompt, conversationHistory } = await request.json()

    if (!message || !assistantId || !systemPrompt) {
      return NextResponse.json({ error: "Faltan parámetros requeridos" }, { status: 400 })
    }

    const openAIKeyMap: { [key: number]: string } = {
      2: process.env.SARAH_API_KEY || "", // Dr. Sarah con GPT-4o
    }

    const geminiKeyMap: { [key: number]: string } = {
      3: process.env.EMMA_API_KEY || "", // Emma ahora usa Gemini
    }

    const claudeKeyMap: { [key: number]: string } = {
      1: process.env.ALEX_API_KEY || "", // Alex usa Claude
    }

    const groqKeyMap: { [key: number]: string } = {
      4: process.env.MARCO_API_KEY || "", // Chef Marco usa Mistral via Groq
    }

    const isGeminiAssistant = assistantId === 3 // Emma
    const isClaudeAssistant = assistantId === 1 // Alex
    const isGroqAssistant = assistantId === 4 // Chef Marco
    const isOpenAIAssistant = assistantId === 2 // Dr. Sarah

    let apiKey = ""
    if (isGeminiAssistant) {
      apiKey = geminiKeyMap[assistantId]
    } else if (isClaudeAssistant) {
      apiKey = claudeKeyMap[assistantId]
    } else if (isGroqAssistant) {
      apiKey = groqKeyMap[assistantId]
    } else {
      apiKey = openAIKeyMap[assistantId]
    }

    if (!apiKey) {
      let requiredKeys = ""
      if (isGeminiAssistant) requiredKeys = "EMMA_API_KEY (para Gemini)"
      else if (isClaudeAssistant) requiredKeys = "ALEX_API_KEY (para Claude)"
      else if (isGroqAssistant) requiredKeys = "MARCO_API_KEY (para Groq/Mistral)"
      else requiredKeys = "SARAH_API_KEY"

      return NextResponse.json(
        {
          error: `API key no configurada para el asistente ${assistantId}. Configura las variables de entorno: ${requiredKeys}`,
        },
        { status: 400 },
      )
    }

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-10),
      { role: "user", content: message },
    ]

    let aiResponse: string

    if (isClaudeAssistant) {
      const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 500,
          temperature: 0.7,
          system: systemPrompt,
          messages: [
            ...conversationHistory.slice(-10).map((msg: any) => ({
              role: msg.role === "assistant" ? "assistant" : "user",
              content: msg.content,
            })),
            { role: "user", content: message },
          ],
        }),
      })

      if (!claudeResponse.ok) {
        const errorData = await claudeResponse.json()
        console.error("Error de Claude:", errorData)
        return NextResponse.json({ error: "Error al comunicarse con Claude" }, { status: claudeResponse.status })
      }

      const claudeData = await claudeResponse.json()
      aiResponse = claudeData.content?.[0]?.text || "Lo siento, no pude generar una respuesta."
    } else if (isGeminiAssistant) {
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-exp:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemPrompt}\n\nHistorial de conversación:\n${conversationHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join("\n")}\n\nUsuario: ${message}\n\nAsistente:`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 500,
            },
          }),
        },
      )

      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json()
        console.error("Error de Gemini:", errorData)
        return NextResponse.json({ error: "Error al comunicarse con Gemini" }, { status: geminiResponse.status })
      }

      const geminiData = await geminiResponse.json()
      aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no pude generar una respuesta."
    } else if (isGroqAssistant) {
      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      })

      if (!groqResponse.ok) {
        const errorData = await groqResponse.json()
        console.error("Error de Groq:", errorData)
        return NextResponse.json({ error: "Error al comunicarse con Groq" }, { status: groqResponse.status })
      }

      const groqData = await groqResponse.json()
      aiResponse = groqData.choices[0]?.message?.content || "Lo siento, no pude generar una respuesta."
    } else {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: assistantId === 2 ? "gpt-4o" : model || "gpt-4",
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
          ...(assistantId !== 2 && {
            presence_penalty: 0.1,
            frequency_penalty: 0.1,
          }),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error de OpenAI:", errorData)
        return NextResponse.json({ error: "Error al comunicarse con OpenAI" }, { status: response.status })
      }

      const data = await response.json()
      aiResponse = data.choices[0]?.message?.content || "Lo siento, no pude generar una respuesta."
    }

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Error en la API de chat:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
