'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Printer,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  ExternalLink,
  MessageCircle,
  CreditCard,
  Package,
  Save,
  Check,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  id: string;
  item_name: string;
  item_sku?: string;
  item_type: string;
  quantity: number;
  item_cost: number;
  item_total: number;
}

interface OrderData {
  id: string;
  order_number: string;
  created_at: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  order_subtotal_amount: number;
  order_shipping_amount: number;
  order_total_amount: number;
  has_physical_books: boolean;
  has_digital_books: boolean;
  shipping_method?: string;
  billing_first_name: string;
  billing_last_name: string;
  billing_phone: string;
  billing_email?: string;
  billing_address1?: string;
  billing_address2?: string;
  billing_city: string;
  billing_state?: string;
  billing_postcode?: string;
  shipping_first_name?: string;
  shipping_last_name?: string;
  shipping_phone?: string;
  shipping_address1?: string;
  shipping_address2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postcode?: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  order_items: OrderItem[];
  customer?: {
    id: string;
    name: string;
    phone: string;
    email?: string;
  };
}

export const OrderDetailClient: React.FC<{ initialOrder: OrderData }> = ({
  initialOrder,
}) => {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData>(initialOrder);
  const [orderStatus, setOrderStatus] = useState(initialOrder.order_status);
  const [paymentStatus, setPaymentStatus] = useState(initialOrder.payment_status);
  const [shippingMethod, setShippingMethod] = useState(
    initialOrder.shipping_method || ''
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleUpdate = async (customUpdates?: {
    order_status?: string;
    payment_status?: string;
    shipping_method?: string;
  }) => {
    setIsUpdating(true);
    const body = customUpdates || {
      order_status: orderStatus,
      payment_status: paymentStatus,
      shipping_method: shippingMethod,
    };

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        if (body.order_status) setOrderStatus(body.order_status);
        if (body.payment_status) setPaymentStatus(body.payment_status);
        if (body.shipping_method !== undefined) setShippingMethod(body.shipping_method);
        toast.success('Order fulfillment updated successfully');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to update order');
      }
    } catch {
      toast.error('Network error updating order');
    } finally {
      setIsUpdating(false);
    }
  };

  const shippingName =
    `${order.shipping_first_name || order.billing_first_name} ${
      order.shipping_last_name || order.billing_last_name || ''
    }`.trim();
  const shippingAddress1 =
    order.shipping_address1 || order.billing_address1 || '';
  const shippingAddress2 =
    order.shipping_address2 || order.billing_address2 || '';
  const shippingCity = order.shipping_city || order.billing_city || '';
  const shippingState = order.shipping_state || order.billing_state || '';
  const shippingPostcode =
    order.shipping_postcode || order.billing_postcode || '';
  const shippingPhone = order.shipping_phone || order.billing_phone || '';

  const fullShippingText = `Recipient: ${shippingName}\nPhone: ${shippingPhone}\nAddress: ${shippingAddress1}${
    shippingAddress2 ? `, ${shippingAddress2}` : ''
  }\nCity: ${shippingCity}, ${shippingState} - ${shippingPostcode}`;

  const copyAddress = () => {
    navigator.clipboard.writeText(fullShippingText);
    setCopiedAddress(true);
    toast.success('Address copied for courier label');
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const cleanPhone = order.billing_phone.replace(/^\+91/, '').trim();
  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(
    order.billing_first_name
  )},%20this%20is%20Belesu%20Support%20regarding%20your%20order%20${
    order.order_number
  }.`;

  return (
    <div className="space-y-6">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
                {order.order_number}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  order.payment_status === 'Paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.payment_status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Placed on {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Quick Status Workflow Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1">Quick Action:</span>
            <button
              onClick={() => handleUpdate({ order_status: 'Processing' })}
              disabled={isUpdating || orderStatus === 'Processing'}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition disabled:opacity-50"
            >
              Set to Processing
            </button>
            <button
              onClick={() => handleUpdate({ order_status: 'Shipped' })}
              disabled={isUpdating || orderStatus === 'Shipped'}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition disabled:opacity-50"
            >
              Set to Shipped
            </button>
            <button
              onClick={() => handleUpdate({ order_status: 'Delivered' })}
              disabled={isUpdating || orderStatus === 'Delivered'}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-50"
            >
              Set to Delivered
            </button>
            <button
              onClick={() => handleUpdate({ order_status: 'Completed' })}
              disabled={isUpdating || orderStatus === 'Completed'}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-50"
            >
              Mark Completed
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
            >
              <option value="Pending">Status: Pending</option>
              <option value="Processing">Status: Processing</option>
              <option value="Shipped">Status: Shipped</option>
              <option value="Delivered">Status: Delivered</option>
              <option value="Completed">Status: Completed</option>
              <option value="Cancelled">Status: Cancelled</option>
              <option value="Refunded">Status: Refunded</option>
            </select>

            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
            >
              <option value="Pending">Payment: Pending</option>
              <option value="Paid">Payment: Paid</option>
              <option value="Failed">Payment: Failed</option>
              <option value="Refunded">Payment: Refunded</option>
            </select>

            <button
              onClick={() => handleUpdate()}
              disabled={isUpdating}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isUpdating ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Order Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Items & Shipping Tracking */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-base">Order Items</h3>
                <p className="text-xs text-slate-500">
                  {order.order_items.length} items ordered
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {order.has_physical_books && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    Hard Copy Books
                  </span>
                )}
                {order.has_digital_books && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                    Digital Books
                  </span>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Price</th>
                    <th className="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.order_items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">
                        {item.item_name}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {item.item_sku || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            item.item_type === 'digital'
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {item.item_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-600">
                        {formatPrice(item.item_cost)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {formatPrice(item.item_total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Totals */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">
                  {formatPrice(order.order_subtotal_amount)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Shipping Fee</span>
                <span className="font-semibold text-slate-800">
                  {order.order_shipping_amount > 0
                    ? formatPrice(order.order_shipping_amount)
                    : 'FREE'}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>Grand Total</span>
                <span className="text-amber-700 text-base">
                  {formatPrice(order.order_total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Courier & Shipping Tracking Updater */}
          {order.has_physical_books && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-slate-900 text-base">
                  Courier Tracking & Shipping Notes
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Enter shipping method, courier partner name (e.g. India Post, DTDC, Delhivery), and tracking number.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="e.g. DTDC - Tracking ID # D12345678"
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500 transition"
                />
                <button
                  onClick={() => handleUpdate({ shipping_method: shippingMethod })}
                  disabled={isUpdating}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50 whitespace-nowrap"
                >
                  Save Tracking Info
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Customer & Shipping Address */}
        <div className="space-y-6">
          {/* Customer Info Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-black text-slate-900 text-base">Customer Details</h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold">Name</span>
                <span className="font-bold text-slate-900 text-sm">{shippingName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold">Phone Number</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-bold text-slate-900">{order.billing_phone}</span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                    title="Send WhatsApp message"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
              {order.billing_email && (
                <div>
                  <span className="text-slate-400 block text-[11px] font-semibold">Email</span>
                  <span className="font-medium text-slate-700">{order.billing_email}</span>
                </div>
              )}
              {order.customer && (
                <div className="pt-2 border-t border-slate-100">
                  <Link
                    href={`/admin/users/${order.customer.id}`}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <span>View Customer Profile & Permissions</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base">Delivery Address</h3>
              <button
                onClick={copyAddress}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition"
              >
                {copiedAddress ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Label</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1 text-slate-700 font-medium leading-relaxed">
              <p className="font-bold text-slate-900">{shippingName}</p>
              <p>{shippingAddress1}</p>
              {shippingAddress2 && <p>{shippingAddress2}</p>}
              <p>
                {shippingCity}
                {shippingState ? `, ${shippingState}` : ''} -{' '}
                <span className="font-bold font-mono text-slate-900">{shippingPostcode}</span>
              </p>
              <p className="font-mono text-slate-600 pt-1">📞 {shippingPhone}</p>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="font-black text-slate-900 text-base">Payment Details</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="font-bold text-slate-900">{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <span
                  className={`font-bold ${
                    order.payment_status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {order.payment_status}
                </span>
              </div>
              {order.razorpay_payment_id && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                    Razorpay Payment ID
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800 break-all">
                    {order.razorpay_payment_id}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
