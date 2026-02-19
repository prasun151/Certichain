import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = false, onClick }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      className={`
        bg-white rounded-xl border border-border
        shadow-card p-6 ${hover ? 'cursor-pointer transition-all' : ''} ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
