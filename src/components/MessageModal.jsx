import React from "react";

export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  success = true,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl w-[90%] max-w-md p-6 pointer-events-auto">
        {/* Ícone decorativo */}
        <div className="flex justify-center mb-4">
          <div
            className={`p-3 rounded-full ${success ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  success
                    ? "M5 13l4 4L19 7"
                    : "M12 9v2m0 4h.01m-.01-12a9 9 0 11-9 9 9 9 0 019-9z"
                }
              />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
          {title}
        </h2>
        <p className="text-center text-gray-600 mb-6">{message}</p>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
