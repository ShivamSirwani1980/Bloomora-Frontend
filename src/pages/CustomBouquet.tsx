import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShoppingCart, Save, X, Eye } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { flowerTypes, wrapStyles, addOns } from "@/lib/data";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import Bouquet3D from "@/components/Bouquet3D";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
interface SelectedFlower {
  type: string;
  color: string;
  quantity: number;
  price: number;
}

// Wrap style color swatches for the UI
const WRAP_SWATCHES: Record<string, string> = {
  "Classic White": "#f0ece8",
  "Kraft Paper": "#c8a46e",
  "Blush Pink": "#f0c8d4",
  "Sage Green": "#b8d4b0",
  "Midnight Black": "#2c2c2c",
  Lavender: "#d4c0f0",
};

export default function CustomBouquet() {
  const [selectedFlowers, setSelectedFlowers] = useState<SelectedFlower[]>([]);
  const [selectedWrap, setSelectedWrap] = useState(wrapStyles[0]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const { isAuthenticated, saveBouquet, addToCart, user, savedBouquets } = useStore();

  useEffect(() => {
    const editId = searchParams.get("id");
    if (editId && savedBouquets) {
      const saved = savedBouquets.find((b) => b.id === editId);
      if (saved) {
        setSelectedFlowers(
          saved.flowers.map((f) => ({
            type: f.type,
            color: f.color,
            quantity: f.quantity,
            price: flowerTypes.find((ft) => ft.name === f.type)?.price || 0,
          }))
        );
        const wrap = wrapStyles.find((w) => w.name === saved.wrapStyle);
        if (wrap) setSelectedWrap(wrap);
        setSelectedAddOns(saved.addOns || []);
        if (saved.message) setMessage(saved.message);
      }
    }
  }, [searchParams]);

  const totalPrice = useMemo(() => {
    const flowersTotal = selectedFlowers.reduce(
      (sum, f) => sum + f.price * f.quantity,
      0
    );
    const addOnsTotal = addOns
      .filter((a) => selectedAddOns.includes(a.name))
      .reduce((sum, a) => sum + a.price, 0);
    return flowersTotal + selectedWrap.price + addOnsTotal;
  }, [selectedFlowers, selectedWrap, selectedAddOns]);

  const totalStems = selectedFlowers.reduce((sum, f) => sum + f.quantity, 0);

  const addFlower = (flowerType: (typeof flowerTypes)[0], color: string) => {
    const existing = selectedFlowers.find(
      (f) => f.type === flowerType.name && f.color === color
    );
    if (existing) {
      setSelectedFlowers(
        selectedFlowers.map((f) =>
          f.type === flowerType.name && f.color === color
            ? { ...f, quantity: f.quantity + 1 }
            : f
        )
      );
    } else {
      setSelectedFlowers([
        ...selectedFlowers,
        {
          type: flowerType.name,
          color,
          quantity: 1,
          price: flowerType.price,
        },
      ]);
    }
  };

  const removeFlower = (type: string, color: string) => {
    const existing = selectedFlowers.find(
      (f) => f.type === type && f.color === color
    );
    if (existing && existing.quantity > 1) {
      setSelectedFlowers(
        selectedFlowers.map((f) =>
          f.type === type && f.color === color
            ? { ...f, quantity: f.quantity - 1 }
            : f
        )
      );
    } else {
      setSelectedFlowers(
        selectedFlowers.filter((f) => !(f.type === type && f.color === color))
      );
    }
  };

  const toggleAddOn = (addOnName: string) => {
    setSelectedAddOns(
      selectedAddOns.includes(addOnName)
        ? selectedAddOns.filter((a) => a !== addOnName)
        : [...selectedAddOns, addOnName]
    );
  };

  const handleSaveBouquet = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please login to save your bouquet");
      return;
    }
    if (selectedFlowers.length === 0) {
      toast.error("Please select at least one flower");
      return;
    }

    try {
      const payload = {
        email: user.email,
        bouquet_details: {
          flowers: selectedFlowers.map((f) => ({
            category: f.type,
            color: f.color,
            qty: f.quantity,
            price_per_stem: f.price,
          })),
          special_touches: selectedAddOns,
          message: message,
        },
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}api/v1/main/Bloomora/CustomBouquet/Save/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save bouquet on server");
      }

      saveBouquet({
        id: Date.now().toString(),
        name: `Custom Bouquet ${Date.now()}`,
        flowers: selectedFlowers.map((f) => ({
          type: f.type,
          color: f.color,
          quantity: f.quantity,
        })),
        wrapStyle: selectedWrap.name,
        addOns: selectedAddOns,
        message,
        createdAt: new Date(),
        totalPrice,
      });
      toast.success("Bouquet saved to your account!");
    } catch (error) {
      console.error("Error saving bouquet:", error);
      toast.error("Failed to save bouquet. Please try again.");
    }
  };

  const handleAddToCart = async () => {
    if (selectedFlowers.length === 0) {
      toast.error("Please select at least one flower");
      return;
    }
    
    // We require user to be logged in to sync the custom bouquet to the backend
    if (!isAuthenticated || !user) {
      toast.error("Please login to add a custom bouquet to your cart");
      return;
    }

    try {
      const payload = {
        email: user.email,
        bouquet_details: {
          flowers: selectedFlowers.map((f) => ({
            category: f.type,
            color: f.color,
            qty: f.quantity,
            price_per_stem: f.price,
          })),
          special_touches: selectedAddOns,
          message: message,
        },
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}api/v1/main/Bloomora/CreateCustom/Bouquet/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process custom bouquet API request");
      }

      addToCart({
        id: `custom-${Date.now()}`,
        name: "Custom Bouquet",
        price: totalPrice,
        image: "",
        category: "Custom",
        tags: ["custom"],
        description: `Custom bouquet with ${selectedFlowers
          .map((f) => `${f.quantity} ${f.color} ${f.type}`)
          .join(", ")}`,
        inStock: true,
        rating: 5,
        reviews: 0,
      });
      toast.success("Custom bouquet added to cart!");
    } catch (error) {
      console.error("Error creating custom bouquet:", error);
      toast.error("Failed to add custom bouquet. Please try again.");
    }
  };

  return (
    <Layout>
      {/* ── Header */}
      <section className="pt-24 pb-8 bg-hero-gradient">
        <div className="container-custom mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Create Your{" "}
              <span className="text-gradient">Custom Bouquet</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Design a one-of-a-kind arrangement by choosing your flowers,
              colors, wrap style, and special add-ons
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── LEFT: Selection Panel */}
            <div className="lg:col-span-2 space-y-8">

              {/* Step 1: Choose Flowers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Choose Your Flowers
                  </h2>
                </div>

                <div className="space-y-6">
                  {flowerTypes.map((flower) => (
                    <div
                      key={flower.name}
                      className="border-b border-border pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-foreground">
                          {flower.name}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          ₹{flower.price}/stem
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {flower.colors.map((color) => {
                          const selected = selectedFlowers.find(
                            (f) => f.type === flower.name && f.color === color
                          );
                          return (
                            <button
                              key={color}
                              onClick={() => addFlower(flower, color)}
                              className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                                selected
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                              )}
                            >
                              {color}
                              {selected && (
                                <span className="ml-1 font-bold">
                                  ×{selected.quantity}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Step 3: Add-ons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Add Special Touches
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {addOns.map((addOn) => (
                    <button
                      key={addOn.name}
                      onClick={() => toggleAddOn(addOn.name)}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all",
                        selectedAddOns.includes(addOn.name)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <p className="font-medium text-foreground">{addOn.name}</p>
                      <p className="text-sm text-muted-foreground">
                        +₹{addOn.price}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Step 4: Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Add a Message{" "}
                    <span className="font-normal text-muted-foreground text-base">
                      (Optional)
                    </span>
                  </h2>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your heartfelt message here..."
                  rows={3}
                  className="w-full input-premium resize-none"
                  maxLength={200}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {message.length}/200 characters
                </p>
              </motion.div>
            </div>

            {/* ── RIGHT: Sticky Preview + Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card rounded-2xl p-6 border border-border shadow-card"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Your Creation
                    {totalStems > 0 && (
                      <span className="ml-auto text-sm font-normal text-muted-foreground">
                        {totalStems} stems
                      </span>
                    )}
                  </h3>

                  {/* ── 3D PREVIEW */}
                  <div
                    className="rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-rose-50 to-purple-50"
                    style={{ height: "320px" }}
                  >
                    {selectedFlowers.length > 0 ? (
                      <Bouquet3D
                        selectedFlowers={selectedFlowers}
                        wrapStyle={selectedWrap.name}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                        <div className="text-5xl opacity-40">💐</div>
                        <p className="text-muted-foreground text-sm text-center px-4">
                          Add flowers to see your bouquet preview
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Wrap style indicator */}
                  {selectedFlowers.length > 0 && (
                    <div className="flex items-center gap-2 mb-4 px-1">
                      <div
                        className="w-4 h-4 rounded-full border border-border/60 shadow-sm flex-shrink-0"
                        style={{
                          backgroundColor:
                            WRAP_SWATCHES[selectedWrap.name] ?? "#ccc",
                        }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {selectedWrap.name} wrap
                      </span>
                    </div>
                  )}

                  {/* ── Selected Items */}
                  <div className="space-y-2 mb-5 max-h-48 overflow-y-auto">
                    <AnimatePresence>
                      {selectedFlowers.map((flower) => (
                        <motion.div
                          key={`${flower.type}-${flower.color}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center justify-between py-2 border-b border-border"
                        >
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                removeFlower(flower.type, flower.color)
                              }
                              className="w-5 h-5 rounded-full bg-muted flex items-center justify-center hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <span className="text-sm text-foreground">
                              {flower.quantity}× {flower.color} {flower.type}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            ₹{flower.price * flower.quantity}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {selectedWrap.price > 0 && (
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-sm text-foreground">
                          {selectedWrap.name}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          ₹{selectedWrap.price}
                        </span>
                      </div>
                    )}

                    {selectedAddOns.map((addOnName) => {
                      const addOn = addOns.find((a) => a.name === addOnName);
                      return (
                        <div
                          key={addOnName}
                          className="flex items-center justify-between py-2 border-b border-border"
                        >
                          <span className="text-sm text-foreground">
                            {addOnName}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            ₹{addOn?.price}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* ── Total */}
                  <div className="flex items-center justify-between py-4 border-t border-border">
                    <span className="text-lg font-semibold text-foreground">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{totalPrice}
                    </span>
                  </div>

                  {/* ── Actions */}
                  <div className="space-y-3">
                    <Button
                      variant="hero"
                      className="w-full"
                      onClick={handleAddToCart}
                      disabled={selectedFlowers.length === 0}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleSaveBouquet}
                      disabled={selectedFlowers.length === 0}
                    >
                      <Save className="w-4 h-4" />
                      Save for Later
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
