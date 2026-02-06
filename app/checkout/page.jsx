"use client";
import { Fragment, useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  FiChevronDown,
  FiTrash2,
  FiCreditCard,
  FiCheck,
  FiChevronLeft,
  FiTag,
  FiX,
} from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { TAX_RATE } from "@/lib/constants";

const STEPS = ["Shipping", "Review & Pay"];

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center justify-center gap-2 mb-10">
    {STEPS.map((label, i) => (
      <Fragment key={label}>
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              i < currentStep
                ? "bg-green-500 text-white"
                : i === currentStep
                ? "bg-[#1877f2] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {i < currentStep ? <FiCheck className="w-4 h-4" /> : i + 1}
          </div>
          <span
            className={`text-sm font-medium hidden sm:inline ${
              i === currentStep ? "text-[#1877f2]" : "text-gray-500"
            }`}
          >
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div
            className={`w-12 sm:w-20 h-0.5 ${
              i < currentStep ? "bg-green-500" : "bg-gray-200"
            }`}
          />
        )}
      </Fragment>
    ))}
  </div>
);

const AddressForm = ({ onSave, onCancel }) => {
  const { getToken } = useAppContext();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullname: "",
    phoneNumber: "",
    pincode: "",
    area: "",
    city: "",
    state: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.fullname.trim()) errs.fullname = "Full name is required";
    if (!form.phoneNumber.trim()) {
      errs.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phoneNumber.trim())) {
      errs.phoneNumber = "Enter a valid phone number";
    }
    if (!form.pincode.trim()) {
      errs.pincode = "Pin code is required";
    } else if (!/^\d{4,10}$/.test(form.pincode.trim())) {
      errs.pincode = "Enter a valid pin code";
    }
    if (!form.area.trim()) errs.area = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state.trim()) errs.state = "State is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/user/add-address",
        { address: form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Address added");
        onSave(data.address);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field) =>
    `px-3 py-2.5 border rounded outline-none w-full text-gray-700 transition ${
      errors[field]
        ? "border-red-400 focus:border-red-500"
        : "border-gray-300 focus:border-[#1877f2]"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
      <div>
        <input
          className={inputClass("fullname")}
          type="text"
          placeholder="Full name"
          value={form.fullname}
          onChange={(e) => setForm({ ...form, fullname: e.target.value })}
        />
        {errors.fullname && (
          <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>
        )}
      </div>
      <div>
        <input
          className={inputClass("phoneNumber")}
          type="text"
          placeholder="Phone number"
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
        )}
      </div>
      <div>
        <input
          className={inputClass("pincode")}
          type="text"
          placeholder="Pin code"
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
        />
        {errors.pincode && (
          <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
        )}
      </div>
      <div>
        <textarea
          className={`${inputClass("area")} resize-none`}
          rows={3}
          placeholder="Address (Area and Street)"
          value={form.area}
          onChange={(e) => setForm({ ...form, area: e.target.value })}
        />
        {errors.area && (
          <p className="text-red-500 text-xs mt-1">{errors.area}</p>
        )}
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <input
            className={inputClass("city")}
            type="text"
            placeholder="City / District / Town"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
          )}
        </div>
        <div className="flex-1">
          <input
            className={inputClass("state")}
            type="text"
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          />
          {errors.state && (
            <p className="text-red-500 text-xs mt-1">{errors.state}</p>
          )}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#1877f2] text-white px-6 py-2.5 rounded-lg hover:bg-[#0c63d4] disabled:opacity-50 flex items-center gap-2 transition"
        >
          {saving && <CgSpinner className="w-4 h-4 animate-spin" />}
          Save Address
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const Checkout = () => {
  const {
    currency,
    router,
    user,
    getToken,
    products,
    cartItems,
    getCartCount,
    getCartAmount,
  } = useAppContext();

  const [step, setStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const subtotal = getCartAmount();
  const discount = appliedPromo ? appliedPromo.discount : 0;
  const afterDiscount = Math.max(0, subtotal - discount);
  const tax = Math.floor(afterDiscount * TAX_RATE * 100) / 100;
  const total = afterDiscount + tax;

  const cartItemsArray = Object.keys(cartItems)
    .map((id) => ({
      id,
      product: products.find((p) => p._id === id),
      quantity: cartItems[id],
    }))
    .filter((item) => item.product && item.quantity > 0);

  useEffect(() => {
    if (getCartCount() === 0 && products.length > 0) {
      router.push("/cart");
    }
  }, [cartItems, products]);

  useEffect(() => {
    if (user) fetchUserAddresses();
  }, [user]);

  const fetchUserAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0 && !selectedAddress) {
          setSelectedAddress(data.addresses[0]);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleDeleteAddress = async (e, addressId) => {
    e.stopPropagation();
    if (deletingId) return;
    setDeletingId(addressId);
    try {
      const token = await getToken();
      const { data } = await axios.delete("/api/user/delete-address", {
        headers: { Authorization: `Bearer ${token}` },
        data: { addressId },
      });
      if (data.success) {
        toast.success(data.message);
        const updated = userAddresses.filter((a) => a._id !== addressId);
        setUserAddresses(updated);
        if (selectedAddress?._id === addressId) {
          setSelectedAddress(updated[0] || null);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddressSaved = (newAddress) => {
    setUserAddresses((prev) => [...prev, newAddress]);
    setSelectedAddress(newAddress);
    setShowAddForm(false);
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setApplyingPromo(true);
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/promo/validate",
        { code: promoCode.trim(), subtotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setAppliedPromo(data);
        toast.success(
          `Promo applied! ${
            data.discountType === "percentage"
              ? `${data.discountValue}% off`
              : `$${data.discount} off`
          }`
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
  };

  const handlePlaceOrder = async () => {
    if (placingOrder) return;
    setPlacingOrder(true);
    try {
      const token = await getToken();
      const items = cartItemsArray.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      }));

      const { data } = await axios.post(
        "/api/order/create",
        {
          address: selectedAddress._id,
          items,
          promoCode: appliedPromo?.code || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
        setPlacingOrder(false);
      }
    } catch (error) {
      toast.error(error.message);
      setPlacingOrder(false);
    }
  };

  const canContinueToReview = selectedAddress !== null;

  const renderShipping = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-medium text-gray-700 mb-6">
        Shipping Address
      </h2>

      {loadingAddresses ? (
        <div className="flex items-center gap-2 text-gray-500 py-4">
          <CgSpinner className="w-5 h-5 animate-spin" />
          Loading addresses...
        </div>
      ) : (
        <>
          {userAddresses.length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600 block mb-2">
                Select a saved address
              </label>
              <div className="relative w-full text-sm border rounded">
                <button
                  className="w-full text-left px-4 py-3 bg-white text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-[#1877f2]/20"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>
                    {selectedAddress
                      ? `${selectedAddress.fullname}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                      : "Select Address"}
                  </span>
                  <FiChevronDown
                    className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-0" : "-rotate-90"
                    }`}
                    color="#6B7280"
                  />
                </button>

                {isDropdownOpen && (
                  <ul className="absolute w-full bg-white border rounded shadow-md mt-1 z-10 py-1 max-h-60 overflow-y-auto">
                    {userAddresses.map((address) => (
                      <li
                        key={address._id}
                        className={`group flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer ${
                          selectedAddress?._id === address._id
                            ? "bg-blue-50"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedAddress(address);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span className="flex-1 truncate pr-2">
                          {address.fullname}, {address.area}, {address.city},{" "}
                          {address.state}
                        </span>
                        <button
                          onClick={(e) => handleDeleteAddress(e, address._id)}
                          disabled={deletingId === address._id}
                          className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-all flex-shrink-0"
                          title="Delete address"
                        >
                          {deletingId === address._id ? (
                            <CgSpinner className="w-4 h-4 animate-spin" />
                          ) : (
                            <FiTrash2 className="w-4 h-4" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {selectedAddress && !showAddForm && (
            <div className="bg-gray-50 rounded p-4 mb-4 text-sm text-gray-700">
              <p className="font-medium">{selectedAddress.fullname}</p>
              <p>{selectedAddress.area}</p>
              <p>
                {selectedAddress.city}, {selectedAddress.state}{" "}
                {selectedAddress.pincode}
              </p>
              <p>{selectedAddress.phoneNumber}</p>
            </div>
          )}

          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="text-[#1877f2] font-medium hover:underline text-sm"
            >
              + Add New Address
            </button>
          ) : (
            <div className="border rounded p-4 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                New Address
              </h3>
              <AddressForm
                onSave={handleAddressSaved}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )}
        </>
      )}

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => router.push("/cart")}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"
        >
          <FiChevronLeft className="w-4 h-4" />
          Back to Cart
        </button>
        <button
          onClick={() => setStep(1)}
          disabled={!canContinueToReview}
          className="bg-[#1877f2] text-white px-8 py-3 rounded-lg hover:bg-[#0c63d4] disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-medium text-gray-700 mb-6">
        Review Your Order
      </h2>

      <div className="bg-gray-50 rounded p-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase mb-1">
              Shipping to
            </p>
            <p className="font-medium text-gray-800">
              {selectedAddress?.fullname}
            </p>
            <p className="text-sm text-gray-600">{selectedAddress?.area}</p>
            <p className="text-sm text-gray-600">
              {selectedAddress?.city}, {selectedAddress?.state}{" "}
              {selectedAddress?.pincode}
            </p>
            <p className="text-sm text-gray-600">
              {selectedAddress?.phoneNumber}
            </p>
          </div>
          <button
            onClick={() => setStep(0)}
            className="text-[#1877f2] text-sm hover:underline"
          >
            Change
          </button>
        </div>
      </div>

      <div className="border rounded-lg mb-6">
        <div className="px-4 py-3 bg-gray-50 border-b rounded-t-lg">
          <p className="text-sm font-medium text-gray-600">
            {cartItemsArray.length} item
            {cartItemsArray.length !== 1 ? "s" : ""} in your order
          </p>
        </div>
        <div className="divide-y">
          {cartItemsArray.map(({ id, product, quantity }) => (
            <div key={id} className="flex items-center gap-4 p-4">
              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 p-1">
                <Image
                  src={product.image[0]}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 text-sm truncate">{product.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">Qty: {quantity}</p>
              </div>
              <p className="text-gray-800 font-medium text-sm">
                {currency}
                {(product.offerPrice * quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="border rounded-lg p-4 mb-6">
        <label className="text-sm font-medium text-gray-600 flex items-center gap-1.5 mb-3">
          <FiTag className="w-4 h-4" />
          Promo Code
        </label>
        {appliedPromo ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-4 py-2.5">
            <div>
              <span className="font-medium text-green-700">
                {appliedPromo.code}
              </span>
              <span className="text-green-600 text-sm ml-2">
                -${appliedPromo.discount.toFixed(2)} off
              </span>
            </div>
            <button
              onClick={handleRemovePromo}
              className="text-green-600 hover:text-green-800 p-1"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
              className="flex-1 px-3 py-2.5 border rounded outline-none text-gray-700 focus:border-[#1877f2] transition"
            />
            <button
              onClick={handleApplyPromo}
              disabled={applyingPromo || !promoCode.trim()}
              className="bg-[#1877f2] text-white px-5 py-2.5 rounded-lg hover:bg-[#0c63d4] disabled:opacity-50 flex items-center gap-2 transition"
            >
              {applyingPromo && (
                <CgSpinner className="w-4 h-4 animate-spin" />
              )}
              Apply
            </button>
          </div>
        )}
      </div>

      <div className="border rounded-lg p-4 mb-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Subtotal ({getCartCount()} items)
          </span>
          <span className="text-gray-800">
            {currency}
            {subtotal.toFixed(2)}
          </span>
        </div>
        {appliedPromo && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Discount</span>
            <span className="text-green-600">
              -{currency}
              {discount.toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax ({TAX_RATE * 100}%)</span>
          <span className="text-gray-800">
            {currency}
            {tax.toFixed(2)}
          </span>
        </div>
        <hr className="border-gray-200" />
        <div className="flex justify-between text-lg font-medium">
          <span>Total</span>
          <span>
            {currency}
            {total.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
        <FiCreditCard className="w-4 h-4" />
        <span>You will be redirected to Stripe for secure payment</span>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setStep(0)}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"
        >
          <FiChevronLeft className="w-4 h-4" />
          Back to Shipping
        </button>
        <button
          onClick={handlePlaceOrder}
          disabled={placingOrder}
          className="bg-[#1877f2] text-white px-10 py-3 rounded-lg hover:bg-[#0c63d4] disabled:opacity-60 flex items-center gap-2 font-medium transition"
        >
          {placingOrder ? (
            <>
              <CgSpinner className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${currency}${total.toFixed(2)}`
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-6 md:px-16 lg:px-32 py-10">
        <h1 className="text-2xl md:text-3xl text-gray-500 text-center mb-2">
          <span className="font-medium text-[#1877f2]">Checkout</span>
        </h1>
        <StepIndicator currentStep={step} />
        {step === 0 && renderShipping()}
        {step === 1 && renderReview()}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
