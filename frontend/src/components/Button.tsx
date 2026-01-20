type ButtonType = 'submit' | 'button'
type Variant = 'primary' | 'secondary'

export interface ButtonProps {
  label: string
  type?: ButtonType
  onClick?: () => void
  disabled?: boolean
  variant?: Variant
}

export function Button({ label, type = 'button', onClick, disabled, variant = 'primary' }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition'
  const styles =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300'
      : 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100'
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {label}
    </button>
  )
}