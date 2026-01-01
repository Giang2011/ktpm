export interface Apartment { // Giữ tên Apartment để tránh lỗi import hàng loạt trong UI cũ
  id: number;
  tenChuHo: string;   // Tên của chủ hộ khẩu
  diaChi: string;     // Địa chỉ hộ khẩu (Thay thế cho Name/Area cũ)
  ngayTao: string;    // Ngày lập hộ khẩu
  trangThai: number;  // Trạng thái hộ khẩu
  soNhanKhau: number; // Số lượng nhân khẩu trong hộ
}

export interface CreateApartmentRequest {
  tenChuHo: string;
  diaChi: string;
  trangThai: number;
}

export interface UpdateApartmentRequest {
  tenChuHo: string;
  diaChi: string;
  trangThai: number;
}

// Cấu trúc phản hồi danh sách Hộ khẩu có phân trang
export interface ApartmentsResponse {
  content: Apartment[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}