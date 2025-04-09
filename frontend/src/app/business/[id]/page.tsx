"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "../../components/UserContext"; // adjust path if needed

// ✅ Add this interface
interface Business {
  _id: string;
  name: string;
  category: string;
  description: string;
  logo?: { url: string };
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
  owner: {
    username: string;
  };
}

export default function BusinessPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await fetch(`https://assignment-2-tjzw.onrender.com/api/business/viewBiz/${id}`);
        const data = await res.json();
        setBusiness(data.Biz);
      } catch (error) {
        console.error("Error fetching business:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBusiness();
  }, [id]);

  if (loading || userLoading) return <div className="p-6">Loading...</div>;
  if (!business) return <div className="p-6 text-red-600">Business not found.</div>;

  const isOwner = user && business?.owner?.username === user.username;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <img
          src={business.logo?.url || "/default-logo.png"}
          alt="Logo"
          className="w-24 h-24 rounded-full object-cover border border-black"
        />
        <div>
          <h1 className="text-3xl font-bold">{business.name}</h1>
          <p className="text-sm text-gray-600">{business.category}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Description</h2>
        <p className="text-gray-700">{business.description}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Location</h2>
        <p>
          {business.location.address}, {business.location.state && `${business.location.state}, `}
          {business.location.country} - {business.location.zipCode}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Contact Info</h2>
        <p>📞 {business.contactInfo.phone}</p>
        <p>📧 {business.contactInfo.email}</p>
        {business.contactInfo.website && (
          <p className="text-blue-600 hover: cursor-pointer">
            🌐 <span className="underline">{business.contactInfo.website}</span>
          </p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold">Owner</h2>
        <p>{business.owner.username}</p>
      </div>

      {isOwner && (
        <button
          className="mt-4 px-4 py-2 bg-sky-800 text-white rounded hover:bg-blue-700 transition"
          onClick={() => router.push(`/UpdateBusiness/${business._id}`)}
        >
          Update Business
        </button>
      )}
    </div>
  );
}
