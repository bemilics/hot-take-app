import { useState } from 'react'
import './App.css'
import HomeScreen from './screens/HomeScreen'
import TakeScreen from './screens/TakeScreen'
import ResultScreen from './screens/ResultScreen'

function App() {
  const [screen, setScreen] = useState('home') // 'home', 'take', 'result'
  const [topics, setTopics] = useState([])
  const [profile, setProfile] = useState(null)

  return (
    <div className="App">
      {screen === 'home' && (
        <HomeScreen
          onStart={() => setScreen('take')}
          setTopics={setTopics}
        />
      )}
      {screen === 'take' && (
        <TakeScreen
          topics={topics}
          onComplete={(profileData) => {
            setProfile(profileData)
            setScreen('result')
          }}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          profile={profile}
          onRestart={() => {
            setScreen('home')
            setProfile(null)
            setTopics([])
          }}
        />
      )}
    </div>
  )
}

export default App
