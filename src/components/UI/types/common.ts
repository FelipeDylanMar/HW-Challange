/**
 * Common types and interfaces for UI components
 * Following Clean Architecture principles for better type safety and reusability
 */

import { type ReactNode, type HTMLAttributes, type ButtonHTMLAttributes } from 'react';

// Base size variants used across multiple components
export type Size = 'sm' | 'md' | 'lg' | 'xl';

// Base color variants for consistent theming
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

// Extended color variants for badges and status indicators
export type StatusVariant = ColorVariant | 'default';

// Common props that many components share
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// Props for components that support sizing
export interface SizeableProps {
  size?: Size;
}

// Props for components that support color variants
export interface VariantProps {
  variant?: ColorVariant;
}

// Props for components that support status variants
export interface StatusVariantProps {
  variant?: StatusVariant;
}

// Props for interactive components
export interface InteractiveProps {
  disabled?: boolean;
  loading?: boolean;
}

// Props for components that can be controlled/uncontrolled
export interface ControllableProps<T> {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}

// Common button-like component props
export interface ButtonLikeProps extends 
  BaseComponentProps, 
  SizeableProps, 
  VariantProps, 
  InteractiveProps,
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  isLoading?: boolean;
}

// Common input-like component props
export interface InputLikeProps<T = string> extends 
  BaseComponentProps,
  SizeableProps,
  ControllableProps<T>,
  Omit<HTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'value' | 'defaultValue'> {
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
}

// Modal and overlay component props
export interface OverlayProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
}

// Table and list component props
export interface DataDisplayProps<T = Record<string, unknown>> extends BaseComponentProps {
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onItemClick?: (item: T) => void;
}

// Sorting functionality
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SortableProps {
  sortConfig?: SortConfig;
  onSort?: (field: string) => void;
}

// Pagination functionality
export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export interface PaginatableProps {
  pagination?: PaginationConfig;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

// Filter functionality
export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  multiple?: boolean;
}

export interface FilterableProps {
  filters?: FilterConfig[];
  activeFilters?: Record<string, string | string[]>;
  onFilterChange?: (key: string, value: string | string[]) => void;
}

// Search functionality
export interface SearchableProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
}

// Icon props
export interface IconProps extends BaseComponentProps, SizeableProps {
  name: string;
  color?: string;
}

// Validation and error handling
export interface ValidationProps {
  error?: string;
  isValid?: boolean;
  isRequired?: boolean;
}

// Accessibility props
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  role?: string;
  tabIndex?: number;
}

// Combined props for complex components
export interface ComplexComponentProps extends 
  BaseComponentProps,
  SizeableProps,
  VariantProps,
  ValidationProps,
  AccessibilityProps {}