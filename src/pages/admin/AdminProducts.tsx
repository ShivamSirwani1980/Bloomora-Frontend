import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, X, Upload } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { products as defaultProducts } from '@/lib/data';
import { useStore, Product } from '@/lib/store';
import { toast } from 'sonner';
import axios from 'axios';

const categories = ['All', 'Exotic', 'Bouquets', 'Premium', 'Roses', 'Seasonal'];

interface AdminProduct extends Product {
  visible: boolean;
  stock: number;
}

const emptyForm = {
  name: '',
  price: '',
  originalPrice: '',
  categories: ['Bouquets'] as string[],
  description: '',
  rating: '4.5',
  reviews: '0',
  stock: '20',
  image: '',
  isBestselling: false,
};

export default function AdminProducts() {
  const { adminProducts, setAdminProducts, addAdminProduct, updateAdminProduct, deleteAdminProduct } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Seed admin products from static data on first load
  useEffect(() => {
    if (adminProducts.length === 0) {
      const seeded = defaultProducts.map((p) => ({
        ...p,
        visible: true,
        stock: Math.floor(Math.random() * 50) + 5,
      }));
      setAdminProducts(seeded as unknown as Product[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const productList = adminProducts as unknown as AdminProduct[];

  const matchCat = (cat: string | string[], selected: string) => {
    if (selected === 'All') return true;
    if (Array.isArray(cat)) return cat.includes(selected);
    return cat === selected;
  };

  const filtered = productList.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = matchCat(p.category, selectedCategory);
    return matchesSearch && matchesCat;
  });

  const toggleVisibility = async (id: string) => {
    const product = productList.find((p) => p.id === id);
    if (product) {
      if (id.length < 24) {
        updateAdminProduct(id, { ...product, visible: !product.visible } as unknown as Product);
        toast.success('Product visibility updated (local sample data)');
        return;
      }

      try {
        const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}api/v1/main/Bloomora/ToggleProductVisibility/${id}/`);
        if (res.status === 200) {
          updateAdminProduct(id, { ...product, visible: res.data.data.visible } as unknown as Product);
          toast.success('Product visibility updated');
        } else {
          toast.error('Failed to change visibility');
        }
      } catch (e: any) {
        toast.error('API Error toggling visibility');
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setForm((f) => ({ ...f, image: url }));
    }
  };

  const openAddDialog = () => {
    setForm(emptyForm);
    setImagePreview(null);
    setImageFile(null);
    setShowAddDialog(true);
  };

  const openEditDialog = (product: AdminProduct) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      price: String(product.price),
      originalPrice: String(product.originalPrice || ''),
      categories: Array.isArray(product.category) ? product.category : [product.category],
      description: product.description || '',
      rating: String(product.rating),
      reviews: String(product.review_count || product.reviews || '0'),
      stock: String(product.stock),
      image: product.image || product.image_url || '',
      isBestselling: product.isBestselling || false,
    });
    setImagePreview(product.image || product.image_url || null);
  };

  const handleAdd = async () => {
    if (!form.name || !form.price || !imageFile) {
      toast.error('Name, price, and a product image are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', String(form.price));
      if (form.originalPrice) {
        formData.append('original_price', String(form.originalPrice));
      }
      form.categories.forEach((cat) => {
        formData.append('category', cat);
      });
      // Backend does not natively track description and stock in CreateProduct currently, but we provide it:
      formData.append('description', form.description || '');
      formData.append('rating', String(form.rating || 4.5));
      formData.append('review_count', String(form.reviews || 0));
      formData.append('stock', String(form.stock || 20));
      formData.append('isBestselling', String(form.isBestselling));
      formData.append('image', imageFile);

      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/v1/main/Bloomora/CreateProduct/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

        if (res.status === 200 || res.status === 201) {
          const newProduct: AdminProduct = {
            id: res.data.data?.id || res.data.data || res.data._id || crypto.randomUUID(),
            name: form.name,
            price: Number(form.price),
            originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
            category: form.categories,
            description: form.description,
            rating: Number(form.rating) || 4.5,
            reviews: Number(form.reviews) || 0,
            review_count: Number(form.reviews) || 0,
            image: res.data.data?.image_url || form.image || '/placeholder.svg',
            inStock: true,
            visible: true,
            stock: Number(form.stock) || 20,
            isBestselling: form.isBestselling,
          };
        addAdminProduct(newProduct as unknown as Product);
        setShowAddDialog(false);
        toast.success('Product created securely in the database');
      } else {
        toast.error(res.data.error || 'Failed to create product via API');
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.error || e.message || 'Error occurred while saving product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editProduct || !form.name || !form.price) {
      toast.error('Name and price are required');
      return;
    }
    
    if (editProduct.id.length < 24) {
      updateAdminProduct(editProduct.id, {
        name: form.name,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        category: form.categories,
        description: form.description,
        rating: Number(form.rating) || 4.5,
        review_count: Number(form.reviews) || 0,
        reviews: Number(form.reviews) || 0,
        image: form.image || editProduct.image,
        stock: Number(form.stock),
        isBestselling: form.isBestselling,
      } as unknown as Product);
      setEditProduct(null);
      toast.success('Product updated (local sample data)');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', String(form.price));
      if (form.originalPrice) {
        formData.append('original_price', String(form.originalPrice));
      }
      form.categories.forEach((cat) => {
        formData.append('category', cat);
      });
      formData.append('description', form.description || '');
      formData.append('rating', String(form.rating || 4.5));
      formData.append('review_count', String(form.reviews || 0));
      formData.append('stock', String(form.stock || 20));
      formData.append('isBestselling', String(form.isBestselling));
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}api/v1/main/Bloomora/UpdateProduct/${editProduct.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        updateAdminProduct(editProduct.id, {
          name: form.name,
          price: Number(form.price),
          originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
          category: form.categories,
          description: form.description,
          rating: Number(form.rating) || 4.5,
          review_count: Number(form.reviews) || 0,
          reviews: Number(form.reviews) || 0,
          image: res.data.data?.image_url || res.data.image_url || form.image || editProduct.image,
          stock: Number(form.stock),
          isBestselling: form.isBestselling,
        } as unknown as Product);
        setEditProduct(null);
        toast.success('Product updated fully in database');
      } else {
        toast.error('Failed to update product via API');
      }
    } catch(e) {
       toast.error('Error updating product in API');
    } finally {
       setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      const id = deleteTarget.id;
      setDeleteTarget(null); // optimistic UX

      if (id.length < 24) {
        deleteAdminProduct(id);
        toast.success('Product permanently deleted (local sample data)');
        return;
      }

      try {
        const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}api/v1/main/Bloomora/DeleteProduct/${id}/`);
        if (res.status === 200) {
           deleteAdminProduct(id);
           toast.success('Product permanently deleted');
        } else {
           toast.error('Failed to delete product from database');
        }
      } catch(e) {
         toast.error('API Error deleting product');
      }
    }
  };

  const ProductFormContent = () => (
    <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
      <div className="grid gap-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Elegant Pink Rose Bouquet" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input id="price" type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="1299" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="originalPrice">Original Price (₹)</Label>
          <Input id="originalPrice" type="number" value={form.originalPrice} onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))} placeholder="1599" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2">
          <Label>Categories</Label>
          <div className="flex flex-wrap gap-2">
            {categories.filter((c) => c !== 'All').map((c) => {
              const isSelected = form.categories.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      categories: isSelected
                        ? f.categories.filter((cat) => cat !== c)
                        : [...f.categories, c],
                    }))
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    isSelected
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-transparent border-input text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
        </div>
      </div>
      <div className="grid gap-2">
        <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, isBestselling: !f.isBestselling }))}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              form.isBestselling ? 'bg-primary' : 'bg-input'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                form.isBestselling ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Bestselling Product</Label>
            <p className="text-xs text-muted-foreground">Show this product in the Bestselling section</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2">
          <Label htmlFor="rating">Rating</Label>
          <Input id="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="reviews">Review Count</Label>
          <Input id="reviews" type="number" min="0" value={form.reviews} onChange={(e) => setForm((f) => ({ ...f, reviews: e.target.value }))} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Product description..." rows={3} />
      </div>
      <div className="grid gap-2">
        <Label>Product Image</Label>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors text-sm text-muted-foreground">
            <Upload className="w-4 h-4" />
            Upload Image
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          {imagePreview && (
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-border">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Products</h1>
            <p className="text-sm text-muted-foreground">{productList.length} products total</p>
          </div>
          <Button variant="default" size="sm" onClick={openAddDialog}>
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rating</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((product, i) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                            <img src={product.image || product.image_url || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-medium text-foreground truncate max-w-[200px]">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap max-w-[150px]">
                          {(Array.isArray(product.category) ? product.category : [product.category]).map((c) => (
                            <span key={c} className="px-2 py-1 rounded-full bg-muted text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground">₹{product.price}</td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${product.stock < 10 ? 'text-destructive' : 'text-foreground'}`}>{product.stock}</span>
                      </td>
                      <td className="py-3 px-4 text-foreground">⭐ {product.rating}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          product.visible ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'
                        }`}>
                          {product.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => toggleVisibility(product.id)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            {product.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button onClick={() => openEditDialog(product)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteTarget(product)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No products found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Fill in the details to add a new product to the catalog.</DialogDescription>
          </DialogHeader>
          <ProductFormContent />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleAdd} disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                'Add Product'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editProduct} onOpenChange={(open) => !open && setEditProduct(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product details below.</DialogDescription>
          </DialogHeader>
          <ProductFormContent />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProduct(null)}>Cancel</Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
