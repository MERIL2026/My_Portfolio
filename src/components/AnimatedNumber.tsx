import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export function AnimatedNumber({ value }: { value: string }) {
  const isNumber = /^\d+$/.test(value.replace(/\D/g, ""));
  const numberValue = isNumber ? parseInt(value.replace(/\D/g, ""), 10) : 0;
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isNumber) {
      const controls = animate(count, numberValue, { duration: 2, ease: "easeOut" });
      setHasAnimated(true);
      return controls.stop;
    }
  }, [numberValue, isNumber]);

  if (!isNumber) return <span>{value}</span>;

  return <motion.span>{rounded}</motion.span>;
}
