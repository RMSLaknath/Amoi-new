interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline'
  fullWidth?: boolean
}

export default function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center px-8 py-3 text-sm tracking-widest uppercase transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
  const styles = {
    primary: 'bg-cta text-white border border-cta hover:bg-white hover:text-cta',
    outline: 'bg-white text-cta border border-cta hover:bg-cta hover:text-white',
  }

  return (
    <button
      className={`${base} ${styles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
