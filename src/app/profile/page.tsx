'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';
import AddressManager from '@/components/address/AddressManager';
import { User, Package, MapPin, BookOpen, Mail, Phone, Settings, Loader, ShoppingBag, Calendar, CreditCard } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

type TabType = 'orders' | 'addresses' | 'profile' | 'library';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>(
    (searchParams.get('tab') as TabType) || 'orders'
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    emailOptIn: true,
    smsOptIn: true,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        emailOptIn: user.emailOptIn ?? true,
        smsOptIn: user.smsOptIn ?? true,
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]); // run once when user is available

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setTotalSpent(data.totalSpent || 0);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile(profileData);
    if (success) {
      setIsEditingProfile(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12 pb-24 sm:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shrink-0">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 truncate">{user.name || 'User'}</h1>
                <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 shrink-0" />
                  <span className="font-mono">{user.phone}</span>
                </p>
                {user.email && (
                  <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5 mt-1 truncate">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="min-h-[40px] px-3.5 py-1.5 text-xs sm:text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100 sm:bg-transparent sm:border-0 sm:p-0">
              <div className="text-xl sm:text-2xl font-bold text-orange-600">{orders.length}</div>
              <div className="text-[11px] sm:text-xs text-gray-600 mt-0.5">Orders</div>
            </div>
            <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100 sm:bg-transparent sm:border-0 sm:p-0">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {(user.purchasedBooks?.physical?.length || 0) + (user.purchasedBooks?.digital?.length || 0)}
              </div>
              <div className="text-[11px] sm:text-xs text-gray-600 mt-0.5">Books Owned</div>
            </div>
            <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100 sm:bg-transparent sm:border-0 sm:p-0">
              <div className="text-xl sm:text-2xl font-bold text-green-600">{user.addresses?.length || 0}</div>
              <div className="text-[11px] sm:text-xs text-gray-600 mt-0.5">Saved Addresses</div>
            </div>
            <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100 sm:bg-transparent sm:border-0 sm:p-0">
              <div className="text-xl sm:text-2xl font-bold text-purple-600">{formatPrice(totalSpent)}</div>
              <div className="text-[11px] sm:text-xs text-gray-600 mt-0.5">Total Spent</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex flex-nowrap overflow-x-auto overflow-y-hidden -mb-px px-2 sm:px-0">
              {[
                { id: 'orders', label: 'Order History', icon: Package },
                { id: 'addresses', label: 'Addresses', icon: MapPin },
                { id: 'library', label: 'My Library', icon: BookOpen },
                { id: 'profile', label: 'Profile Settings', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`min-h-[44px] flex items-center gap-2 px-4 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors shrink-0 whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Order History</h2>
                
                {isLoadingOrders ? (
                  <div className="text-center py-12">
                    <Loader className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
                    <p className="text-gray-600 text-sm">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-6">
                    <ShoppingBag className="w-14 h-14 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-6">Start shopping to see your order history here.</p>
                    <Link
                      href="/books"
                      className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-xs sm:text-sm font-bold"
                    >
                      Browse Books
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:border-orange-300 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                              <h3 className="font-bold text-gray-900 text-sm sm:text-base">Order #{order.orderNumber}</h3>
                              <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-semibold rounded-full ${
                                order.orderStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                                order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                order.orderStatus === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                                order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {order.orderStatus}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(order.orderDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <CreditCard className="w-4 h-4" />
                                {order.paymentMethodTitle}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-orange-600">
                              {formatPrice(order.orderTotalAmount)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 space-y-2">
                          {order.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                  item.productType === 'physical' 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : 'bg-green-100 text-green-700'
                                }`}>
                                  {item.productType === 'physical' ? 'Hard Copy' : 'Digital'}
                                </span>
                                <span className="text-gray-700">{item.quantity}x {item.itemName}</span>
                              </div>
                              <span className="font-semibold text-gray-900">
                                {formatPrice(item.itemCost * item.quantity)}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-xs text-gray-500">
                              +{order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>

                        {order.hasPhysicalProducts && order.shipping && (
                          <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                            <p className="font-semibold text-gray-700 mb-1">Shipping Address:</p>
                            <p>{order.shipping.firstName} {order.shipping.lastName}</p>
                            <p>{order.shipping.address1}</p>
                            {order.shipping.address2 && <p>{order.shipping.address2}</p>}
                            <p>{order.shipping.city}, {order.shipping.state} - {order.shipping.postcode}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <AddressManager mode="manage" />
              </div>
            )}

            {/* Library Tab */}
            {activeTab === 'library' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">My Digital Library</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Digital Books</h3>
                  <p className="text-blue-800 mb-4">
                    You have {user.purchasedBooks?.digital?.length || 0} digital book{user.purchasedBooks?.digital?.length !== 1 ? 's' : ''} in your library.
                  </p>
                  <Link
                    href="/library"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <BookOpen className="w-5 h-5" />
                    Go to Full Library
                  </Link>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-2xl">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone (Cannot be changed)
                      </label>
                      <input
                        type="tel"
                        value={user.phone}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>

                    <div className="space-y-3 py-4">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={profileData.emailOptIn}
                          onChange={(e) => setProfileData({ ...profileData, emailOptIn: e.target.checked })}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">
                          Send me email updates about new books and offers
                        </span>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={profileData.smsOptIn}
                          onChange={(e) => setProfileData({ ...profileData, smsOptIn: e.target.checked })}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">
                          Send me SMS notifications about order status
                        </span>
                      </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 max-w-2xl">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Name</div>
                      <div className="font-semibold text-gray-900">{user.name || 'Not set'}</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Email</div>
                      <div className="font-semibold text-gray-900">{user.email || 'Not set'}</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Phone</div>
                      <div className="font-semibold text-gray-900">{user.phone}</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-2">Preferences</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`w-2 h-2 rounded-full ${user.emailOptIn ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-gray-900">Email notifications: {user.emailOptIn ? 'Enabled' : 'Disabled'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`w-2 h-2 rounded-full ${user.smsOptIn ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-gray-900">SMS notifications: {user.smsOptIn ? 'Enabled' : 'Disabled'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
