"use client";

import { useState, useEffect } from "react";
import { Users, UserCircle, Receipt, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface NopTien {
  id: number;
  soTien: number;
  ngayNop: string;
}

interface MonthlyStats {
  name: string;
  total: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [totalHoKhau, setTotalHoKhau] = useState(0);
  const [totalNhanKhau, setTotalNhanKhau] = useState(0);
  const [totalKhoanThu, setTotalKhoanThu] = useState(0);
  const [totalMoneyAll, setTotalMoneyAll] = useState(0);
  const [monthlyData, setMonthlyData] = useState<MonthlyStats[]>([]);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      // Load stats concurrently
      const [hoKhauRes, nhanKhauRes, khoanThuRes, nopTienRes] = await Promise.all([
        api.get("/api/hokhau"),
        api.get("/api/nhankhau"),
        api.get("/api/khoanthu"),
        api.get("/api/noptien")
      ]);

      if (hoKhauRes.ok) setTotalHoKhau((await hoKhauRes.json()).length);
      if (nhanKhauRes.ok) setTotalNhanKhau((await nhanKhauRes.json()).length);
      if (khoanThuRes.ok) setTotalKhoanThu((await khoanThuRes.json()).length);

      if (nopTienRes.ok) {
        const nopTienData: NopTien[] = await nopTienRes.json();
        
        // Tính tổng
        const totalAll = nopTienData.reduce((sum, item) => sum + item.soTien, 0);
        setTotalMoneyAll(totalAll);

        // Xử lý dữ liệu cho biểu đồ (6 tháng gần nhất)
        const stats: Record<string, number> = {};
        const now = new Date();
        
        // Khởi tạo 6 tháng gần nhất = 0
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `Tháng ${d.getMonth() + 1}`;
          stats[key] = 0;
        }

        // Fill dữ liệu
        nopTienData.forEach(item => {
          const d = new Date(item.ngayNop);
          // Chỉ lấy dữ liệu trong năm hiện tại (hoặc logic tùy chỉnh của bạn)
          const key = `Tháng ${d.getMonth() + 1}`;
          if (stats[key] !== undefined) {
            stats[key] += item.soTien;
          }
        });

        const chartData = Object.keys(stats).map(key => ({
          name: key,
          total: stats[key]
        }));
        setMonthlyData(chartData);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  // Hàm format tiền tệ hiển thị ở Card Tổng (vẫn giữ format VND chuẩn hoặc bạn có thể sửa nếu muốn)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const statsCards = [
    {
      title: "Hộ Khẩu",
      value: totalHoKhau,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      desc: "Hộ gia đình"
    },
    {
      title: "Nhân Khẩu",
      value: totalNhanKhau,
      icon: UserCircle,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
      desc: "Cư dân"
    },
    {
      title: "Khoản Thu",
      value: totalKhoanThu,
      icon: Receipt,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      desc: "Danh mục phí"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tổng Quan</h1>
          <p className="text-muted-foreground">
            Xin chào, quản trị viên! Dưới đây là báo cáo hoạt động chung cư.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden md:flex gap-2">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString('vi-VN')}
          </Button>
          {/* Đã xóa nút Xuất Báo Cáo */}
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-4 md:grid-cols-3">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.desc} đang được quản lý
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Chart Section */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Revenue Chart - Chiếm 4 cột */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Biểu Đồ Thu Phí</CardTitle>
            <CardDescription>
              Doanh thu từ phí chung cư trong 6 tháng qua (Đơn vị: Triệu đồng)
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    // Cập nhật: Giữ nguyên giá trị (Scale 1), không chia cho 1 triệu nữa
                    tickFormatter={(value) => `${value}`} 
                  />
                  <Tooltip 
                    cursor={{fill: 'var(--muted)'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    // Cập nhật tooltip để hiển thị rõ đơn vị
                    formatter={(value: number) => [`${value} (Triệu đồng)`, "Doanh thu"]}
                  />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                     {monthlyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="var(--primary)" />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Total Money Highlight - Chiếm 3 cột */}
        <Card className="md:col-span-3 flex flex-col justify-center bg-gradient-to-br from-card to-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Tổng Doanh Thu
            </CardTitle>
            <CardDescription>Tổng số tiền thực thu tính đến hiện tại</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-green-500 tracking-tight">
              {formatCurrency(totalMoneyAll)}
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tháng này:</span>
                <span className="font-medium">
                    {monthlyData.length > 0 ? formatCurrency(monthlyData[monthlyData.length-1].total) : '0 ₫'}
                </span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[75%] rounded-full animate-pulse" />
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                *Số liệu được cập nhật theo thời gian thực từ hệ thống.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}