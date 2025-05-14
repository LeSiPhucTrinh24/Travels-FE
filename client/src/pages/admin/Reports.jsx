import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Download, Filter, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const Reports = () => {
  const [reportType, setReportType] = useState("revenue");
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 4, 1),
    to: new Date(2025, 4, 15),
  });

  // Mock data for revenue report
  const revenueData = [
    { date: "01/05", revenue: 15000000, bookings: 5 },
    { date: "02/05", revenue: 18000000, bookings: 6 },
    { date: "03/05", revenue: 12000000, bookings: 4 },
    { date: "04/05", revenue: 25000000, bookings: 8 },
    { date: "05/05", revenue: 22000000, bookings: 7 },
    { date: "06/05", revenue: 20000000, bookings: 6 },
    { date: "07/05", revenue: 28000000, bookings: 9 },
  ];

  // Mock data for popular tours
  const popularToursData = [
    { name: "Vịnh Hạ Long", bookings: 45 },
    { name: "Đà Nẵng - Hội An", bookings: 38 },
    { name: "Phú Quốc", bookings: 32 },
    { name: "Đà Lạt", bookings: 28 },
    { name: "Sapa", bookings: 25 },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Báo cáo thống kê</h1>

        <div className="flex items-center gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn loại báo cáo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Doanh thu</SelectItem>
              <SelectItem value="popular">Tour phổ biến</SelectItem>
              <SelectItem value="bookings">Số lượng đặt tour</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[250px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Chọn khoảng thời gian</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} locale={vi} />
            </PopoverContent>
          </Popover>

          <Button>
            <Filter className="h-4 w-4 mr-2" />
            Lọc
          </Button>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Tổng doanh thu</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(140000000)}</p>
          <span className="text-sm text-green-600">+12.5% so với tháng trước</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Số lượng đặt tour</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">45</p>
          <span className="text-sm text-green-600">+8.3% so với tháng trước</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Tỷ lệ hủy tour</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">2.5%</p>
          <span className="text-sm text-red-600">+0.8% so với tháng trước</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Biểu đồ thống kê</h2>

        {reportType === "revenue" && (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {reportType === "popular" && (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularToursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" name="Số lượt đặt" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {reportType === "bookings" && (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bookings" name="Số lượt đặt" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
