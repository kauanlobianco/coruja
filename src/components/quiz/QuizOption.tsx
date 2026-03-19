interface QuizOptionProps {
  number: number
  label: string
  selected: boolean
  onClick: () => void
}

export function QuizOption({ number, label, selected, onClick }: QuizOptionProps) {
  return (
    <button
      type="button"
      className={selected ? 'quiz-option quiz-option-selected' : 'quiz-option'}
      aria-pressed={selected}
      data-selected={selected ? 'true' : 'false'}
      onClick={onClick}
    >
      <span className="quiz-option-number">{number}</span>
      <span className="quiz-option-label">{label}</span>
    </button>
  )
}
