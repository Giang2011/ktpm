"use client"

import type React from "react"
import Image from "next/image"
import { Users, UserCircle, Receipt, Wallet, FileText, LogOut, Building2 } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/shared/footer"
import { useEffect, useMemo } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ModeToggle } from "@/components/mode-toggle"

const ROUTE_NAMES: Record<string, string> = {
  "dashboard": "Tổng Quan",
  "ho-khau": "Quản Lý Hộ Khẩu",
  "nhan-khau": "Quản Lý Nhân Khẩu",
  "khoan-thu": "Quản Lý Khoản Thu",
  "nop-tien": "Nộp Tiền",
  "log": "Nhật Ký Hệ Thống",
  "create": "Thêm Mới",
  "edit": "Chỉnh Sửa"
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter((seg) => seg !== "")
    const items = segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/")
      const isId = !isNaN(Number(segment))
      const label = isId ? "Chi Tiết" : (ROUTE_NAMES[segment] || segment)
      return { href, label, isLast: index === segments.length - 1 }
    })
    return items
  }, [pathname])

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) return null

  const navigation = [
    { name: "Tổng Quan", href: "/dashboard", icon: Building2 },
    { name: "Hộ Khẩu", href: "/dashboard/ho-khau", icon: Users },
    { name: "Nhân Khẩu", href: "/dashboard/nhan-khau", icon: UserCircle },
    { name: "Khoản Thu", href: "/dashboard/khoan-thu", icon: Receipt },
    { name: "Nộp Tiền", href: "/dashboard/nop-tien", icon: Wallet },
    { name: "Nhật Ký", href: "/dashboard/log", icon: FileText },
  ]

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r bg-sidebar flex flex-col shrink-0 transition-colors duration-300">
        {/* Phần Logo */}
        <div className="flex h-14 items-center border-b px-6 bg-sidebar shrink-0 lg:h-[60px]">
          <div className="mr-3 relative h-8 w-8">
            <Image 
              src="/real_estate.jpg" 
              alt="BlueMoon Logo"
              fill
              className="object-contain rounded-sm"
              priority
            />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight text-sidebar-foreground">BlueMoon</h1>
            <p className="text-xs text-muted-foreground font-medium">Quản lý chung cư</p>
          </div>
        </div>

        {/* --- ĐÃ XÓA PHẦN THÔNG TIN USER Ở ĐÂY --- */}

        {/* Menu Navigation */}
        <ScrollArea className="flex-1">
          <nav className="space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-sidebar-primary-foreground" : "text-muted-foreground"}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Nút Đăng Xuất */}
        <div className="border-t p-4 bg-sidebar shrink-0">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={logout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Đăng Xuất
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur px-6 shrink-0 lg:h-[60px] z-10 shadow-sm justify-between transition-colors duration-300">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((item, index) => (
                  <BreadcrumbItem key={item.href}>
                    {item.isLast ? (
                      <BreadcrumbPage className="font-semibold text-primary">{item.label}</BreadcrumbPage>
                    ) : (
                      <>
                        <BreadcrumbLink asChild>
                           <Link href={item.href} className="hover:text-primary transition-colors">{item.label}</Link>
                        </BreadcrumbLink>
                        <BreadcrumbSeparator />
                      </>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            
            <div className="flex items-center gap-2">
              <ModeToggle />
            </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-muted/20 p-0 transition-colors duration-300">
          <div className="flex flex-col min-h-full">
            <div className="flex-1 container mx-auto p-6">
              {children}
            </div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  )
}