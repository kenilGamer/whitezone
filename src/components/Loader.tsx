import React from 'react';
import { useLoading } from '@/context/loading-context';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = () => {
  const { isLoading, loadingMessage, progress } = useLoading();

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 backdrop-blur-md z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-white/95 rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-4 relative overflow-hidden"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FB9EC6]/5 to-[#ff2885]/5">
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #FB9EC6 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}
              animate={{
                backgroundPosition: ['0 0', '20px 20px'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          <div className="relative flex flex-col items-center space-y-8">
            {/* Enhanced Spinner Container */}
            <div className="relative w-24 h-24">
              {/* Outer Ring */}
              <motion.div
                className="absolute inset-0 border-4 border-[#FB9EC6] rounded-full"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              {/* Middle Ring */}
              <motion.div
                className="absolute inset-2 border-4 border-[#ff2885] rounded-full"
                animate={{ 
                  rotate: -360,
                  scale: [1, 0.9, 1]
                }}
                transition={{ 
                  rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              {/* Inner Ring */}
              <motion.div
                className="absolute inset-4 border-4 border-[#FFE893] rounded-full"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              {/* Center Dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-4 h-4 bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: 360
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </div>

            {/* Enhanced Progress Bar Container */}
            <div className="w-full space-y-3">
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#FB9EC6] via-[#ff2885] to-[#FB9EC6] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between items-center">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-700 font-medium"
                >
                  {loadingMessage}
                </motion.p>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-semibold bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] bg-clip-text text-transparent"
                >
                  {progress}%
                </motion.span>
              </div>
            </div>

            {/* Enhanced Loading Dots */}
            <motion.div
              className="flex space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] rounded-full"
                  animate={{
                    y: [0, -8, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loader; 