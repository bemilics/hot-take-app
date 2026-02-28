import ProfileCard from '../components/ProfileCard'
import ShareButton from '../components/ShareButton'

function ResultScreen({ profile, onRestart }) {
  return (
    <div className="result-screen">
      <h2>Tu perfil de internet</h2>

      <ProfileCard profile={profile} />

      <div className="result-actions">
        <ShareButton />
        <button onClick={onRestart} className="restart-button">
          Hacer otro
        </button>
      </div>
    </div>
  )
}

export default ResultScreen
