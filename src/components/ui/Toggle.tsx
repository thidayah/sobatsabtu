interface ToggleProps {
  onClick: () => void;
  status: boolean;
  disabled?: boolean;
}

export const Toggle = ({ onClick, status, disabled }: ToggleProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${status ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${status ? 'translate-x-6' : 'translate-x-1'
          }`}
      />
      {disabled && (
        <span className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </span>
      )}
    </button>
  )
}
