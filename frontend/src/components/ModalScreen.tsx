import React, { FC } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black/50">
      <div className="relative bg-white p-6 rounded-lg max-w-lg w-full shadow-lg">
        <button
          className="absolute top-2 right-2 text-2xl text-black hover:scale-125 hover:text-red-500 transition-transform"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
