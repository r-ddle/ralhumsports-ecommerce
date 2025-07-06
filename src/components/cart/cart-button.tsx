"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CartButton() {
  const { cart, toggleCart } = useCart();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleCart}
      className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label={`Shopping cart with ${cart.itemCount} items`}
    >
      <ShoppingBag className="w-5 h-5" />

      <AnimatePresence>
        {cart.itemCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute -top-1 -right-1"
          >
            <Badge
              variant="destructive"
              className="h-5 w-5 flex items-center justify-center p-0 text-xs font-bold bg-[#FF3D00] hover:bg-[#FF3D00] rounded-full"
            >
              {cart.itemCount > 99 ? "99+" : cart.itemCount}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
