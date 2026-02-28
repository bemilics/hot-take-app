import { useState } from 'react'
import TopicInput from '../components/TopicInput'

function TakeScreen({ topics, onComplete }) {
  const [answers, setAnswers] = useState(topics.map(() => ''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = async () => {
    // Validar que todos los campos estén completos
    if (answers.some(answer => answer.trim() === '')) {
      setError('Por favor completa todas las respuestas')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Construir el payload con los temas y respuestas
      const payload = {
        answers: topics.map((topic, index) => ({
          topic: topic,
          word: answers[index]
        }))
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Error al analizar respuestas')
      }

      const profile = await response.json()
      onComplete(profile)
    } catch (err) {
      setError('Error al analizar tus respuestas. Intenta de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const allFilled = answers.every(answer => answer.trim() !== '')

  return (
    <div className="take-screen">
      <h2>Tus hot takes</h2>
      <p>Responde cada tema con hasta 30 caracteres</p>

      <div className="topics-list">
        {topics.map((topic, index) => (
          <TopicInput
            key={index}
            topic={topic}
            value={answers[index]}
            onChange={(value) => handleAnswerChange(index, value)}
          />
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={!allFilled || loading}
        className="analyze-button"
      >
        {loading ? 'Analizando tu alma digital...' : 'Analizar'}
      </button>
    </div>
  )
}

export default TakeScreen
