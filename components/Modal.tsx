"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  variant?: "default" | "success" | "danger";
}

export default function Modal({ isOpen, onClose, children, title, variant = "default" }: ModalProps) {
  const borderColor = {
    default: "border-blue-100",
    success: "border-emerald-100",
    danger: "border-red-100",
  }[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-backdrop absolute inset-0"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`glass-card relative z-10 w-full max-w-lg mx-4 p-6 border ${borderColor}`}
          >
            {title && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-medical-text">{title}</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-medical-text-secondary"
                >
                  ✕
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Success variant
export function SuccessModal({ isOpen, onClose, message }: { isOpen: boolean; onClose: () => void; message: string }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="success">
      <div className="text-center py-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10, stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center"
        >
          <span className="text-4xl text-medical-success">✓</span>
        </motion.div>
        <h3 className="text-xl font-bold text-medical-text mb-2">Success!</h3>
        <p className="text-medical-text-secondary">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 rounded-xl bg-gradient-to-r from-medical-primary to-medical-primary-light text-white font-medium btn-glow"
        >
          Continue
        </button>
      </div>
    </Modal>
  );
}

// Delete confirm variant
export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Action" variant="danger">
      <p className="text-medical-text-secondary mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-gray-100 text-medical-text font-medium hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="px-4 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}
