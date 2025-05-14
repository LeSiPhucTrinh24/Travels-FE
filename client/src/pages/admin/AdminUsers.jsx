import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2, Filter, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock users data
  const users = [
    { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com", phone: "0912345678", isAdmin: false, status: "active", createdAt: "12/04/2025" },
    { id: 2, name: "Trần Thị B", email: "tranthib@example.com", phone: "0923456789", isAdmin: false, status: "active", createdAt: "10/04/2025" },
    { id: 3, name: "Lê Văn C", email: "levanc@example.com", phone: "0934567890", isAdmin: false, status: "active", createdAt: "08/04/2025" },
    { id: 4, name: "Phạm Thị D", email: "phamthid@example.com", phone: "0945678901", isAdmin: true, status: "active", createdAt: "05/04/2025" },
    { id: 5, name: "Hoàng Văn E", email: "hoangvane@example.com", phone: "0956789012", isAdmin: false, status: "inactive", createdAt: "01/04/2025" },
  ];

  // Filter users based on search term
  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.phone.includes(searchTerm));

  const handleEdit = (user) => {
    navigate(`/admin/users/edit/${user.id}`, { state: { user } });
  };

  const handleDelete = (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      console.log("Deleting user:", userId);
      // TODO: Implement delete API call
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

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input placeholder="Tìm kiếm người dùng..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Lọc
          </Button>
          <Button variant="outline">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sắp xếp
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-gray-900">{user.id}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                      {user.image ? <img src={user.image} alt={user.name} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500">{user.name.charAt(0).toUpperCase()}</div>}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{user.email}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{user.phone}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${user.isAdmin ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>{user.isAdmin ? "Admin" : "Khách hàng"}</span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{user.status === "active" ? "Hoạt động" : "Vô hiệu"}</span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">{user.createdAt}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(user.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
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
            Hiển thị {filteredUsers.length} của {users.length} người dùng
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Trước
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-white">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Sau
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
