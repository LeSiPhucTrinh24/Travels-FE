import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const PaymentResult = () => {
  const [result, setResult] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchResult = async () => {
      const queryParams = new URLSearchParams(location.search);
      const params = {};
      queryParams.forEach((value, key) => {
        params[key] = value;
      });

      try {
        const response = await axios.get("http://localhost:8080/api/payment/vnpay/return", {
          params: params,
        });
        setResult(response.data);
      } catch (error) {
        console.error("Lỗi khi xử lý kết quả thanh toán:", error);
        setResult({ status: "failed", message: "Lỗi xử lý kết quả" });
      }
    };
    fetchResult();
  }, [location]);

  if (!result) {
    return <div className="p-6">Đang xử lý kết quả thanh toán...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Kết Quả Thanh Toán</h2>
      <p className="text-lg">
        <strong>Trạng thái:</strong> {result.status === "success" ? "Thành công" : "Thất bại"}
      </p>
      <p className="text-lg">
        <strong>Thông điệp:</strong> {result.message}
      </p>
      {result.status === "success" && (
        <>
          <p className="text-lg">
            <strong>Mã thanh toán:</strong> {result.paymentId}
          </p>
          <p className="text-lg">
            <strong>Số tiền:</strong> {parseInt(result.amount) / 100} VND
          </p>
          <p className="text-lg">
            <strong>Mã giao dịch:</strong> {result.transactionId}
          </p>
        </>
      )}
    </div>
  );
};

export default PaymentResult;
