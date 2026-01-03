"use client"

import { Building2 } from "lucide-react"
import Link from "next/link"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t bg-card mt-auto transition-colors duration-300">
            <div className="container mx-auto px-6 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        <span className="font-semibold">BlueMoon</span>
                        <span className="text-muted-foreground text-sm">
                            Quản lý chung cư
                        </span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:text-primary transition-colors">Tổng Quan</Link>
                        <Link href="/dashboard/ho-khau" className="hover:text-primary transition-colors">Hộ Khẩu</Link>
                        <Link href="/dashboard/nhan-khau" className="hover:text-primary transition-colors">Nhân Khẩu</Link>
                        <Link href="/dashboard/khoan-thu" className="hover:text-primary transition-colors">Khoản Thu</Link>
                        <Link href="/dashboard/nop-tien" className="hover:text-primary transition-colors">Nộp Tiền</Link>
                        <Link href="/dashboard/log" className="hover:text-primary transition-colors">Nhật Ký</Link>
                    </div>

                    <p className="text-sm text-muted-foreground whitespace-nowrap">
                        © {currentYear} BlueMoon. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}