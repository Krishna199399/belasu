'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Laptop,
  Search,
  BookOpen,
  Eye,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  IndianRupee,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertTriangle,
  X,
  Layers,
  FileText,
  DollarSign,
  Shield,
  BookMarked,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { DigitalBook, DigitalBookChapter } from '@/types';
import toast from 'react-hot-toast';

interface DigitalProductWithStats extends DigitalBook {
  unitsSold?: number;
  revenue?: number;
}

const DEFAULT_CHAPTERS: DigitalBookChapter[] = [
  { chapter: 'Chapter 1: Introduction & Overview', startPage: 1 },
  { chapter: 'Chapter 2: Key Concepts & Summary', startPage: 15 },
  { chapter: 'Chapter 3: Solved Questions & Model Answers', startPage: 30 },
];

export default function AdminDigitalPage() {
  const [digitalList, setDigitalList] = useState<DigitalProductWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'content'>('basic');
  const [submitting, setSubmitting] = useState(false);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<DigitalProductWithStats | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<DigitalBook>>({
    title: '',
    slug: '',
    sku: '',
    subject: 'Kannada',
    gradeClass: 6,
    price: 199,
    originalPrice: 349,
    coverImage: '/digital-covers/kn-6.webp',
    totalPages: 150,
    isFreePreviewPages: 5,
    description: '',
    author: 'Belesu Academic Team',
    language: 'Kannada with English Translations',
    badge: '',
    features: [
      'Line-by-line English translation for every lesson',
      'Solved textbook exercises with step-by-step answers',
      'Secure web reader with full mobile & tablet support',
    ],
    tableOfContents: DEFAULT_CHAPTERS,
  });

  const fetchDigital = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/digital');
      const data = await res.json();
      if (data.success && data.books) {
        setDigitalList(data.books);
      }
    } catch (err) {
      console.error('Failed to load digital products:', err);
      toast.error('Failed to load digital books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDigital();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setActiveTab('basic');
    setFormData({
      title: '',
      slug: '',
      sku: '',
      subject: 'Kannada',
      gradeClass: 6,
      price: 199,
      originalPrice: 349,
      coverImage: '/digital-covers/kn-6.webp',
      totalPages: 150,
      isFreePreviewPages: 5,
      description: 'Comprehensive digital study guidebook designed for academic excellence.',
      author: 'Belesu Academic Team',
      language: 'Kannada with English Translations',
      badge: 'New Edition',
      features: [
        'Line-by-line English translation for every lesson',
        'Solved textbook exercises with step-by-step answers',
        'Secure web reader with full mobile & tablet support',
      ],
      tableOfContents: [
        { chapter: 'Chapter 1: Introduction & Notes', startPage: 1 },
        { chapter: 'Chapter 2: Core Lessons & Explanations', startPage: 15 },
        { chapter: 'Chapter 3: Question Bank & Exercise Solutions', startPage: 35 },
      ],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (book: DigitalProductWithStats) => {
    setModalMode('edit');
    setActiveTab('basic');
    setFormData({
      id: book.id,
      title: book.title,
      slug: book.slug,
      sku: book.sku,
      subject: book.subject,
      gradeClass: book.gradeClass,
      price: book.price,
      originalPrice: book.originalPrice,
      coverImage: book.coverImage,
      totalPages: book.totalPages,
      isFreePreviewPages: book.isFreePreviewPages,
      description: book.description,
      author: book.author,
      language: book.language,
      badge: book.badge || '',
      features: book.features && book.features.length > 0 ? book.features : ['Line-by-line English translation'],
      tableOfContents: book.tableOfContents && book.tableOfContents.length > 0 ? book.tableOfContents : DEFAULT_CHAPTERS,
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, title: val };
      if (modalMode === 'create' && (!prev.slug || prev.slug === '')) {
        updated.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      return updated;
    });
  };

  const handleChapterChange = (index: number, field: 'chapter' | 'startPage', value: any) => {
    setFormData((prev) => {
      const nextToc = [...(prev.tableOfContents || [])];
      nextToc[index] = {
        ...nextToc[index],
        [field]: field === 'startPage' ? Number(value) || 1 : value,
      };
      return { ...prev, tableOfContents: nextToc };
    });
  };

  const addChapterRow = () => {
    setFormData((prev) => {
      const nextToc = [...(prev.tableOfContents || [])];
      const lastPage = nextToc.length > 0 ? (nextToc[nextToc.length - 1].startPage + 15) : 1;
      nextToc.push({ chapter: `Chapter ${nextToc.length + 1}`, startPage: lastPage });
      return { ...prev, tableOfContents: nextToc };
    });
  };

  const removeChapterRow = (index: number) => {
    setFormData((prev) => {
      const nextToc = (prev.tableOfContents || []).filter((_, i) => i !== index);
      return { ...prev, tableOfContents: nextToc };
    });
  };

  const handleFeaturesChange = (text: string) => {
    const list = text.split('\n').filter((line) => line.trim().length > 0);
    setFormData((prev) => ({ ...prev, features: list }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subject || !formData.gradeClass || formData.price === undefined) {
      toast.error('Please fill in Title, Subject, Class and Price.');
      return;
    }

    try {
      setSubmitting(true);
      const url = '/api/admin/digital';
      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Operation failed');
      }

      toast.success(modalMode === 'create' ? 'Digital book added successfully!' : 'Digital book altered successfully!');
      setIsModalOpen(false);
      fetchDigital();
    } catch (err: any) {
      toast.error(err.message || 'Error saving digital book');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/digital?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete');
      }

      toast.success(`"${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      fetchDigital();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting book');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = digitalList.filter((b) => {
    const matchesSearch =
      searchTerm === '' ||
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || b.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'all' || b.gradeClass === Number(selectedGrade);
    return matchesSearch && matchesSubject && matchesGrade;
  });

  const totalSold = digitalList.reduce((sum, b) => sum + (b.unitsSold || 0), 0);
  const totalRev = digitalList.reduce((sum, b) => sum + (b.revenue || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Digital Reader Manager (Classes 6–10)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Create, alter, and delete digital study guidebooks • Configure reader DRM preview bounds and chapter indexes
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Digital Book
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Digital Titles
          </span>
          <span className="text-2xl font-black text-slate-900 tracking-tight mt-1 block">
            {digitalList.length} Active Editions
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Digital Readers Unlocked
          </span>
          <span className="text-2xl font-black text-amber-600 tracking-tight mt-1 block">
            {totalSold} copies purchased
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Digital Sales Revenue
          </span>
          <span className="text-2xl font-black text-emerald-600 tracking-tight mt-1 block">
            {formatPrice(totalRev)}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, SKU or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Subjects</option>
            <option value="Kannada">Kannada</option>
          </select>

          {/* Grade filter */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Classes (6–10)</option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
          </select>

          <button
            onClick={fetchDigital}
            title="Refresh List"
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Digital Catalog Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Loading digital titles...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No digital books match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Digital Title</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Subject & Class</th>
                  <th className="py-3.5 px-4 text-center">Pages</th>
                  <th className="py-3.5 px-4 text-center">Free Preview</th>
                  <th className="py-3.5 px-4 text-right">Price</th>
                  <th className="py-3.5 px-4 text-center">Unlocked</th>
                  <th className="py-3.5 px-4 text-right">Revenue</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((book) => {
                  return (
                    <tr key={book.id} className="hover:bg-slate-50/50 transition">
                      
                      {/* Title & Cover */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 bg-stone-100 rounded border border-slate-200 flex-shrink-0 flex items-center justify-center text-xl overflow-hidden">
                            📖
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate max-w-xs" title={book.title}>
                              {book.title}
                            </span>
                            <span className="text-[11px] text-slate-400 block font-mono">
                              Slug: /{book.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-700">
                        {book.sku}
                      </td>

                      {/* Subject & Class */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            {book.subject}
                          </span>
                          <span className="text-slate-600 font-semibold">Class {book.gradeClass}</span>
                        </div>
                      </td>

                      {/* Pages */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                        {book.totalPages} pp
                      </td>

                      {/* Free Preview */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {book.isFreePreviewPages} pages free
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-bold text-slate-900 block">{formatPrice(book.price)}</span>
                        {book.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through block">
                            {formatPrice(book.originalPrice)}
                          </span>
                        )}
                      </td>

                      {/* Units Sold */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                        {book.unitsSold || 0}
                      </td>

                      {/* Revenue */}
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                        {formatPrice(book.revenue || 0)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Test Reader */}
                          <Link
                            href={`/reader/${book.slug}?preview=true`}
                            target="_blank"
                            title="Preview in Reader"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {/* Alter / Edit */}
                          <button
                            onClick={() => openEditModal(book)}
                            title="Alter / Edit Details"
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteTarget(book)}
                            title="Delete Digital Book"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal: Add or Alter Digital Book ─────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-stone-50/60">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  {modalMode === 'create' ? 'Add New Digital Guidebook' : 'Alter Digital Guidebook'}
                </h3>
                <p className="text-xs text-slate-500">
                  {modalMode === 'create'
                    ? 'Fill in book parameters to register a new web reader title'
                    : `Editing ${formData.sku || formData.id}`}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Buttons */}
            <div className="flex border-b border-slate-100 bg-white px-6">
              <button
                onClick={() => setActiveTab('basic')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
                  activeTab === 'basic'
                    ? 'border-amber-500 text-amber-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. General Information
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
                  activeTab === 'pricing'
                    ? 'border-amber-500 text-amber-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Pricing & DRM Settings
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
                  activeTab === 'content'
                    ? 'border-amber-500 text-amber-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. Chapters & Features
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* TAB 1: BASIC INFORMATION */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Book Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kannada Class 8 — Complete English-Translated Digital Guidebook"
                      value={formData.title || ''}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Academic Subject *
                      </label>
                      <select
                        value={formData.subject || 'Kannada'}
                        onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value as any }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
                      >
                        <option value="Kannada">Kannada</option>
                      </select>
                    </div>

                    {/* Grade Class */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Grade / Class *
                      </label>
                      <select
                        value={formData.gradeClass || 6}
                        onChange={(e) => setFormData((prev) => ({ ...prev, gradeClass: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
                      >
                        <option value={6}>Class 6</option>
                        <option value={7}>Class 7</option>
                        <option value={8}>Class 8</option>
                        <option value={9}>Class 9</option>
                        <option value={10}>Class 10</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Slug */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. kannada-class-8-guide"
                        value={formData.slug || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Accessible at /digital/{formData.slug || '...'}
                      </span>
                    </div>

                    {/* SKU */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Inventory SKU
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SD8-KN"
                        value={formData.sku || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
                      />
                    </div>
                  </div>

                  {/* Badge & Language */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Catalog Badge (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bestseller, New Edition"
                        value={formData.badge || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Author / Team
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Belesu Academic Team"
                        value={formData.author || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & DRM SETTINGS */}
              {activeTab === 'pricing' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Selling Price */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Selling Price (₹ INR) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          required
                          min={0}
                          value={formData.price ?? 199}
                          onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                          className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
                        />
                      </div>
                    </div>

                    {/* Original Price */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Original Price / MRP (₹ INR)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          min={0}
                          placeholder="Optional strikethrough price"
                          value={formData.originalPrice ?? ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, originalPrice: e.target.value ? Number(e.target.value) : undefined }))}
                          className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Total Pages */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Total Document Pages *
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={formData.totalPages ?? 100}
                        onChange={(e) => setFormData((prev) => ({ ...prev, totalPages: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Reader upper page boundary
                      </span>
                    </div>

                    {/* Free Preview Pages */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Free Preview Pages *
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={formData.totalPages || 50}
                        value={formData.isFreePreviewPages ?? 5}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isFreePreviewPages: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Pages readable without payment (DRM locked thereafter)
                      </span>
                    </div>
                  </div>

                  {/* Cover Image URL */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cover Image Path / URL
                    </label>
                    <input
                      type="text"
                      placeholder="/digital-covers/kn-6.webp"
                      value={formData.coverImage || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, coverImage: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: CONTENT & CHAPTER BUILDER */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Curriculum Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Detailed pedagogical description of this guidebook..."
                      value={formData.description || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
                    />
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Highlight Features (One per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Line-by-line English translation&#10;Solved textbook exercises"
                      value={(formData.features || []).join('\n')}
                      onChange={(e) => handleFeaturesChange(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
                    />
                  </div>

                  {/* Chapter Builder */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <BookMarked className="w-3.5 h-3.5 text-amber-600" />
                        Table of Contents Chapters ({formData.tableOfContents?.length || 0})
                      </label>
                      <button
                        type="button"
                        onClick={addChapterRow}
                        className="text-[11px] font-bold text-amber-700 hover:text-amber-800 transition cursor-pointer"
                      >
                        + Add Chapter
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {(formData.tableOfContents || []).map((ch, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                          <span className="text-xs font-bold text-slate-400 w-5 text-center">{idx + 1}</span>
                          <input
                            type="text"
                            placeholder="Chapter title"
                            value={ch.chapter}
                            onChange={(e) => handleChapterChange(idx, 'chapter', e.target.value)}
                            className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden"
                          />
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] text-slate-400">p.</span>
                            <input
                              type="number"
                              min={1}
                              value={ch.startPage}
                              onChange={(e) => handleChapterChange(idx, 'startPage', e.target.value)}
                              className="w-16 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeChapterRow(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : modalMode === 'create' ? 'Create Digital Book' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── Dialog: Confirm Delete ────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Delete Digital Book?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove <strong className="text-slate-800">{deleteTarget.title}</strong> ({deleteTarget.sku})? This will deactivate the book from the student storefront and web reader.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
