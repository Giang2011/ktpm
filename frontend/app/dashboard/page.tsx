"use client";

import { useState, useEffect } from "react";
import { Users, UserCircle, Receipt, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

interface NopTien {
  id: number;
  soTien: number;
  ngayNop: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [totalHoKhau, setTotalHoKhau] = useState(0);
  const [totalNhanKhau, setTotalNhanKhau] = useState(0);
  const [totalKhoanThu, setTotalKhoanThu] = useState(0);
  const [totalMoneyAll, setTotalMoneyAll] = useState(0);
  const [totalMoneyThisMonth, setTotalMoneyThisMonth] = useState(0);
  const [showMonthly, setShowMonthly] = useState(false);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      // Load hộ khẩu
      const hoKhauResponse = await api.get("/api/hokhau");
      if (hoKhauResponse.ok) {
        const hoKhauData = await hoKhauResponse.json();
        setTotalHoKhau(hoKhauData.length);
      }

      // Load nhân khẩu
      const nhanKhauResponse = await api.get("/api/nhankhau");
      if (nhanKhauResponse.ok) {
        const nhanKhauData = await nhanKhauResponse.json();
        setTotalNhanKhau(nhanKhauData.length);
      }

      // Load khoản thu
      const khoanThuResponse = await api.get("/api/khoanthu");
      if (khoanThuResponse.ok) {
        const khoanThuData = await khoanThuResponse.json();
        setTotalKhoanThu(khoanThuData.length);
      }

      // Load nộp tiền
      const nopTienResponse = await api.get("/api/noptien");
      if (nopTienResponse.ok) {
        const nopTienData: NopTien[] = await nopTienResponse.json();
        
        // Tính tổng tất cả
        const totalAll = nopTienData.reduce((sum, item) => sum + item.soTien, 0);
        setTotalMoneyAll(totalAll);

        // Tính tổng tháng này
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const totalMonth = nopTienData
          .filter((item) => {
            const ngayNop = new Date(item.ngayNop);
            return ngayNop.getMonth() === currentMonth && ngayNop.getFullYear() === currentYear;
          })
          .reduce((sum, item) => sum + item.soTien, 0);
        
        setTotalMoneyThisMonth(totalMonth);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const stats = [
    {
      title: "Tổng hộ khẩu",
      value: totalHoKhau.toString(),
      icon: Users,
      description: "Hộ gia đình đang sinh sống",
    },
    {
      title: "Tổng nhân khẩu",
      value: totalNhanKhau.toString(),
      icon: UserCircle,
      description: "Cư dân trong chung cư",
    },
    {
      title: "Khoản thu",
      value: totalKhoanThu.toString(),
      icon: Receipt,
      description: "Loại phí đang áp dụng",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-balance">Tổng quan</h1>
        <p className="text-muted-foreground mt-1">Hệ thống quản lý chung cư BlueMoon</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Tổng số tiền đã thu
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Tổng doanh thu từ các khoản phí
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={showMonthly ? "outline" : "default"}
              size="sm"
              onClick={() => setShowMonthly(false)}
            >
              Tất cả
            </Button>
            <Button
              variant={showMonthly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMonthly(true)}
            >
              Tháng này
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-600">
            {formatCurrency(showMonthly ? totalMoneyThisMonth : totalMoneyAll)}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary">
              {showMonthly ? `Tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}` : "Tổng cộng"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chào mừng</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Chào mừng bạn đến với hệ thống quản lý chung cư BlueMoon. Sử dụng menu bên trái để quản lý hộ khẩu, nhân
            khẩu và các khoản thu phí.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
