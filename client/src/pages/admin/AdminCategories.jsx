import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";

const ManageCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleOpenModal = (category = null) => {
    setSelectedCategory(category);
    setCategoryName(category ? category.tourTypeName : "");
    setIsModalOpen(true);
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
      }
      setIsLoading(true);
      const response = await axiosInstance.get(`/tourTypes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      console.log("API Response:", response.data);
      const data = response.data.result || [];
      console.log("Data before setting categories:", data);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching tour types:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Không thể tải danh sách loại tour. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
      }
      if (selectedCategory) {
        await axiosInstance.put(
          `/tourTypes/${selectedCategory.tourTypeId}`,
          { tourTypeName: categoryName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        toast({
          title: "Thành công",
          description: "Loại tour đã được cập nhật.",
        });
      } else {
        await axiosInstance.post(
          "/tourTypes",
          { tourTypeName: categoryName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        toast({
          title: "Thành công",
          description: "Loại tour mới đã được thêm.",
        });
      }
      await fetchCategories();
    } catch (error) {
      console.error("Error submitting handleSubmit:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể lưu loại tour. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      setCategoryName("");
      setSelectedCategory(null);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
        }
        await axiosInstance.delete(`/tourTypes/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        toast({
          title: "Thành công",
          description: "Loại tour đã được xóa.",
        });
        await fetchCategories();
      } catch (error) {
        console.error("Error deleting tour type:", error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: error.response?.data?.message || "Không thể xóa loại tour. Vui lòng thử lại sau.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredCategories = categories.filter((category) => (category.tourTypeName || "").toLowerCase().includes(searchTerm.toLowerCase()));
  console.log("filteredCategories: ", filteredCategories);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý loại tour</h1>
        <Button onClick={() => handleOpenModal()} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm loại tour
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input placeholder="Tìm kiếm loại tour..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" disabled={isLoading} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6 text-center text-sm text-gray-500">Chưa có loại tour nào. Hãy thêm loại tour mới!</div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6 text-center text-sm text-gray-500">Không tìm thấy loại tour khớp với từ khóa.</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên loại tour</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.map((category, index) => (
                <tr key={category.tourTypeId}>
                  <td className="py-4 px-4 text-sm text-gray-900">{index + 1}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{category.tourTypeName}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenModal(category)} disabled={isLoading}>
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(category.tourTypeId)} disabled={isLoading}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory ? "Chỉnh sửa loại tour" : "Thêm loại tour mới"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên loại tour</label>
              <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Nhập tên loại tour" required disabled={isLoading} />
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : selectedCategory ? "Cập nhật" : "Thêm mới"}
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

export default ManageCategories;
