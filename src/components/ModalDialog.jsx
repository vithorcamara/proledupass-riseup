import React, { useEffect, useState } from 'react';

export function ModalDialog({ isOpen, onClose, children }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      // Espera o tempo da animação para esconder completamente
      const timeout = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div
        className={`relative bg-white rounded-lg shadow-lg p-6 w-full max-w-xl mx-4 transform transition-all duration-300
          ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
