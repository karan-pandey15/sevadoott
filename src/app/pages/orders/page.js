"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ShoppingCart, 
  AlertTriangle,
  Loader2
} from 'lucide-react';
import io from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '@/lib/api';

const API_URL = API_BASE;

const YourOrders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    setIsAuthenticated(!!token);
    if (!token) {
      setLoading(false);
    }
  }, []);

  const fetchOrders = async (socketId = null) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const url = socketId
        ? `${API_URL}/orders?socketId=${socketId}`
        : `${API_URL}/orders`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (res.ok && data.ok && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.log('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;
    try {
      setCancelling(true);
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/orders/${selectedOrderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Cancelled' }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            (order._id === selectedOrderId || order.orderId === selectedOrderId) ? { ...order, status: 'Cancelled' } : order
          )
        );
        setCancelModalVisible(false);
        toast.success('Order Cancelled Successfully');
      } else {
        setCancelModalVisible(false);
        toast.error(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      setCancelModalVisible(false);
      toast.error(error.message || 'Something went wrong while cancelling the order');
    } finally {
      setCancelling(false);
    }
  };

  useEffect(() => {
    const initSocket = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) return;

      const socket = io(API_URL, {
        transports: ['websocket'],
        auth: { token },
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        setSocketConnected(true);
        fetchOrders(socket.id);
      });

      socket.on('disconnect', () => {
        setSocketConnected(false);
      });

      socket.on('orders:new', (newOrder) => {
        setOrders((prev) => {
          const exists = prev.some(o => o.orderId === newOrder.orderId);
          return exists ? prev : [newOrder, ...prev];
        });
      });

      socket.on('orders:status', (update) => {
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === update.orderId
              ? {
                  ...order,
                  status: update.status,
                  payment: {
                    ...order.payment,
                    status: update.paymentStatus,
                  },
                }
              : order
          )
        );
      });
    };

    initSocket();
    return () => socketRef.current?.disconnect();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).replace(',', '');
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle size={18} className="text-[#00A86B]" />;
      case 'cancelled':
        return <XCircle size={18} className="text-gray-400" />;
      default:
        return <Clock size={18} className="text-[#FFB300]" />;
    }
  };

  const renderOrderCard = (order) => {
    const isPending = order.status?.toLowerCase() === 'pending';
    
    return (
      <div 
        key={order._id || order.orderId}
        className="bg-white border border-gray-100 rounded-2xl p-4 mb-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => router.push(`/pages/orders/${order._id || order.orderId}`)}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-black capitalize">
              Order {order.status?.toLowerCase() || 'pending'}
            </span>
            {getStatusIcon(order.status)}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-base font-bold text-black">₹{order.pricing?.grandTotal}</span>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Placed at {formatDate(order.createdAt)}
        </p>

        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          {order.items?.slice(0, 4).map((item, idx) => (
            <div key={idx} className="relative min-w-[60px] h-[60px] border border-gray-50 rounded-xl p-1 bg-white">
              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
              {item.quantity > 1 && (
                <span className="absolute -top-1 -right-1 bg-purple-700 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              )}
            </div>
          ))}
          {order.items?.length > 4 && (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
              +{order.items.length - 4}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-50 flex justify-center">
          {isPending ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOrderId(order._id || order.orderId);
                setCancelModalVisible(true);
              }}
              className="text-[#FF4D4D] font-bold text-sm w-full py-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              Cancel Order
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (order.items?.[0]?.productId) {
                  router.push(`/product/${order.items[0].productId}`);
                }
              }}
              className="text-[#ff3162] font-bold text-sm w-full py-2 hover:bg-pink-50 rounded-lg transition-colors"
            >
              Order Again
            </button>
          )}
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <div className="flex items-center px-4 py-4 border-b border-gray-100 sticky top-0 bg-white z-20">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-black" />
          </button>
          <h1 className="text-xl font-bold text-black ml-4 flex-1">Your Orders</h1>
        </div>
        <div className="flex flex-col items-center justify-center h-[70vh] p-8 text-center">
          <ShoppingCart size={80} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-500 text-center mb-6">Please login to view your orders</p>
          <button 
            onClick={() => window.location.href = "/"}
            className="bg-[#ff3162] text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100 sticky top-0 bg-white z-20">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-black" />
        </button>
        <h1 className="text-xl font-bold text-black ml-4 flex-1">Your Orders</h1>
        <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-[#00A86B]' : 'bg-[#FF4D4D]'}`} title={socketConnected ? 'Real-time connected' : 'Real-time disconnected'} />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Loader2 size={40} className="text-[#ff3162] animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh] p-8 text-center">
          <ShoppingCart size={80} className="text-gray-200 mb-4" />
          <p className="text-gray-500 mb-6">No orders found</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-[#ff3162] text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="p-4 max-w-2xl mx-auto">
          {orders.map(renderOrderCard)}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancelModalVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelModalVisible(false)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[32px] p-8 flex flex-col items-center text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle size={40} className="text-[#FF4D4D]" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">Cancel Order?</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setCancelModalVisible(false)}
                  className="flex-1 py-4 border border-gray-100 rounded-2xl font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="flex-1 py-4 bg-[#FF4D4D] text-white rounded-2xl font-bold flex items-center justify-center transition-all hover:bg-opacity-90 active:scale-95 disabled:opacity-50"
                >
                  {cancelling ? <Loader2 size={20} className="animate-spin" /> : 'Yes, Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default YourOrders;
