interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs tracking-widest uppercase text-text-secondary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`bg-transparent border-0 border-b border-text-primary py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-cta transition-colors ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
