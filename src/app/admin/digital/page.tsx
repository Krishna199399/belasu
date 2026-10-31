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
  FileUp,
  Upload,
  Loader2,
  Check,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { DigitalBook, DigitalBookChapter } from '@/types';
import toast from 'react-hot-toast';

interface DigitalProductWithStats extends DigitalBook {
  unitsSold?: number;
  revenue?: number;
}

const DEFAULT_CHAPTERS: DigitalBookChapter[] = [];

export default function AdminDigitalPage() {
  const [digitalList, setDigitalList] = useState<DigitalProductWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'content' | 'pdf'>('basic');
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
    price: 295,
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
      const res = await fetch('/api/admin/digital', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.books)) {
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

  // PDF Upload & DRM Conversion States
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPageCount, setPdfPageCount] = useState<number | null>(null);
  const [isConvertingPdf, setIsConvertingPdf] = useState(false);
  const [conversionProgress, setConversionProgress] = useState<{
    current: number;
    total: number;
    percent: number;
    thumbnailUrl?: string;
  } | null>(null);
  const [uploadedStorageCount, setUploadedStorageCount] = useState<number | null>(null);
  const [loadingStorageCount, setLoadingStorageCount] = useState(false);

  const fetchStorageCount = async (id?: string) => {
    const bookId = id || formData.id;
    if (!bookId) return;
    try {
      setLoadingStorageCount(true);
      const res = await fetch(`/api/admin/digital/upload-page?bookId=${encodeURIComponent(bookId)}`);
      const data = await res.json();
      if (data.success && typeof data.uploadedCount === 'number') {
        setUploadedStorageCount(data.uploadedCount);
      }
    } catch (err) {
      console.warn('Could not load storage count:', err);
    } finally {
      setLoadingStorageCount(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'pdf' && formData.id) {
      fetchStorageCount(formData.id);
    }
  }, [activeTab, formData.id]);

  const loadPdfJs = async (): Promise<any> => {
    if ((window as any).pdfjsLib) {
      return (window as any).pdfjsLib;
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        const lib = (window as any).pdfjsLib;
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(lib);
      };
      script.onerror = () => reject(new Error('Failed to load PDF processing engine'));
      document.body.appendChild(script);
    });
  };

  const handlePdfSelected = async (file: File) => {
    setPdfFile(file);
    try {
      toast.loading('Analyzing PDF pages...', { id: 'pdf-load' });
      const pdfjs = await loadPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      setPdfPageCount(pdf.numPages);
      toast.success(`PDF loaded: ${pdf.numPages} pages detected!`, { id: 'pdf-load' });
    } catch (err: any) {
      console.error('Error loading PDF:', err);
      toast.error('Failed to parse PDF file. Ensure it is a valid PDF.', { id: 'pdf-load' });
    }
  };

  const handleStartPdfConversion = async () => {
    const bookId = formData.id;
    if (!bookId) {
      toast.error('Please save the book details first so an ID is registered.');
      return;
    }
    if (!pdfFile) {
      toast.error('Please select a PDF file first.');
      return;
    }

    try {
      setIsConvertingPdf(true);
      const pdfjs = await loadPdfJs();
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const total = pdf.numPages;

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        await page.render({ canvasContext: ctx, viewport }).promise;

        const thumbnail = canvas.toDataURL('image/jpeg', 0.4);
        const blob = await new Promise<Blob>((res) =>
          canvas.toBlob((b) => res(b!), 'image/webp', 0.85)
        );

        const fd = new FormData();
        fd.append('bookId', bookId);
        fd.append('page', String(i));
        if (i === total) fd.append('totalPages', String(total));
        fd.append('image', blob, `page-${String(i).padStart(3, '0')}.webp`);

        const uploadRes = await fetch('/api/admin/digital/upload-page', {
          method: 'POST',
          body: fd,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(`Failed uploading page ${i}: ${errData.error || 'Server error'}`);
        }

        setConversionProgress({
          current: i,
          total,
          percent: Math.round((i / total) * 100),
          thumbnailUrl: thumbnail,
        });
      }

      toast.success(`🎉 All ${total} pages converted and uploaded to Secure Reader!`);
      setFormData((prev) => ({ ...prev, totalPages: total }));
      fetchStorageCount(bookId);
      fetchDigital();
    } catch (err: any) {
      console.error('PDF conversion error:', err);
      toast.error(err.message || 'Error converting PDF');
    } finally {
      setIsConvertingPdf(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setActiveTab('basic');
    setFormData({
      title: '',
      slug: '',
      sku: '',
      subject: 'Kannada',
      gradeClass: 6,
      price: 295,
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
      tableOfContents: [],
    });
    setPdfFile(null);
    setPdfPageCount(null);
    setConversionProgress(null);
    setUploadedStorageCount(null);
    setIsModalOpen(true);
  };

  const openEditModal = (book: DigitalProductWithStats) => {
    setModalMode('edit');
    setActiveTab('basic');
    setPdfFile(null);
    setPdfPageCount(null);
    setConversionProgress(null);
    setUploadedStorageCount(null);
    fetchStorageCount(book.id);
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
      tableOfContents: [],
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
                type="button"
                onClick={() => setActiveTab('content')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
                  activeTab === 'content'
                    ? 'border-amber-500 text-amber-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. Description & Features
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pdf')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'pdf'
                    ? 'border-amber-500 text-amber-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileUp className="w-3.5 h-3.5" /> 4. PDF & Reader Pages
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
                </div>
              )}

              {/* TAB 4: PDF & READER PAGES */}
              {activeTab === 'pdf' && (
                <div className="space-y-5">
                  {/* DRM Storage Status Banner */}
                  <div className="p-4 rounded-xl border bg-slate-50 border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">📁</span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">DRM Storage Status</h4>
                          <p className="text-[11px] text-slate-500 font-mono">
                            belesu-book-pages/{formData.id || 'new-book'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {loadingStorageCount ? (
                          <span className="text-xs text-slate-400 animate-pulse">Checking storage...</span>
                        ) : uploadedStorageCount !== null && uploadedStorageCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2.5 py-1 rounded-full">
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> {uploadedStorageCount} pages active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100/70 border border-amber-300 px-2.5 py-1 rounded-full">
                            0 pages (Demo Mode)
                          </span>
                        )}
                      </div>
                    </div>

                    {formData.slug && uploadedStorageCount !== null && uploadedStorageCount > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
                        <span className="text-slate-600">Want to test how readers see this book?</span>
                        <Link
                          href={`/reader/${formData.slug}?preview=true`}
                          target="_blank"
                          className="inline-flex items-center gap-1 font-bold text-amber-700 hover:text-amber-800"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview in Web Reader &rarr;
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* PDF Upload Card */}
                  <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-4 hover:border-amber-400 transition">
                    <input
                      type="file"
                      id="pdf-upload-input"
                      accept="application/pdf"
                      disabled={isConvertingPdf}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePdfSelected(file);
                      }}
                      className="hidden"
                    />

                    {!pdfFile ? (
                      <label htmlFor="pdf-upload-input" className="cursor-pointer block space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
                          <FileUp className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-800 block">
                            Click to select or drop Book PDF
                          </span>
                          <span className="text-xs text-slate-400 block mt-0.5">
                            Standard PDF format (.pdf) • Automatically renders each page to DRM WebP
                          </span>
                        </div>
                      </label>
                    ) : (
                      <div className="space-y-4 text-left">
                        <div className="flex items-center justify-between bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">📄</span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{pdfFile.name}</p>
                              <p className="text-[11px] text-slate-500">
                                {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB • {pdfPageCount ? `${pdfPageCount} pages detected` : 'Parsing pages...'}
                              </p>
                            </div>
                          </div>
                          {!isConvertingPdf && (
                            <button
                              type="button"
                              onClick={() => {
                                setPdfFile(null);
                                setPdfPageCount(null);
                                setConversionProgress(null);
                              }}
                              className="text-xs font-semibold text-slate-400 hover:text-rose-600 cursor-pointer"
                            >
                              Change file
                            </button>
                          )}
                        </div>

                        {/* Progress Bar & Preview */}
                        {isConvertingPdf && conversionProgress && (
                          <div className="space-y-3 bg-amber-50/50 border border-amber-200 rounded-xl p-4">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                                Processing & Uploading: Page {conversionProgress.current} of {conversionProgress.total}
                              </span>
                              <span className="font-mono font-bold text-amber-900">{conversionProgress.percent}%</span>
                            </div>

                            <div className="w-full bg-amber-200/60 rounded-full h-2.5 overflow-hidden">
                              <div
                                className="bg-amber-600 h-2.5 rounded-full transition-all duration-200"
                                style={{ width: `${conversionProgress.percent}%` }}
                              />
                            </div>

                            {conversionProgress.thumbnailUrl && (
                              <div className="flex items-center gap-3 pt-1">
                                <div className="w-14 h-18 bg-white border border-amber-200 rounded shadow-xs overflow-hidden flex-shrink-0">
                                  <img
                                    src={conversionProgress.thumbnailUrl}
                                    alt="Live Page Preview"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="text-[11px] text-slate-600">
                                  <p className="font-semibold text-slate-800">DRM Conversion Active</p>
                                  <p className="text-slate-500">Rendering vector PDF to signed WebP images with watermark security.</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Start Button */}
                        {!isConvertingPdf && pdfPageCount && (
                          <button
                            type="button"
                            onClick={handleStartPdfConversion}
                            className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Upload className="w-4 h-4" /> Convert & Upload {pdfPageCount} Pages to Secure Reader
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Security Note */}
                  <div className="flex items-start gap-2.5 text-xs text-slate-500 bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
                    <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Why are pages converted to WebP images instead of raw PDF?</strong>
                      <p className="mt-0.5 leading-relaxed">
                        Raw PDFs can be downloaded and pirated in 1 click by anyone with browser DevTools. By rendering individual WebP page images, Belesu applies dynamic user watermarking, single-page signed URLs, and copy-protection DRM.
                      </p>
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
