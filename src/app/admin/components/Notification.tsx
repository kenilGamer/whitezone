import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaExclamationTriangle, FaExclamationCircle } from 'react-icons/fa';

interface NotificationProps {
  type: 'success' | 'error' | 'warning';
  message: string;
}

export default function Notification({ type, message }: NotificationProps) {
  const icons = {
    success: <FaCheck className="text-green-500" />,
    error: <FaExclamationCircle className="text-red-500" />,
    warning: <FaExclamationTriangle className="text-yellow-500" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border ${bgColors[type]} flex items-center space-x-3`}
      >
        {icons[type]}
        <p className="text-gray-700">{message}</p>
      </motion.div>
    </AnimatePresence>
  );
} 