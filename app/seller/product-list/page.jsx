"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiPlus, FiSearch, FiPackage, FiEdit2, FiEye, FiTrash2, FiX } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { BASE_CATEGORIES, STORAGE_KEYS } from "@/lib/constants";

const ProductList = () => {
  const { router, getToken, user, isDemoSeller } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    categories: [],
    price: "",
    offerPrice: "",
    showInPopular: false,
  });
  const [editCustomCategory, setEditCustomCategory] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hiddenEditPresets, setHiddenEditPresets] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HIDDEN_CATEGORY_PRESETS);
    if (saved) {
      try {
        setHiddenEditPresets(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.HIDDEN_CATEGORY_PRESETS);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.HIDDEN_CATEGORY_PRESETS,
      JSON.stringify(hiddenEditPresets)
    );
  }, [hiddenEditPresets]);

  const presetCategories = useMemo(() => {
    const catSet = new Set(BASE_CATEGORIES);
    products.forEach((p) => {
      const cats = Array.isArray(p.category) ? p.category : [p.category];
      cats.forEach((c) => catSet.add(c));
    });
    return Array.from(catSet).sort();
  }, [products]);

  const getProductCategories = (product) => {
    if (Array.isArray(product.category)) return product.category;
    return [product.category];
  };

  const fetchSellerProduct = async () => {
    try {
      if (isDemoSeller && !user) {
        const { data } = await axios.get("/api/product/list");
        if (data.success) {
          setProducts(data.products);
        }
        setLoading(false);
        return;
      }

      const token = await getToken();

      const { data } = await axios.get("/api/product/seller-list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setProducts(data.products);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeletingId(productId);

    try {
      const token = await getToken();

      const { data } = await axios.delete("/api/product/delete", {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId },
      });

      if (data.success) {
        toast.success(data.message);
        setProducts(products.filter((p) => p._id !== productId));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (product) => {
    setEditForm({
      name: product.name,
      description: product.description,
      categories: getProductCategories(product),
      price: product.price,
      offerPrice: product.offerPrice,
      showInPopular: product.showInPopular || false,
    });
    setEditCustomCategory("");
    const saved = localStorage.getItem(STORAGE_KEYS.HIDDEN_CATEGORY_PRESETS);
    if (saved) {
      try {
        setHiddenEditPresets(JSON.parse(saved));
      } catch {
        setHiddenEditPresets([]);
      }
    } else {
      setHiddenEditPresets([]);
    }
    setEditingProduct(product);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditCustomCategory("");
  };

  const toggleEditCategory = (cat) => {
    setEditForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const addEditCustomCategory = () => {
    const trimmed = editCustomCategory.trim();
    if (!trimmed) return;
    if (editForm.categories.includes(trimmed)) {
      toast.error("Category already added");
      return;
    }
    setEditForm((prev) => ({
      ...prev,
      categories: [...prev.categories, trimmed],
    }));
    setEditCustomCategory("");
  };

  const removeEditCategory = (cat) => {
    setEditForm((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== cat),
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (editForm.categories.length === 0) {
      return toast.error("Please select at least one category");
    }

    setIsSaving(true);

    try {
      const token = await getToken();

      const { data } = await axios.put(
        "/api/product/edit",
        {
          productId: editingProduct._id,
          name: editForm.name,
          description: editForm.description,
          category: editForm.categories,
          price: editForm.price,
          offerPrice: editForm.offerPrice,
          showInPopular: editForm.showInPopular,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setProducts(
          products.map((p) =>
            p._id === editingProduct._id ? data.product : p
          )
        );
        closeEditModal();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePopular = async (product) => {
    const newVal = !product.showInPopular;
    setProducts(
      products.map((p) =>
        p._id === product._id ? { ...p, showInPopular: newVal } : p
      )
    );
    try {
      const token = await getToken();
      const { data } = await axios.put(
        "/api/product/edit",
        { productId: product._id, showInPopular: newVal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!data.success) {
        toast.error(data.message);
        setProducts(
          products.map((p) =>
            p._id === product._id ? { ...p, showInPopular: !newVal } : p
          )
        );
      }
    } catch (error) {
      toast.error(error.message);
      setProducts(
        products.map((p) =>
          p._id === product._id ? { ...p, showInPopular: !newVal } : p
        )
      );
    }
  };

  useEffect(() => {
    if (user || isDemoSeller) {
      fetchSellerProduct();
    }
  }, [user, isDemoSeller]);

  const filteredProducts = products.filter((product) => {
    const cats = getProductCategories(product);
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cats.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="flex-1 min-h-screen bg-gray-50/50">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
              <p className="text-gray-500 mt-1">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"} in your store
              </p>
            </div>
            {!isDemoSeller && (
              <button
                onClick={() => router.push("/seller")}
                className="flex items-center gap-2 px-4 py-2 bg-[#1877f2] hover:bg-[#1466d8] text-white font-medium rounded-lg transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                Add Product
              </button>
            )}
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 outline-none transition-all"
              />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <FiPackage className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-1">
                No products found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Try a different search term"
                  : "Start by adding your first product"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => router.push("/seller")}
                  className="text-[#1877f2] hover:text-[#1466d8] font-medium"
                >
                  Add your first product
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="hidden md:grid md:grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-500">
                <span className="w-12">Image</span>
                <span>Product</span>
                <span className="w-32 text-right">Price</span>
                <span className="w-28 text-center">Categories</span>
                <span className="w-16 text-center">Popular</span>
                <span className="w-28 text-right">Actions</span>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex flex-col md:grid md:grid-cols-[auto_1fr_auto_auto_auto_auto] items-start md:items-center gap-3 md:gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={product.image[0]}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-400 truncate max-w-md">
                        {product.description}
                      </p>
                    </div>

                    <div className="w-32 text-right flex-shrink-0">
                      <p className="font-semibold text-gray-800">
                        ${product.offerPrice}
                      </p>
                      {product.price > product.offerPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          ${product.price}
                        </p>
                      )}
                    </div>

                    <div className="w-28 flex flex-wrap gap-1 justify-center flex-shrink-0">
                      {getProductCategories(product).map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600 whitespace-nowrap"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    <div className="w-16 flex justify-center flex-shrink-0">
                      <button
                        onClick={() => !isDemoSeller && togglePopular(product)}
                        disabled={isDemoSeller}
                        className={`relative w-9 h-5 rounded-full transition-colors ${isDemoSeller ? "opacity-50 cursor-not-allowed" : ""} ${product.showInPopular ? "bg-[#1877f2]" : "bg-gray-300"}`}
                        title={isDemoSeller ? "View only in demo mode" : product.showInPopular ? "Shown in Popular" : "Not in Popular"}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${product.showInPopular ? "translate-x-4" : "translate-x-0"}`}
                        />
                      </button>
                    </div>

                    <div className="w-28 flex items-center justify-end gap-1 flex-shrink-0">
                      {!isDemoSeller && (
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-[#1877f2] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => router.push(`/product/${product._id}`)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      {!isDemoSeller && (
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          disabled={deletingId === product._id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === product._id ? (
                            <CgSpinner className="w-4 h-4 animate-spin" />
                          ) : (
                            <FiTrash2 className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={closeEditModal}
              ></div>
              <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Edit Product
                  </h2>
                  <button
                    onClick={closeEditModal}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full outline-none py-2.5 px-4 rounded-lg border border-gray-300 focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full outline-none py-2.5 px-4 rounded-lg border border-gray-300 focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 transition-all resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Categories
                    </label>

                    {editForm.categories.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {editForm.categories.map((cat) => (
                          <span
                            key={cat}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1877f2]/10 text-[#1877f2] rounded-full text-sm font-medium"
                          >
                            {cat}
                            <button
                              type="button"
                              onClick={() => removeEditCategory(cat)}
                              className="hover:bg-[#1877f2]/20 rounded-full w-4 h-4 flex items-center justify-center"
                            >
                              <FiX size={10} />
                            </button>
                          </span>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            setEditForm((prev) => ({
                              ...prev,
                              categories: [],
                            }))
                          }
                          className="px-3 py-1 text-red-500 hover:bg-red-50 rounded-full text-sm font-medium transition-colors"
                        >
                          Clear all
                        </button>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-3">
                      {presetCategories
                        .filter((cat) => !hiddenEditPresets.includes(cat))
                        .map((cat) => {
                          const isSelected =
                            editForm.categories.includes(cat);
                          return (
                            <span
                              key={cat}
                              className="inline-flex items-center border rounded-full"
                              style={{
                                borderColor: isSelected
                                  ? "#1877f2"
                                  : "#d1d5db",
                                background: isSelected ? "#1877f2" : "#fff",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => toggleEditCategory(cat)}
                                className={`pl-3 pr-2 py-1 text-sm rounded-l-full transition-colors ${
                                  isSelected
                                    ? "text-white"
                                    : "text-gray-600 hover:text-[#1877f2]"
                                }`}
                              >
                                {cat}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setHiddenEditPresets((prev) => [
                                    ...prev,
                                    cat,
                                  ]);
                                  setEditForm((prev) => ({
                                    ...prev,
                                    categories: prev.categories.filter(
                                      (c) => c !== cat
                                    ),
                                  }));
                                }}
                                className={`pr-2.5 pl-1 py-1 text-xs rounded-r-full border-l transition-colors ${
                                  isSelected
                                    ? "text-white/80 hover:text-white hover:bg-red-500 border-white/20"
                                    : "text-gray-400 hover:text-red-500 hover:bg-red-50 border-gray-200"
                                }`}
                                title={`Remove "${cat}" from presets`}
                              >
                                ✕
                              </button>
                            </span>
                          );
                        })}
                      {hiddenEditPresets.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setHiddenEditPresets([])}
                          className="px-3 py-1 text-gray-400 hover:text-gray-600 text-sm transition-colors underline"
                        >
                          Restore hidden
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add custom category..."
                        value={editCustomCategory}
                        onChange={(e) => setEditCustomCategory(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addEditCustomCategory();
                          }
                        }}
                        className="flex-1 outline-none py-2 px-3 rounded-lg border border-gray-300 focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={addEditCustomCategory}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Original Price ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm({ ...editForm, price: e.target.value })
                        }
                        className="w-full outline-none py-2.5 px-4 rounded-lg border border-gray-300 focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Offer Price ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editForm.offerPrice}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            offerPrice: e.target.value,
                          })
                        }
                        className="w-full outline-none py-2.5 px-4 rounded-lg border border-gray-300 focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Show in Popular Products
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Display on the home page
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEditForm({
                          ...editForm,
                          showInPopular: !editForm.showInPopular,
                        })
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors ${editForm.showInPopular ? "bg-[#1877f2]" : "bg-gray-300"}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${editForm.showInPopular ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 py-2.5 bg-[#1877f2] hover:bg-[#1466d8] disabled:bg-[#1877f2]/60 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <CgSpinner className="animate-spin h-4 w-4" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
