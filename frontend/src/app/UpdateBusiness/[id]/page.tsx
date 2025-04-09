"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UploadButton } from "../../../utils/uploadthing"; 
import ImageUpload from "../../components/ImageUpload";

interface Business {
  _id: string;
  name: string;
  category: string;
  description: string;
  logo?: { url: string; key: string };
  location: {
    address: string;
    state?: string;
    country: string;
    zipCode: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
}

const categories = [
  'Retail', 'Manufacturing', 'Services', 'Technology', 'Agriculture', 'Healthcare',
  'Finance', 'Real Estate', 'Logistics', 'Hospitality', 'Other'
];

export default function UpdateBusinessPage() {
  const { id } = useParams();
  const router = useRouter();

  const [business, setBusiness] = useState<Business | null>(null);
  const [form, setForm] = useState<any>({});
  const [logo, setLogo] = useState<{ url: string; key: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await fetch(`https://assignment-2-tjzw.onrender.com/api/business/viewBiz/${id}`);
        const data = await res.json();
        setBusiness(data.Biz);
        setForm(data.Biz);
        setLogo(data.Biz.logo);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBusiness();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("location.") || name.startsWith("contactInfo.")) {
      const [group, field] = name.split(".");
      setForm((prev: any) => ({
        ...prev,
        [group]: { ...prev[group], [field]: value }
      }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = {
        ...form,
        logo: logo ? { url: logo.url, key: logo.key } : undefined
      };
      const res = await fetch(`https://assignment-2-tjzw.onrender.com/api/business/updateBiz/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Business updated!");
        router.push(`/business/${id}`);
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!business) return <div className="p-6 text-red-600">Business not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Update Business</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name || ""} onChange={handleChange} placeholder="Name" className="w-full border p-2" />
        <select name="category" value={form.category || ""} onChange={handleChange} className="w-full border p-2 bg-neutral-950 text-neutral-50">
          <option value="">Select Category</option>
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <textarea name="description" value={form.description || ""} onChange={handleChange} placeholder="Description" className="w-full border p-2" />
        
        <h3 className="font-medium">Location</h3>
        <input name="location.address" value={form.location?.address || ""} onChange={handleChange} placeholder="Address" className="w-full border p-2" />
        <input name="location.state" value={form.location?.state || ""} onChange={handleChange} placeholder="State" className="w-full border p-2" />
        <input name="location.country" value={form.location?.country || ""} onChange={handleChange} placeholder="Country" className="w-full border p-2" />
        <input name="location.zipCode" value={form.location?.zipCode || ""} onChange={handleChange} placeholder="Zip Code" className="w-full border p-2" />
        
        <h3 className="font-medium">Contact Info</h3>
        <input name="contactInfo.phone" value={form.contactInfo?.phone || ""} onChange={handleChange} placeholder="Phone" className="w-full border p-2" />
        <input name="contactInfo.email" value={form.contactInfo?.email || ""} onChange={handleChange} placeholder="Email" className="w-full border p-2" />
        <input name="contactInfo.website" value={form.contactInfo?.website || ""} onChange={handleChange} placeholder="Website" className="w-full border p-2" />

        <div className="mt-4">
        <p className="text-center font-semibold mb-2">Update Logo</p> {/* Bold and center-aligned text */}
        <ImageUpload
            initialUrl={logo?.url}
            onUploadComplete={(result) => {
            setLogo({ url: result.url, key: result.key });
            }}
        />
        </div>
        <button
            type="submit"
            className="block w-full mt-6 px-4 py-2 bg-sky-800 text-white rounded hover:bg-sky-950 text-center"
            >
            Update
        </button>
      </form>
    </div>
  );
}
