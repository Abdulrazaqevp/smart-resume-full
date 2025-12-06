import { motion } from "framer-motion";

export default function AnimatedButton({
  children,
  onClick,
  className = "",
  color = "indigo",
}) {
  const colorMap = {
    indigo: "from-indigo-500 to-indigo-600 shadow-indigo-300",
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-300",
    rose: "from-rose-500 to-rose-600 shadow-rose-300",
    blue: "from-blue-500 to-blue-600 shadow-blue-300",
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      className={`px-4 py-2 rounded-lg text-white font-medium 
                  bg-gradient-to-br ${colorMap[color]}
                  shadow-md hover:shadow-xl transition-all 
                  duration-200 ${className}`}
    >
      {children}
    </motion.button>
  );
}
