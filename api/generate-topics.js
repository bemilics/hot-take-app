export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const systemPrompt = `Eres un generador de temas para una app chilena de hot takes de internet.

Genera exactamente 10 temas únicos y variados. El usuario responderá cada uno con hasta 30 caracteres (una palabra, un modismo, una frase corta).

CATEGORÍAS — mezcla sin repetir más de 2 del mismo tipo:

1. COMPORTAMIENTOS EN REDES: cosas que hacen los chilenos en WhatsApp, TikTok, Instagram, Twitter.
   Ej: "Los que responden con audio de 4 minutos", "Subir stories de lluvia en Santiago"

2. TENDENCIAS GLOBALES DE INTERNET: fenómenos virales, estéticas, subculturas online.
   Ej: "El looksmaxxing", "Los therians", "El bed rotting"

3. DEBATES COTIDIANOS: opiniones divididas sobre cosas del día a día.
   Ej: "Responder 'ya' con punto", "Llegar exactamente a la hora"

4. CULTURA ONLINE CHILENA: imaginario digital chileno.
   Ej: "Tener el Facebook del colegio todavía activo", "Los memes de la época del Fotolog"

5. HÁBITOS DE CONSUMO DIGITAL: cómo usa la gente el contenido online.
   Ej: "Ver series con subtítulos en inglés", "Tener 47 tabs abiertos"

REGLAS:
- Sin referencias políticas ni figuras públicas específicas
- Temas lo suficientemente ambiguos para revelar personalidad con poco texto
- Reconocibles para alguien de 18–35 años en Chile
- Variados en tono, categoría y nivel de nicho
- Responde ÚNICAMENTE con JSON válido, sin texto adicional

{"topics": ["tema1","tema2","tema3","tema4","tema5","tema6","tema7","tema8","tema9","tema10"]}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: 'Genera 10 temas nuevos para esta sesión.'
          }
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('API Error:', errorData)
      throw new Error(`API Error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    const text = data.content[0].text
    const result = JSON.parse(text)

    res.status(200).json(result)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error al generar temas', details: error.message })
  }
}
