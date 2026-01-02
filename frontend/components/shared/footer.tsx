"use client"

import { Building2 } from "lucide-react"
import Link from "next/link"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t bg-card mt-auto">
            <div className="container mx-auto px-6 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        <span className="font-semibold">BlueMoon</span>
                        <span className="text-muted-foreground text-sm">
                            Quản lý chung cư
                        </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:text-foreground transition-colors">
                            Tổng quan
                        </Link>
                        <Link href="/dashboard/ho-khau" className="hover:text-foreground transition-colors">
                            Hộ khẩu
                        </Link>
                        <Link href="/dashboard/nhan-khau" className="hover:text-foreground transition-colors">
                            Nhân khẩu
                        </Link>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        © {currentYear} BlueMoon. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
