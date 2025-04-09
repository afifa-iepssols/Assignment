"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import FilterSidebar from "../components/FilterSidebar";
import SearchBar from "../components/SearchBar";
import BusinessCard from "../components/BusinessCard";
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

const ITEMS_PER_PAGE = 9;

export default function Landing() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBusinesses = async (page: number, filters = {}, search = "") => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...filters,
      });

      if (search) params.set("name", search);

      const res = await fetch(
        `https://assignment-2-tjzw.onrender.com/api/business/viewBizs?${params.toString()}`
      );
      const data = await res.json();

      setBusinesses(data.businesses || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching businesses:", err);
    }
  };

  useEffect(() => {
    fetchBusinesses(currentPage, filters, searchTerm);
  }, [currentPage]);

  return (
    <main className="p-6">
      <div className="flex flex-col lg:flex-row flex-wrap items-center gap-4 mb-6">

        <div className="flex-1">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 auto-rows-fr">
          {Array.isArray(businesses) && businesses.length > 0 ? (
            businesses.map((biz) => (
              <BusinessCard key={biz._id} business={biz} />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-6">No businesses found.</p>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />

        </div>
      </div>
    </main>
  );
}
