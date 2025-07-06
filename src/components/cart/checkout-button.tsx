"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";

export function CheckoutButton() {
  const { cart, closeCart } = useCart();

  if (cart.items.length === 0) {
    return null;
  }

  return (
    <Button
      size="lg"
      className="w-full bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold py-4"
      asChild
      onClick={closeCart}
    >
      <Link href="/checkout">
        <ShoppingCart className="w-5 h-5 mr-2" />
        Proceed to Checkout
      </Link>
    </Button>
  );
}
