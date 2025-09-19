import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook personalizado para gerenciar comportamento do Modal
 * Responsável por:
 * - Gerenciamento de foco
 * - Tratamento da tecla Escape
 * - Prevenção de scroll do body
 * - Cleanup automático
 */
export const useModalBehavior = (
  isOpen: boolean,
  onClose: () => void,
  closeOnEscape: boolean = true,
  preventBodyScroll: boolean = true
) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Gerenciar foco
  useEffect(() => {
    if (!isOpen) return;

    // Salvar elemento ativo atual
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focar no modal quando abrir
    const focusModal = () => {
      if (modalRef.current) {
        const focusableElement = modalRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        
        if (focusableElement) {
          focusableElement.focus();
        } else {
          modalRef.current.focus();
        }
      }
    };

    // Pequeno delay para garantir que o modal foi renderizado
    const timeoutId = setTimeout(focusModal, 100);

    return () => {
      clearTimeout(timeoutId);
      // Restaurar foco quando fechar
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  // Gerenciar scroll do body
  useEffect(() => {
    if (!isOpen || !preventBodyScroll) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen, preventBodyScroll]);

  // Tratamento da tecla Escape
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        event.preventDefault();
        onClose();
      }
    },
    [onClose, closeOnEscape]
  );

  // Adicionar/remover listener de teclado
  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Tratamento de clique no overlay
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Prevenir propagação de cliques no conteúdo do modal
  const handleContentClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
    },
    []
  );

  return {
    modalRef,
    handleOverlayClick,
    handleContentClick,
  };
};

export default useModalBehavior;