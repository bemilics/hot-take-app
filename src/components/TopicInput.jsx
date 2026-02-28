function TopicInput({ topic, value, onChange }) {
  const maxLength = 30

  return (
    <div className="topic-input">
      <label>{topic}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="una palabra..."
        maxLength={maxLength}
      />
      <span className="char-count">
        {value.length}/{maxLength}
      </span>
    </div>
  )
}

export default TopicInput
