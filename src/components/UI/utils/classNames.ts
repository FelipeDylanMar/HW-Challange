/**
 * Utility functions for CSS class manipulation
 * Following Clean Code principles for better maintainability
 */

import { SIZE_CLASSES, VARIANT_CLASSES, STATUS_BADGE_CLASSES } from '../constants/styles';
import type { Size, ColorVariant, StatusVariant } from '../types/common';

/**
 * Combines multiple class names, filtering out falsy values
 * @param classes - Array of class names or conditional class names
 * @returns Combined class string
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Gets size-specific classes for a component
 * @param size - Size variant
 * @param type - Type of size class needed
 * @returns Size-specific class string
 */
export const getSizeClasses = (
  size: Size = 'md',
  type: keyof typeof SIZE_CLASSES.sm = 'padding'
): string => {
  return SIZE_CLASSES[size][type];
};

/**
 * Gets variant-specific classes for buttons and similar components
 * @param variant - Color variant
 * @param type - Type of variant class needed
 * @returns Variant-specific class string
 */
export const getVariantClasses = (
  variant: ColorVariant = 'primary',
  type: keyof typeof VARIANT_CLASSES.primary = 'bg'
): string => {
  return VARIANT_CLASSES[variant][type];
};

/**
 * Gets complete button classes based on variant and size
 * @param variant - Color variant
 * @param size - Size variant
 * @param disabled - Whether button is disabled
 * @returns Complete button class string
 */
export const getButtonClasses = (
  variant: ColorVariant = 'primary',
  size: Size = 'md',
  disabled: boolean = false
): string => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return cn(
    baseClasses,
    getVariantClasses(variant, 'bg'),
    getVariantClasses(variant, 'bgHover'),
    getVariantClasses(variant, 'text'),
    getVariantClasses(variant, 'ring'),
    getSizeClasses(size, 'padding'),
    getSizeClasses(size, 'text'),
    disabledClasses
  );
};

/**
 * Gets status badge classes
 * @param variant - Status variant
 * @param size - Size variant
 * @returns Status badge class string
 */
export const getStatusBadgeClasses = (
  variant: StatusVariant = 'default',
  size: Size = 'md'
): string => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  return cn(
    baseClasses,
    STATUS_BADGE_CLASSES[variant],
    getSizeClasses(size, 'padding'),
    getSizeClasses(size, 'text')
  );
};

/**
 * Gets input classes with error state support
 * @param size - Size variant
 * @param hasError - Whether input has error
 * @param disabled - Whether input is disabled
 * @returns Input class string
 */
export const getInputClasses = (
  size: Size = 'md',
  hasError: boolean = false,
  disabled: boolean = false
): string => {
  const baseClasses = 'block w-full rounded-md shadow-sm focus:outline-none transition-colors';
  const normalClasses = 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  const errorClasses = 'border-red-300 focus:border-red-500 focus:ring-red-500';
  const disabledClasses = 'bg-gray-50 text-gray-500 cursor-not-allowed';
  
  return cn(
    baseClasses,
    hasError ? errorClasses : normalClasses,
    disabled && disabledClasses,
    getSizeClasses(size, 'padding'),
    getSizeClasses(size, 'text')
  );
};

/**
 * Gets modal classes based on size
 * @param size - Modal size
 * @returns Modal class string
 */
export const getModalClasses = (size: Size = 'md'): string => {
  const sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };
  
  return cn(
    'inline-block w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg',
    sizeMap[size]
  );
};

/**
 * Gets icon classes based on size
 * @param size - Icon size
 * @returns Icon class string
 */
export const getIconClasses = (size: Size = 'md'): string => {
  return getSizeClasses(size, 'icon');
};

/**
 * Gets loading spinner classes
 * @param size - Spinner size
 * @param centered - Whether spinner should be centered
 * @returns Spinner class string
 */
export const getSpinnerClasses = (
  size: Size = 'md',
  centered: boolean = false
): string => {
  const baseClasses = 'animate-spin rounded-full border-b-2 border-blue-600';
  const centerClasses = centered ? 'mx-auto' : '';
  
  return cn(
    baseClasses,
    getSizeClasses(size, 'icon'),
    centerClasses
  );
};

/**
 * Gets responsive classes for mobile/desktop display
 * @param hideOnMobile - Whether to hide on mobile
 * @param showOnMobile - Whether to show only on mobile
 * @returns Responsive class string
 */
export const getResponsiveClasses = (
  hideOnMobile: boolean = false,
  showOnMobile: boolean = false
): string => {
  if (hideOnMobile) return 'hidden md:block';
  if (showOnMobile) return 'block md:hidden';
  return '';
};

/**
 * Creates a class name builder for specific component types
 * @param baseClasses - Base classes for the component
 * @returns Function to build classes for the component
 */
export const createClassBuilder = (baseClasses: string) => {
  return (...additionalClasses: (string | undefined | null | false)[]): string => {
    return cn(baseClasses, ...additionalClasses);
  };
};