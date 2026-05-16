"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function AdminDashboardClient({ initialOrders, initialMessages }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    if (status === "unauthenticated" || (session && session.user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading" || !session || session.user.role !== "ADMIN") {
    return <div className="container" style={{paddingTop: '180px'}}>Loading Admin Dashboard...</div>;
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(initialOrders.map(order => ({
      "Order ID": order.id,
      "Razorpay ID": order.razorpayOrderId || "N/A",
      "User ID": order.userId || "Guest",
      "Total (₹)": order.total,
      "Status": order.status,
      "Date": new Date(order.createdAt).toLocaleString()
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "Johari_MBBS_Orders.xlsx");
  };

  const handleMessageUpdate = async (id, newMessageBody) => {
    // In a real app, send a PUT request to /api/admin/messages here
    const updated = messages.map(m => m.id === id ? { ...m, messageBody: newMessageBody } : m);
    setMessages(updated);
    alert("Message updated successfully!");
  };

  return (
    <div className="container" style={{ paddingTop: '180px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Admin Dashboard</h2>
        <p>Welcome, {session.user.name}</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('orders')}>Orders Data</button>
        <button className={`btn ${activeTab === 'messages' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('messages')}>Marketing Messages</button>
      </div>

      {activeTab === 'orders' && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Recent Orders</h3>
            <button onClick={exportToExcel} className="btn btn-primary" style={{ background: '#217346' }}>
              Download Excel (.xlsx)
            </button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '1rem 0' }}>Date</th>
                <th>Order ID</th>
                <th>Razorpay ID</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {initialOrders.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '2rem 0', textAlign: 'center' }}>No orders found.</td></tr>
              ) : (
                initialOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem 0' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={{ fontSize: '0.8rem', color: 'gray' }}>{order.id}</td>
                    <td style={{ fontSize: '0.8rem', color: 'gray' }}>{order.razorpayOrderId || 'N/A'}</td>
                    <td style={{ fontWeight: 'bold' }}>₹{order.total}</td>
                    <td>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', background: order.status === 'SUCCESS' ? '#e6fffa' : '#fff5f5', color: order.status === 'SUCCESS' ? '#2c7a7b' : '#c53030' }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Event: {msg.triggerEvent.replace('_', ' ')}</h4>
              <p style={{ fontSize: '0.8rem', color: 'gray', marginBottom: '1rem' }}>Sent via: {msg.channel}</p>
              
              <textarea 
                value={msg.messageBody}
                onChange={(e) => {
                  const updated = messages.map(m => m.id === msg.id ? { ...m, messageBody: e.target.value } : m);
                  setMessages(updated);
                }}
                style={{ width: '100%', height: '100px', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem', fontFamily: 'inherit' }}
              />
              <button onClick={() => handleMessageUpdate(msg.id, msg.messageBody)} className="btn btn-outline" style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}>
                Save Template
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
