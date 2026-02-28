import { useState, useEffect } from 'react'

function HomeScreen({ onStart, setTopics }) {
  const [loading, setLoading] = useState(false)

  const handleStart = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Error al generar temas')
      }

      const data = await response.json()
      setTopics(data.topics)
      onStart()
    } catch (error) {
      console.error('Error al generar temas:', error)
      alert('Error al generar temas. Por favor intenta de nuevo.')
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
