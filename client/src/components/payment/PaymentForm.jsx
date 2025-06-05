import React, { useState } from "react";
import axios from "axios";

const PaymentForm = () => {
  const [amount, setAmount] = useState("");
  const [orderInfo, setOrderInfo] = useState("Thanh toan don hang");
  const [paymentId] = useState("PAY_" + new Date().getTime()); // Tạo paymentId ngẫu nhiên
  const [bookingId] = useState("BOOK_" + new Date().getTime()); // Tạo bookingId ngẫu nhiên

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/payment/vnpay/create", {
        amount: parseFloat(amount),
        orderInfo: orderInfo,
        paymentId: paymentId,
        bookingId: bookingId,
        ipAddr: "127.0.0.1",
      });
      window.location.href = response.data.paymentUrl;
    } catch (error) {
      console.error("Lỗi khi tạo URL thanh toán:", error);
      alert("Không thể tạo URL thanh toán");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Thanh Toán VNPAY</h2>
      <form onSubmit={handlePayment} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium">Số tiền (VND)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Mô tả đơn hàng</label>
          <input type="text" value={orderInfo} onChange={(e) => setOrderInfo(e.target.value)} className="w-full p-2 border rounded" required />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Thanh Toán Qua VNPAY
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
