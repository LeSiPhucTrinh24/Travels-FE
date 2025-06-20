import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2, Filter, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/users");
      setUsers(res.data.result);
    } catch (err) {
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search term and exclude admins
  const filteredUsers = users.filter((user) => !user.roles?.includes("ADMIN") && ((user.fullName || user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || (user.userName || user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) || (user.phone || "").includes(searchTerm)));

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (user) => {
    navigate(`/admin/users/edit/${user.userId || user.id}`);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await axiosInstance.delete(`/users/${userId}`);
        toast.success("Xóa người dùng thành công");
        fetchUsers();
      } catch (err) {
        toast.error("Không thể xóa người dùng");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <Button onClick={() => navigate("/admin/users/add")}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-1/2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input placeholder="Tìm kiếm người dùng..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center py-8">
                    Đang tải...
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8">
                    Không có người dùng nào
                  </td>
                </tr>
              ) : (
                currentUsers.map((user, idx) => (
                  <tr key={user.userId || user.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-900">{startIndex + idx + 1}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                        {user.avatar || user.image ? (
                          <img src={user.avatar || user.image} alt={user.fullName || user.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500">{(user.fullName || user.name || "?").charAt(0).toUpperCase()}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{user.fullName || user.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{user.userName || user.email}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{user.phone}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${user.roles && user.roles.includes("ADMIN") ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>{user.roles && user.roles.includes("ADMIN") ? "Admin" : "Khách hàng"}</span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(user.userId || user.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Không tìm thấy người dùng nào phù hợp với từ khóa "{searchTerm}"</p>
            </div>
          )}
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} của {filteredUsers.length} người dùng
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Trước
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button key={page} variant="outline" size="sm" className={currentPage === page ? "bg-primary text-white" : ""} onClick={() => handlePageChange(page)}>
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Sau
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
