import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import type { OverlayProps, SizeableProps } from './types/common';
import { getModalClasses, cn } from './utils/classNames';

interface ModalProps extends OverlayProps, SizeableProps {
  title?: string;
  showCloseButton?: boolean;
  preventOutsideClose?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  animated?: boolean;
  overlayClassName?: string;
  containerClassName?: string;
}

const useModalBehavior = (
  isOpen: boolean,
  onClose: () => void,
  closeOnEscape: boolean = true
) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    document.body.style.overflow = 'hidden';

    if (modalRef.current) {
      modalRef.current.focus();
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'unset';
      
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
      
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, closeOnEscape]);

  return modalRef;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  preventOutsideClose = false,
  header,
  footer,
  animated = true,
  className,
  overlayClassName,
  containerClassName,
  ...props
}) => {
  const { t } = useTranslation();
  const modalRef = useModalBehavior(isOpen, onClose, closeOnEscape);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick && !preventOutsideClose) {
      onClose();
    }
  };

  const modalContent = (
    <div 
      className={cn(
        'fixed inset-0 z-50 overflow-y-auto',
        animated && 'animate-fadeIn'
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      {...props}
    >
      <div className={cn(
        'flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0',
        containerClassName
      )}>
        <div 
          className={cn(
            'fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75',
            overlayClassName
          )}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        
        <div 
          ref={modalRef}
          className={cn(
            getModalClasses(size),
            animated && 'animate-slideIn',
            className
          )}
          tabIndex={-1}
        >
          {(header || title || showCloseButton) && (
            <div className="flex items-center justify-between mb-4">
              {header || (
                <>
                  {title && (
                    <h3 
                      id="modal-title"
                      className="text-lg font-medium text-gray-900 flex-1"
                    >
                      {title}
                    </h3>
                  )}
                  {showCloseButton && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onClose}
                      className="ml-auto flex-shrink-0"
                      aria-label={t('common.closeModal')}
                    >
                      ✕
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
          
          <div className="flex-1">
            {children}
          </div>
          
          {footer && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;