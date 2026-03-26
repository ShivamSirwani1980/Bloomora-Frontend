import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";

interface Coupon {
  id?: string;
  code: string;
  discount: string | number;
  description: string;
  min_order: number;
  valid_till: string;
  usage_limit: number;
  used?: number;
  active?: boolean;
}

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  coupon?: Coupon | null;
}

export function CouponModal({ isOpen, onClose, onSuccess, coupon }: CouponModalProps) {
  const [formData, setFormData] = useState<Coupon>({
    code: "",
    discount: "",
    description: "",
    min_order: 0,
    valid_till: "",
    usage_limit: 100,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (coupon) {
      setFormData(coupon);
    } else {
      setFormData({
        code: "",
        discount: "",
        description: "",
        min_order: 0,
        valid_till: "",
        usage_limit: 100,
      });
    }
  }, [coupon, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (coupon?.id) {
        // Update existing coupon
        const response = await axios.put(
          `${API_BASE_URL}/api/v1/main/Bloomora/UpdateOffer/${coupon.id}/`,
          formData
        );
        if (response.data.status === 200) {
          toast.success("Coupon updated successfully");
          onSuccess();
          onClose();
        } else {
          toast.error(response.data.message || "Failed to update coupon");
        }
      } else {
        // Create new coupon
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/main/Bloomora/CreateOffer/`,
          formData
        );
        if (response.data.status === 201) {
          toast.success("Coupon created successfully");
          onSuccess();
          onClose();
        } else {
          toast.error(response.data.message || "Failed to create coupon");
        }
      }
    } catch (error: any) {
      console.error("Error saving coupon:", error);
      toast.error(error.response?.data?.message || "Internal server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{coupon ? "Edit Coupon" : "Create New Coupon"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                placeholder="e.g. BLOOM10"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (e.g. 10 or 10% OFF)</Label>
              <Input
                id="discount"
                placeholder="10"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter coupon description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_order">Minimum Order (₹)</Label>
              <Input
                id="min_order"
                type="number"
                value={formData.min_order}
                onChange={(e) => setFormData({ ...formData, min_order: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valid_till">Expiry Date</Label>
              <Input
                id="valid_till"
                type="date"
                value={formData.valid_till}
                onChange={(e) => setFormData({ ...formData, valid_till: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="usage_limit">Usage Limit</Label>
            <Input
              id="usage_limit"
              type="number"
              value={formData.usage_limit}
              onChange={(e) => setFormData({ ...formData, usage_limit: parseInt(e.target.value) })}
              required
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : coupon ? "Update Coupon" : "Create Coupon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
