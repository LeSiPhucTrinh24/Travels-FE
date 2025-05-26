import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";

const ManageDestinations = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [formData, setFormData] = useState({
    destinationName: "",
    description: "",
  });
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Lấy danh sách điểm đến từ backend
  const fetchDestinations = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
      }
      const response = await axiosInstance.get("/destinations", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      setDestinations(response.data.result || []);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Không thể tải danh sách điểm đến. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gọi fetchDestinations khi component được mount
  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleOpenModal = (destination = null) => {
    setSelectedDestination(destination);
    setFormData(
      destination
        ? { destinationName: destination.destinationName, description: destination.description }
        : { destinationName: "", description: "" }
    );
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
      }

      if (selectedDestination) {
        // Cập nhật điểm đến
        await axiosInstance.put(`/destinations/${selectedDestination.destinationId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        toast({
          title: "Thành công",
          description: "Điểm đến đã được cập nhật.",
        });
      } else {
        // Thêm điểm đến mới
        await axiosInstance.post("/destinations", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        toast({
          title: "Thành công",
          description: "Điểm đến mới đã được thêm.",
        });
      }
      await fetchDestinations(); // Cập nhật lại danh sách
      setIsModalOpen(false);
      setFormData({ destinationName: "", description: "" });
      setSelectedDestination(null);
    } catch (error) {
      console.error("Error submitting destination:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể lưu điểm đến. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (destinationId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa điểm đến này?")) {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
        }
        await axiosInstance.delete(`/destinations/${destinationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        toast({
          title: "Thành công",
          description: "Điểm đến đã được xóa.",
        });
        await fetchDestinations(); // Cập nhật lại danh sách
      } catch (error) {
        console.error("Error deleting destination:", error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: error.response?.data?.message || "Không thể xóa điểm đến. Vui lòng thử lại sau.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredDestinations = destinations.filter((destination) =>
    destination.destinationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý điểm đến</h1>
        <Button onClick={() => handleOpenModal()} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm điểm đến
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Tìm kiếm điểm đến..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên điểm đến</th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="py-4 px-4 text-center text-sm text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : destinations.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 px-4 text-center text-sm text-gray-500">
                  Chưa có điểm đến nào. Hãy thêm điểm đến mới!
                </td>
              </tr>
            ) : filteredDestinations.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 px-4 text-center text-sm text-gray-500">
                  Không tìm thấy điểm đến khớp với từ khóa.
                </td>
              </tr>
            ) : (
              filteredDestinations.map((destination, index) => (
                <tr key={destination.destinationId}>
                  <td className="py-4 px-4 text-sm text-gray-900">{index + 1}</td>
                  <td className c="py-4 px-4 text-sm text-gray-900">{destination.destinationName}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{destination.description}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleOpenModal(destination)}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete(destination.destinationId)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDestination ? "Chỉnh sửa điểm đến" : "Thêm điểm đến mới"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên điểm đến</label>
              <Input
                name="destinationName"
                value={formData.destinationName}
                onChange={handleChange}
                placeholder="Nhập tên điểm đến"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả điểm đến"
                rows={4}
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : selectedDestination ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isLoading}>
                Hủy
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageDestinations;