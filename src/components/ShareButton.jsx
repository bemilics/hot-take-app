import { exportCard } from '../utils/exportCard'

function ShareButton() {
  const handleShare = async () => {
    try {
      const element = document.getElementById('profile-card')
      if (element) {
        await exportCard(element)
      }
    } catch (error) {
      console.error('Error al exportar:', error)
    }
  }

  return (
    <button onClick={handleShare} className="share-button">
      Guardar / Compartir
    </button>
  )
}

export default ShareButton
