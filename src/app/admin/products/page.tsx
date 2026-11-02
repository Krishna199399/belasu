'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  IndianRupee,
  ShoppingBag,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface PhysicalProduct {
  id: string;
  title: string;
  sku: string;
  series: string;
  gradeClass: number;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockQuantity: number;
  coverImage: string;
  unitsSold: number;
  revenue: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<PhysicalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.physical);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStock = async (book: PhysicalProduct) => {
    const nextInStock = !book.inStock;
    setTogglingId(book.id);

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) =>
        p.id === book.id
          ? {
              ...p,
              inStock: nextInStock,
              stockQuantity: nextInStock ? (p.stockQuantity > 0 ? p.stockQuantity : 25) : 0,
            }
          : p
      )
    );

    try {
      const res = await fetch('/api/admin/inventory/toggle-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: book.id, inStock: nextInStock }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(
          `${book.title} is now ${nextInStock ? 'IN STOCK' : 'OUT OF STOCK'}`
        );
        setProducts((prev) =>
          prev.map((p) =>
            p.id === book.id
              ? {
                  ...p,
                  inStock: data.inStock,
                  stockQuantity: data.stockQuantity,
                }
              : p
          )
        );
      } else {
        setProducts((prev) =>
          prev.map((p) => (p.id === book.id ? book : p))
        );
        toast.error(data.error || 'Failed to update stock');
      }
    } catch (err) {
      setProducts((prev) =>
        prev.map((p) => (p.id === book.id ? book : p))
      );
      toast.error('Network error updating stock');
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchTerm === '' ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeries =
      selectedSeries === 'all' || p.series === selectedSeries;
    const matchesGrade =
      selectedGrade === 'all' || p.gradeClass === Number(selectedGrade);
    return matchesSearch && matchesSeries && matchesGrade;
  });

  const totalInventory = products.reduce((sum, p) => sum + (p.stockQuantity || 0), 0);
  const totalPhysicalSold = products.reduce((sum, p) => sum + (p.unitsSold || 0), 0);
  const totalPhysicalRevenue = products.reduce((sum, p) => sum + (p.revenue || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Hard Copy Book Catalog (Classes 1–5)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Savi, Kali, Siri, and Tili series • Monitor stock quantities, prices, and total sales
          </p>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Available Inventory
          </span>
          <span className="text-2xl font-black text-slate-900 tracking-tight mt-1 block">
            {totalInventory} units in stock
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Hard Copy Books Sold
          </span>
          <span className="text-2xl font-black text-slate-900 tracking-tight mt-1 block">
            {totalPhysicalSold} copies sold
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Hard Copy Sales Revenue
          </span>
          <span className="text-2xl font-black text-emerald-600 tracking-tight mt-1 block">
            {formatPrice(totalPhysicalRevenue)}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or SKU (e.g. SK1)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Series filter */}
          <select
            value={selectedSeries}
            onChange={(e) => setSelectedSeries(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Series</option>
            <option value="Savi">Savi Kannada</option>
            <option value="Kali">Kali Kannada</option>
            <option value="Siri">Siri Kannada</option>
            <option value="Tili">Tili Kannada</option>
          </select>

          {/* Grade filter */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Classes</option>
            <option value="1">Class 1</option>
            <option value="2">Class 2</option>
            <option value="3">Class 3</option>
            <option value="4">Class 4</option>
            <option value="5">Class 5</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No books match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Book Title</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Series & Grade</th>
                  <th className="py-3.5 px-4 text-right">Price</th>
                  <th className="py-3.5 px-4 text-center">Stock Status (1-Click Toggle)</th>
                  <th className="py-3.5 px-4 text-center">Sold</th>
                  <th className="py-3.5 px-4 text-right">Revenue</th>
                  <th className="py-3.5 px-4 text-right">Storefront</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-10 h-14 object-cover rounded shadow-xs border border-slate-200"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate max-w-xs">
                            {book.title}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-mono">
                            ID: {book.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {book.sku}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
                          {book.series}
                        </span>
                        <span className="text-slate-600 font-medium">Class {book.gradeClass}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {formatPrice(book.price)}
                      {book.originalPrice && (
                        <span className="block text-[10px] text-slate-400 line-through">
                          {formatPrice(book.originalPrice)}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleStock(book)}
                          disabled={togglingId === book.id}
                          className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
                            book.inStock
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400'
                              : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100 hover:border-rose-400'
                          } ${togglingId === book.id ? 'opacity-60 cursor-wait' : ''}`}
                          title={`Click to turn ${book.inStock ? 'OFF (Out of Stock)' : 'ON (In Stock)'}`}
                        >
                          {/* Sliding Toggle Visual */}
                          <div
                            className={`w-7 h-4 flex items-center rounded-full p-0.5 transition-colors ${
                              book.inStock ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                            }`}
                          >
                            <div className="bg-white w-3 h-3 rounded-full shadow-xs transform transition-transform" />
                          </div>

                          <span className="flex items-center gap-1 font-semibold">
                            {book.inStock ? (
                              <>
                                <span>In Stock</span>
                                <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded-md font-bold">
                                  {book.stockQuantity}
                                </span>
                              </>
                            ) : (
                              <span>Out of Stock</span>
                            )}
                          </span>
                        </button>
                        <span className="text-[9.5px] text-slate-400 font-medium">
                          {book.inStock ? 'Click to mark Out of Stock' : 'Click to mark In Stock'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                      {book.unitsSold}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                      {formatPrice(book.revenue)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/books`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-amber-600 text-xs font-bold p-1.5 rounded-lg hover:bg-slate-100 transition"
                        title="View on store"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
