import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ManageItineraries = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [formData, setFormData] = useState({
    tour_id: "",
    ngay_thu: "",
    tieu_de_ngay: "",
    mo_ta_chi_tiet: "",
    hinh_anh: "",
    diem_den_id: "",
  });

  // Mock data
  const [itineraries, setItineraries] = useState([
    {
      id: 1,
      tour_id: 1,
      tour_name: "Vịnh Hạ Long 2 ngày 1 đêm",
      ngay_thu: 1,
      tieu_de_ngay: "Khám phá Vịnh Hạ Long",
      mo_ta_chi_tiet: "Tham quan các hang động, đảo đá và thưởng thức hải sản tươi sống",
      diem_den: "Vịnh Hạ Long",
    },
    {
      id: 2,
      tour_id: 1,
      tour_name: "Vịnh Hạ Long 2 ngày 1 đêm",
      ngay_thu: 2,
      tieu_de_ngay: "Khám phá Đảo Tuần Châu",
      mo_ta_chi_tiet: "Tham quan đảo Tuần Châu, xem biểu diễn nhạc nước",
      diem_den: "Đảo Tuần Châu",
    },
  ]);

  // Mock data for tours and destinations
  const tours = [
    { id: 1, ten_tour: "Vịnh Hạ Long 2 ngày 1 đêm" },
    { id: 2, ten_tour: "Đà Nẵng - Hội An 3 ngày 2 đêm" },
  ];

  const destinations = [
    { id: 1, ten_diem_den: "Vịnh Hạ Long" },
    { id: 2, ten_diem_den: "Đảo Tuần Châu" },
    { id: 3, ten_diem_den: "Đà Nẵng" },
    { id: 4, ten_diem_den: "Hội An" },
  ];

  const handleOpenModal = (itinerary = null) => {
    setSelectedItinerary(itinerary);
    setFormData(
      itinerary || {
        tour_id: "",
        ngay_thu: "",
        tieu_de_ngay: "",
        mo_ta_chi_tiet: "",
        hinh_anh: "",
        diem_den_id: "",
      }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedItinerary) {
      // Edit itinerary
      setItineraries(itineraries.map((itin) => (itin.id === selectedItinerary.id ? { ...itin, ...formData } : itin)));
    } else {
      // Add new itinerary
      const newItinerary = {
        id: itineraries.length + 1,
        ...formData,
        tour_name: tours.find((t) => t.id === parseInt(formData.tour_id))?.ten_tour,
        diem_den: destinations.find((d) => d.id === parseInt(formData.diem_den_id))?.ten_diem_den,
      };
      setItineraries([...itineraries, newItinerary]);
    }
    setIsModalOpen(false);
    setFormData({
      tour_id: "",
      ngay_thu: "",
      tieu_de_ngay: "",
      mo_ta_chi_tiet: "",
      hinh_anh: "",
      diem_den_id: "",
    });
  };

  const handleDelete = (itineraryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch trình này?")) {
      setItineraries(itineraries.filter((itin) => itin.id !== itineraryId));
    }
  };

  const filteredItineraries = itineraries.filter((itinerary) => itinerary.tour_name.toLowerCase().includes(searchTerm.toLowerCase()) || itinerary.tieu_de_ngay.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý lịch trình</h1>

        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm lịch trình
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input placeholder="Tìm kiếm lịch trình..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày thứ</th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm đến</th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredItineraries.map((itinerary) => (
              <tr key={itinerary.id}>
                <td className="py-4 px-4 text-sm text-gray-900">{itinerary.tour_name}</td>
                <td className="py-4 px-4 text-sm text-gray-900">Ngày {itinerary.ngay_thu}</td>
                <td className="py-4 px-4 text-sm text-gray-900">{itinerary.tieu_de_ngay}</td>
                <td className="py-4 px-4 text-sm text-gray-500">{itinerary.diem_den}</td>
                <td className="py-4 px-4 text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenModal(itinerary)}>
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(itinerary.id)}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedItinerary ? "Chỉnh sửa lịch trình" : "Thêm lịch trình mới"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tour</label>
                <Select value={formData.tour_id} onValueChange={(value) => setFormData((prev) => ({ ...prev, tour_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tour" />
                  </SelectTrigger>
                  <SelectContent>
                    {tours.map((tour) => (
                      <SelectItem key={tour.id} value={tour.id.toString()}>
                        {tour.ten_tour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày thứ</label>
                <Input type="number" name="ngay_thu" value={formData.ngay_thu} onChange={handleChange} placeholder="Nhập số ngày" min="1" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề ngày</label>
              <Input name="tieu_de_ngay" value={formData.tieu_de_ngay} onChange={handleChange} placeholder="Nhập tiêu đề cho ngày này" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Điểm đến</label>
              <Select value={formData.diem_den_id} onValueChange={(value) => setFormData((prev) => ({ ...prev, diem_den_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn điểm đến" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem key={dest.id} value={dest.id.toString()}>
                      {dest.ten_diem_den}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
              <Textarea name="mo_ta_chi_tiet" value={formData.mo_ta_chi_tiet} onChange={handleChange} placeholder="Nhập mô tả chi tiết cho ngày này" rows={4} required />
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="submit">{selectedItinerary ? "Cập nhật" : "Thêm mới"}</Button>
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

export default ManageItineraries;
