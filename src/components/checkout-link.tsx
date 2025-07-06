"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";

export function CheckoutLink() {
  const { cart } = useCart();

  if (cart.items.length === 0) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="relative border-[#003DA5] text-[#003DA5] hover:bg-[#003DA5] hover:text-white"
      asChild
    >
      <Link href="/checkout">
        <ShoppingCart className="w-4 h-4 mr-2" />
        Checkout
        {cart.itemCount > 0 && (
          <Badge variant="destructive" className="ml-2 bg-[#FF3D00] text-white">
            {cart.itemCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
