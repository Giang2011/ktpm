"use client"

import type React from "react"
import { Building2, Users, UserCircle, Receipt, Wallet, FileText, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const navigation = [
    { name: "Tổng quan", href: "/dashboard", icon: Building2 },
    { name: "Hộ khẩu", href: "/dashboard/ho-khau", icon: Users },
    { name: "Nhân khẩu", href: "/dashboard/nhan-khau", icon: UserCircle },
    { name: "Khoản thu", href: "/dashboard/khoan-thu", icon: Receipt },
    { name: "Nộp tiền", href: "/dashboard/nop-tien", icon: Wallet },
    { name: "Nhật ký", href: "/dashboard/log", icon: FileText },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Building2 className="mr-3 h-6 w-6 text-primary" />
          <div>
            <h1 className="font-semibold text-lg leading-tight">BlueMoon</h1>
            <p className="text-xs text-muted-foreground">Quản lý chung cư</p>
          </div>
        </div>

        <div className="border-b px-4 py-3 bg-muted/50">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {user.role === "to_truong" ? "Tổ trưởng" : "Kế toán"}
          </p>
        </div>

        <nav className="space-y-1 p-4 flex-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-4">
          <Button variant="ghost" className="w-full justify-start" onClick={logout}>
            <LogOut className="mr-3 h-5 w-5" />
            Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  )
}
