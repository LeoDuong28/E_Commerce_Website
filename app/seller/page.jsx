"use client";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiPlus, FiX } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { BASE_CATEGORIES, STORAGE_KEYS } from "@/lib/constants";

const AddProduct = () => {
  const { getToken, products: allProducts, fetchProductData, isDemoSeller } = useAppContext();

  const presetCategories = useMemo(() => {
    const catSet = new Set(BASE_CATEGORIES);
    allProducts.forEach((p) => {
      const cats = Array.isArray(p.category) ? p.category : [p.category];
      cats.forEach((c) => catSet.add(c));
    });
    return Array.from(catSet).sort();
  }, [allProducts]);

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [showInPopular, setShowInPopular] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hiddenPresets, setHiddenPresets] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HIDDEN_CATEGORY_PRESETS);
    if (saved) {
      try {
        setHiddenPresets(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.HIDDEN_CATEGORY_PRESETS);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HIDDEN_CATEGORY_PRESETS, JSON.stringify(hiddenPresets));
  }, [hiddenPresets]);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const addCustomCategory = () => {
    const trimmed = customCategory.trim();
    if (!trimmed) return;
    if (selectedCategories.includes(trimmed)) {
      toast.error("Category already added");
      return;
    }
    setSelectedCategories((prev) => [...prev, trimmed]);
    setCustomCategory("");
  };

  const removeCategory = (cat) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== cat));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validFiles = files.filter((f) => f);
    if (validFiles.length === 0) {
      return toast.error("Please upload at least one image");
    }

    if (selectedCategories.length === 0) {
      return toast.error("Please select at least one category");
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", JSON.stringify(selectedCategories));
    formData.append("price", price);
    formData.append("offerPrice", offerPrice);
    formData.append("showInPopular", showInPopular.toString());

    for (let i = 0; i < files.length; i++) {
      if (files[i]) {
        formData.append("images", files[i]);
      }
    }

    try {
      const token = await getToken();

      const { data } = await axios.post("/api/product/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message);
        setFiles([]);
        setName("");
        setDescription("");
        setSelectedCategories([]);
        setPrice("");
        setOfferPrice("");
        setShowInPopular(false);
        fetchProductData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (index) => {
    const updatedFiles = [...files];
    updatedFiles[index] = null;
    setFiles(updatedFiles);
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-50/50">
      <div className="md:p-10 p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Add New Product
          </h1>
          <p className="text-gray-500 mt-1">
            Fill in the details to add a new product to your store
          </p>
        </div>

        {isDemoSeller && (
          <div className="mb-6 max-w-2xl px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            Demo Mode — This form is view-only. Product creation is disabled.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl ${isDemoSeller ? "opacity-60 pointer-events-none" : ""}`}
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Product Images <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap items-center gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="relative group">
                  <label htmlFor={`image${index}`} className="cursor-pointer">
                    <input
                      onChange={(e) => {
                        const updatedFiles = [...files];
                        updatedFiles[index] = e.target.files[0];
                        setFiles(updatedFiles);
                      }}
                      type="file"
                      id={`image${index}`}
                      accept="image/*"
                      hidden
                    />
                    <div
                      className={`w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${files[index] ? "border-[#1877f2] bg-blue-50" : "border-gray-300 hover:border-[#1877f2] hover:bg-gray-50"}`}
                    >
                      {files[index] ? (
                        <Image
                          src={URL.createObjectURL(files[index])}
                          alt=""
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <FiPlus className="w-6 h-6 mx-auto text-gray-400" />
                          <span className="text-xs text-gray-400 mt-1">
                            Image {index + 1}
                          </span>
                        </div>
                      )}
                    </div>
                  </label>
                  {files[index] && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <FiX size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Upload up to 4 images. First image will be the main image.
            </p>
          </div>

          <div className="mb-5">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="product-name"
            >
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="product-name"
              type="text"
              placeholder="Enter product name"
              className="w-full outline-none py-2.5 px-4 rounded-lg border border-gray-300 focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 transition-all"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>

          <div className="mb-5">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="product-description"
            >
              Product Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="product-description"
              rows={4}
              className="w-full outline-none py-2.5 px-4 rounded-lg border border-gray-300 focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 transition-all resize-none"
              placeholder="Describe your product..."
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories <span className="text-red-500">*</span>
            </label>

            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1877f2]/10 text-[#1877f2] rounded-full text-sm font-medium"
                  >
                    {cat}
                    <button
                      type="button"
                      onClick={() => removeCategory(cat)}
                      className="hover:bg-[#1877f2]/20 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      <FiX size={10} />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedCategories([])}
                  className="px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-full text-sm font-medium transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-3">
              {presetCategories
                .filter((cat) => !hiddenPresets.includes(cat))
                .map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <span
                      key={cat}
                      className="inline-flex items-center border rounded-full"
                      style={{
                        borderColor: isSelected ? "#1877f2" : "#d1d5db",
                        background: isSelected ? "#1877f2" : "#fff",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`pl-3 pr-2 py-1.5 text-sm rounded-l-full transition-colors ${
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
                          setHiddenPresets((prev) => [...prev, cat]);
                          setSelectedCategories((prev) =>
                            prev.filter((c) => c !== cat)
                          );
                        }}
                        className={`pr-2.5 pl-1 py-1.5 text-xs rounded-r-full border-l transition-colors ${
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
              {hiddenPresets.length > 0 && (
                <button
                  type="button"
                  onClick={() => setHiddenPresets([])}
                  className="px-3 py-1.5 text-gray-400 hover:text-gray-600 text-sm transition-colors underline"
                >
                  Restore hidden
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom category..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomCategory();
                  }
                }}
                className="flex-1 outline-none py-2 px-3 rounded-lg border border-gray-300 focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 transition-all text-sm"
              />
              <button
                type="button"
                onClick={addCustomCategory}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="product-price"
              >
                Original Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                id="product-price"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full outline-none py-2.5 px-4 rounded-lg border border-gray-300 focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 transition-all"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="offer-price"
              >
                Offer Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                id="offer-price"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full outline-none py-2.5 px-4 rounded-lg border border-gray-300 focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 transition-all"
                onChange={(e) => setOfferPrice(e.target.value)}
                value={offerPrice}
                required
              />
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Show in Popular Products
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Display this product on the home page
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowInPopular(!showInPopular)}
              className={`relative w-11 h-6 rounded-full transition-colors ${showInPopular ? "bg-[#1877f2]" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${showInPopular ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 bg-[#1877f2] hover:bg-[#1466d8] disabled:bg-[#1877f2]/60 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <CgSpinner className="animate-spin h-5 w-5" />
                Adding Product...
              </>
            ) : (
              <>
                <FiPlus className="w-5 h-5" />
                Add Product
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
