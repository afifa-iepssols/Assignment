"use client";

import { useState, useEffect } from "react";
import ImageUpload from "../components/ImageUpload";
import { useRouter } from "next/navigation";
import { useUser } from "../components/UserContext";

export default function AddNewBusiness() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "Business Owner")) {
      router.replace("/unauthorized");
    }
  }, [user, loading, router]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    address: "",
    state: "",
    country: "",
    zipCode: "",
    description: "",
    phone: "",
    email: "",
    website: "",
  });

  const [logoData, setLogoData] = useState<{
    key: string;
    url: string;
    name: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!logoData) {
      setError("Please upload a logo.");
      return;
    }

    const businessPayload = {
      name: form.name,
      category: form.category,
      location: {
        address: form.address,
        state: form.state,
        country: form.country,
        zipCode: form.zipCode,
      },
      description: form.description,
      contactInfo: {
        phone: form.phone,
        email: form.email,
        website: form.website,
      },
      logo: {
        filename: logoData.name,
        url: logoData.url,
        key: logoData.key,
      },
    };

    try {
      setIsSubmitting(true);
      const res = await fetch("https://assignment-2-tjzw.onrender.com/api/business/addBiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(businessPayload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Error creating business.");
        setIsSubmitting(false);
        return;
      }

      alert("Business created successfully!");
      router.push("/"); // or your business list page
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 rounded shadow space-y-4 text-neutral-50">
      <h2 className="text-2xl font-bold mb-4">Add New Business</h2>

      {error && <div className="text-red-600">{error}</div>}

      <input name="name" onChange={handleChange} value={form.name} placeholder="Business Name" className="w-full p-2 border rounded" required />

      <select name="category" onChange={handleChange} value={form.category} className="w-full p-2 border rounded" required>
        <option value="">Select Category</option>
        {["Retail", "Manufacturing", "Services", "Technology", "Agriculture", "Healthcare", "Finance", "Real Estate", "Logistics", "Hospitality", "Other"].map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <input name="address" onChange={handleChange} value={form.address} placeholder="Address" className="w-full p-2 border rounded" required />
      <input name="state" onChange={handleChange} value={form.state} placeholder="State" className="w-full p-2 border rounded" />
      <input name="country" onChange={handleChange} value={form.country} placeholder="Country" className="w-full p-2 border rounded" required />
      <input name="zipCode" onChange={handleChange} value={form.zipCode} placeholder="ZIP Code" className="w-full p-2 border rounded" required />

      <textarea name="description" onChange={handleChange} value={form.description} placeholder="Description" className="w-full p-2 border rounded" required />

      <input name="phone" onChange={handleChange} value={form.phone} placeholder="Phone" className="w-full p-2 border rounded" required />
      <input name="email" onChange={handleChange} value={form.email} placeholder="Email" className="w-full p-2 border rounded" required />
      <input name="website" onChange={handleChange} value={form.website} placeholder="Website (optional)" className="w-full p-2 border rounded" />

      <div>
      <label className="block text-center font-semibold mb-2">Upload Logo</label>
        <ImageUpload onUploadComplete={(data) => setLogoData(data)} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-sky-800 text-white py-2 rounded hover:bg-sky-950 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
