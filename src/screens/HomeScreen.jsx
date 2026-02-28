import { useState, useEffect } from 'react'

function HomeScreen({ onStart, setTopics }) {
  const [loading, setLoading] = useState(false)

  const handleStart = async () => {
    setLoading(true)
    try {
      // TODO: Llamar a /api/generate-topics
      // Por ahora, temas de ejemplo
      const exampleTopics = [
        "Los que responden con audio de 4 minutos",
        "El looksmaxxing",
        "Tener 47 tabs abiertos",
        "Los therians",
        "Ver series con subtítulos en inglés",
        "El bed rotting",
        "Subir stories de lluvia en Santiago",
        "Responder 'ya' con punto",
        "El FYP de TikTok",
        "Los tiktokers chilenos en inglés"
      ]
      setTopics(exampleTopics)
      onStart()
    } catch (error) {
      console.error('Error al generar temas:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home-screen">
      <h1>hot-take-app</h1>
      <p>Descubre tu perfil de internet en 10 palabras</p>
      <button onClick={handleStart} disabled={loading}>
        {loading ? 'Cargando...' : 'Comenzar'}
      </button>
    </div>
  )
}

export default HomeScreen
