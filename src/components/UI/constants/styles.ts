export const SIZE_CLASSES = {
  sm: {
    padding: 'px-2 py-1',
    text: 'text-xs',
    height: 'h-8',
    width: 'w-8',
    icon: 'h-4 w-4',
    spacing: 'space-x-1 space-y-1'
  },
  md: {
    padding: 'px-3 py-2',
    text: 'text-sm',
    height: 'h-10',
    width: 'w-10',
    icon: 'h-5 w-5',
    spacing: 'space-x-2 space-y-2'
  },
  lg: {
    padding: 'px-4 py-3',
    text: 'text-base',
    height: 'h-12',
    width: 'w-12',
    icon: 'h-6 w-6',
    spacing: 'space-x-3 space-y-3'
  },
  xl: {
    padding: 'px-6 py-4',
    text: 'text-lg',
    height: 'h-16',
    width: 'w-16',
    icon: 'h-8 w-8',
    spacing: 'space-x-4 space-y-4'
  }
} as const;

export const VARIANT_CLASSES = {
  primary: {
    bg: 'bg-blue-600',
    bgHover: 'hover:bg-blue-700',
    bgLight: 'bg-blue-50',
    text: 'text-white',
    textDark: 'text-blue-900',
    textLight: 'text-blue-600',
    border: 'border-blue-600',
    ring: 'focus:ring-blue-500'
  },
  secondary: {
    bg: 'bg-gray-200',
    bgHover: 'hover:bg-gray-300',
    bgLight: 'bg-gray-50',
    text: 'text-gray-900',
    textDark: 'text-gray-900',
    textLight: 'text-gray-600',
    border: 'border-gray-300',
    ring: 'focus:ring-gray-500'
  },
  success: {
    bg: 'bg-green-600',
    bgHover: 'hover:bg-green-700',
    bgLight: 'bg-green-50',
    text: 'text-white',
    textDark: 'text-green-900',
    textLight: 'text-green-600',
    border: 'border-green-600',
    ring: 'focus:ring-green-500'
  },
  warning: {
    bg: 'bg-yellow-600',
    bgHover: 'hover:bg-yellow-700',
    bgLight: 'bg-yellow-50',
    text: 'text-white',
    textDark: 'text-yellow-900',
    textLight: 'text-yellow-600',
    border: 'border-yellow-600',
    ring: 'focus:ring-yellow-500'
  },
  danger: {
    bg: 'bg-red-600',
    bgHover: 'hover:bg-red-700',
    bgLight: 'bg-red-50',
    text: 'text-white',
    textDark: 'text-red-900',
    textLight: 'text-red-600',
    border: 'border-red-600',
    ring: 'focus:ring-red-500'
  },
  info: {
    bg: 'bg-blue-600',
    bgHover: 'hover:bg-blue-700',
    bgLight: 'bg-blue-50',
    text: 'text-white',
    textDark: 'text-blue-900',
    textLight: 'text-blue-600',
    border: 'border-blue-600',
    ring: 'focus:ring-blue-500'
  }
} as const;

export const STATUS_BADGE_CLASSES = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-blue-100 text-blue-800',
  secondary: 'bg-purple-100 text-purple-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800'
} as const;

export const BASE_CLASSES = {
  button: 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  input: 'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500',
  badge: 'inline-flex items-center font-medium rounded-full',
  card: 'bg-white shadow rounded-lg',
  modal: 'fixed inset-0 z-50 overflow-y-auto',
  overlay: 'fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity',
  spinner: 'animate-spin rounded-full border-b-2 border-blue-600'
} as const;

export const MODAL_SIZE_CLASSES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl'
} as const;

export const ANIMATION_CLASSES = {
  fadeIn: 'animate-fadeIn',
  fadeOut: 'animate-fadeOut',
  slideIn: 'animate-slideIn',
  slideOut: 'animate-slideOut',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce'
} as const;

export const RESPONSIVE_CLASSES = {
  hideOnMobile: 'hidden md:block',
  showOnMobile: 'block md:hidden',
  mobileFullWidth: 'w-full md:w-auto',
  mobileStack: 'flex-col md:flex-row'
} as const;

export const Z_INDEX = {
  dropdown: 'z-10',
  sticky: 'z-20',
  fixed: 'z-30',
  modal: 'z-50',
  popover: 'z-60',
  tooltip: 'z-70'
} as const;