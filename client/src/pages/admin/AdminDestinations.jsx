import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ManageDestinations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [formData, setFormData] = useState({
    ten_diem_den: "",
    mo_ta: "",
  });

  // Mock data
  const [destinations, setDestinations] = useState([
    { id: 1, ten_diem_den: "Hạ Long", mo_ta: "Vịnh Hạ Long - Di sản thiên nhiên thế giới" },
    { id: 2, ten_diem_den: "Đà Nẵng", mo_ta: "Thành phố của những cây cầu" },
    { id: 3, ten_diem_den: "Hội An", mo_ta: "Phố cổ Hội An - Di sản văn hóa thế giới" },
    { id: 4, ten_diem_den: "Phú Quốc", mo_ta: "Đảo ngọc Phú Quốc" },
  ]);

  const handleOpenModal = (destination = null) => {
    setSelectedDestination(destination);
    setFormData(destination || { ten_diem_den: "", mo_ta: "" });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDestination) {
      // Edit destination
      setDestinations(destinations.map((dest) => (dest.id === selectedDestination.id ? { ...dest, ...formData } : dest)));
    } else {
      // Add new destination
      const newDestination = {
        id: destinations.length + 1,
        ...formData,
      };
      setDestinations([...destinations, newDestination]);
    }
    setIsModalOpen(false);
    setFormData({ ten_diem_den: "", mo_ta: "" });
  };

  const handleDelete = (destinationId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa điểm đến này?")) {
      setDestinations(destinations.filter((dest) => dest.id !== destinationId));
    }
  };

  const filteredDestinations = destinations.filter((destination) => destination.ten_diem_den.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý điểm đến</h1>

        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm điểm đến
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input placeholder="Tìm kiếm điểm đến..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên điểm đến</th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDestinations.map((destination) => (
              <tr key={destination.id}>
                <td className="py-4 px-4 text-sm text-gray-900">{destination.id}</td>
                <td className="py-4 px-4 text-sm text-gray-900">{destination.ten_diem_den}</td>
                <td className="py-4 px-4 text-sm text-gray-500">{destination.mo_ta}</td>
                <td className="py-4 px-4 text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenModal(destination)}>
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(destination.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
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
              <Input name="ten_diem_den" value={formData.ten_diem_den} onChange={handleChange} placeholder="Nhập tên điểm đến" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <Textarea name="mo_ta" value={formData.mo_ta} onChange={handleChange} placeholder="Nhập mô tả điểm đến" rows={4} required />
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="submit">{selectedDestination ? "Cập nhật" : "Thêm mới"}</Button>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
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
