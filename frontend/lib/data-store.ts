// Simple in-memory data store for demo purposes
export type HoKhau = {
  id: string
  maHoKhau: string
  chuHo: string
  diaChi: string
  soPhong: string
  dienTich: number
  soThanhVien: number
  ngayDangKy: string
}

export type NhanKhau = {
  id: string
  hoTen: string
  ngaySinh: string
  gioiTinh: "Nam" | "Nữ" | "Khác"
  cccd: string
  soDienThoai: string
  hoKhauId: string
  quanHeChuHo: string
  ngheNghiep: string
}

export type KhoanThu = {
  id: string
  tenKhoanThu: string
  loaiKhoanThu: "Định kỳ" | "Một lần"
  soTien: number
  donViTinh: string
  moTa: string
  ngayApDung: string
}

// In-memory storage
let hoKhauData: HoKhau[] = []
let nhanKhauData: NhanKhau[] = []
let khoanThuData: KhoanThu[] = []

// Hộ Khẩu CRUD operations
export const hoKhauStore = {
  getAll: () => hoKhauData,

  getById: (id: string) => hoKhauData.find((h) => h.id === id),

  create: (hoKhau: Omit<HoKhau, "id">) => {
    const newHoKhau = { ...hoKhau, id: Date.now().toString() }
    hoKhauData.push(newHoKhau)
    return newHoKhau
  },

  update: (id: string, hoKhau: Partial<HoKhau>) => {
    const index = hoKhauData.findIndex((h) => h.id === id)
    if (index !== -1) {
      hoKhauData[index] = { ...hoKhauData[index], ...hoKhau }
      return hoKhauData[index]
    }
    return null
  },

  delete: (id: string) => {
    hoKhauData = hoKhauData.filter((h) => h.id !== id)
    // Also delete related nhân khẩu
    nhanKhauData = nhanKhauData.filter((n) => n.hoKhauId !== id)
  },
}

// Nhân Khẩu CRUD operations
export const nhanKhauStore = {
  getAll: () => nhanKhauData,

  getById: (id: string) => nhanKhauData.find((n) => n.id === id),

  getByHoKhau: (hoKhauId: string) => nhanKhauData.filter((n) => n.hoKhauId === hoKhauId),

  create: (nhanKhau: Omit<NhanKhau, "id">) => {
    const newNhanKhau = { ...nhanKhau, id: Date.now().toString() }
    nhanKhauData.push(newNhanKhau)

    // Update hộ khẩu member count
    const hoKhau = hoKhauData.find((h) => h.id === nhanKhau.hoKhauId)
    if (hoKhau) {
      hoKhau.soThanhVien = nhanKhauData.filter((n) => n.hoKhauId === nhanKhau.hoKhauId).length
    }

    return newNhanKhau
  },

  update: (id: string, nhanKhau: Partial<NhanKhau>) => {
    const index = nhanKhauData.findIndex((n) => n.id === id)
    if (index !== -1) {
      nhanKhauData[index] = { ...nhanKhauData[index], ...nhanKhau }
      return nhanKhauData[index]
    }
    return null
  },

  delete: (id: string) => {
    const nhanKhau = nhanKhauData.find((n) => n.id === id)
    nhanKhauData = nhanKhauData.filter((n) => n.id !== id)

    // Update hộ khẩu member count
    if (nhanKhau) {
      const hoKhau = hoKhauData.find((h) => h.id === nhanKhau.hoKhauId)
      if (hoKhau) {
        hoKhau.soThanhVien = nhanKhauData.filter((n) => n.hoKhauId === nhanKhau.hoKhauId).length
      }
    }
  },
}

// Khoản Thu CRUD operations
export const khoanThuStore = {
  getAll: () => khoanThuData,

  getById: (id: string) => khoanThuData.find((k) => k.id === id),

  create: (khoanThu: Omit<KhoanThu, "id">) => {
    const newKhoanThu = { ...khoanThu, id: Date.now().toString() }
    khoanThuData.push(newKhoanThu)
    return newKhoanThu
  },

  update: (id: string, khoanThu: Partial<KhoanThu>) => {
    const index = khoanThuData.findIndex((k) => k.id === id)
    if (index !== -1) {
      khoanThuData[index] = { ...khoanThuData[index], ...khoanThu }
      return khoanThuData[index]
    }
    return null
  },

  delete: (id: string) => {
    khoanThuData = khoanThuData.filter((k) => k.id !== id)
  },
}
