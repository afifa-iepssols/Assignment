"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../components/UserContext";
import FilterSidebar from "../components/FilterSidebar";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";

interface Business {
  _id: string;
  name: string;
  category: string;
  description: string;
  owner: { username: string };
  location: { address: string; state: string };
  logo?: {
    url: string;
    filename: string;
    key: string;
  };
}

const ITEMS_PER_PAGE = 10;

export default function AdminDashboard() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "Admin")) {
      router.replace("/");
    }
  }, [user, loading, router]);

  const fetchBusinesses = async (page: number, filters = {}, search = "") => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...filters,
      });

      if (search) params.set("name", search);

      const res = await fetch(`https://assignment-2-tjzw.onrender.com/api/business/viewBizs?${params.toString()}`);
      const data = await res.json();

      setBusinesses(data.businesses || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch Businesses", error);
    }
  };

  useEffect(() => {
    fetchBusinesses(currentPage, filters, searchTerm);
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this business?");
    if (!confirmed) return;

    try {
      const res = await fetch(`https://assignment-2-tjzw.onrender.com/api/business/deleteBiz/${id}`, {
        method: "DELETE",
        credentials: "include", 
      });

      if (res.ok) {
        setBusinesses((prev) => prev.filter((biz) => biz._id !== id));
      } else {
        console.error("Failed to delete business");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard - All Businesses</h1>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={(term) => {
          setSearchTerm(term);
          setCurrentPage(1);
          fetchBusinesses(1, filters, term);
        }}
      />

      <FilterSidebar
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
          fetchBusinesses(1, newFilters, searchTerm);
        }}
      />

      <table className="min-w-full border mt-6">
        <thead className="text-neutral-50">
          <tr>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Category</th>
            <th className="text-left p-2">Description</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {businesses.map((biz) => (
            <tr key={biz._id} className="border">
              <td className="p-2">{biz.name}</td>
              <td className="p-2">{biz.category}</td>
              <td className="p-2 overflow-hidden text-ellipsis whitespace-nowrap">{biz.description}</td>
              <td className="p-2 space-x-2">
                <button
                  className="px-3 py-1 bg-pink-800 text-white rounded hover:opacity-50 cursor-pointer"
                  onClick={() => handleDelete(biz._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
