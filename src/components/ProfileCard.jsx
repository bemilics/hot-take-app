import { useRef } from 'react'

function ProfileCard({ profile }) {
  const cardRef = useRef(null)

  if (!profile) return null

  return (
    <div className="profile-card" ref={cardRef} id="profile-card">
      <div className="card-content">
        <div className="avatar">
          {/* Avatar placeholder - puede ser un gradiente o emoji */}
          <div className="avatar-circle"></div>
        </div>

        <h3 className="archetype-name">{profile.archetype_name}</h3>

        <div className="username">{profile.username}</div>

        <div className="separator"></div>

        <p className="bio">{profile.bio}</p>

        <div className="separator"></div>

        <div className="niche-badge">
          <span>🏷</span> {profile.niche}
        </div>

        {profile.posts && profile.posts.length > 0 && (
          <>
            <div className="separator"></div>

            <div className="posts-section">
              <div className="posts-header">contenido inferido</div>
              {profile.posts.map((post, index) => (
                <div key={index} className="post-item">
                  {post.content}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="watermark">hot-take-app</div>
      </div>
    </div>
  )
}

export default ProfileCard
