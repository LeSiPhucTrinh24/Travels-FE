import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ManageCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  // Mock data
  const [categories, setCategories] = useState([
    { id: 1, ten_loai: "Tour Hà Nội" },
    { id: 2, ten_loai: "Tour Đà Nẵng" },
    { id: 3, ten_loai: "Tour nghỉ dưỡng" },
    { id: 4, ten_loai: "Tour mạo hiểm" },
  ]);

  const handleOpenModal = (category = null) => {
    setSelectedCategory(category);
    setCategoryName(category ? category.ten_loai : "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCategory) {
      // Edit category
      setCategories(categories.map((cat) => (cat.id === selectedCategory.id ? { ...cat, ten_loai: categoryName } : cat)));
    } else {
      // Add new category
      const newCategory = {
        id: categories.length + 1,
        ten_loai: categoryName,
      };
      setCategories([...categories, newCategory]);
    }
    setIsModalOpen(false);
    setCategoryName("");
  };

  const handleDelete = (categoryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    }
  };

  const filteredCategories = categories.filter((category) => category.ten_loai.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý loại tour</h1>

        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm loại tour
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input placeholder="Tìm kiếm loại tour..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên loại tour</th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCategories.map((category) => (
              <tr key={category.id}>
                <td className="py-4 px-4 text-sm text-gray-900">{category.id}</td>
                <td className="py-4 px-4 text-sm text-gray-900">{category.ten_loai}</td>
                <td className="py-4 px-4 text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenModal(category)}>
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(category.id)}>
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
            <DialogTitle>{selectedCategory ? "Chỉnh sửa loại tour" : "Thêm loại tour mới"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên loại tour</label>
              <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Nhập tên loại tour" required />
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="submit">{selectedCategory ? "Cập nhật" : "Thêm mới"}</Button>
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

export default ManageCategories;
