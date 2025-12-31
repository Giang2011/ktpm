package com.bluemoon.bluemoonv1.dto;

import lombok.*;

import java.util.List;

/**
 * DTO tổng hợp thông tin chi tiết của hộ khẩu
 * Bao gồm: thông tin hộ, danh sách thành viên, khoản đã đóng, khoản chưa đóng
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HoKhauDetailDTO {
    
    // Thông tin hộ khẩu
    private HoKhauDTO hoKhau;
    
    // Danh sách thành viên trong hộ
    private List<NhanKhauDTO> thanhVien;
    
    // Danh sách khoản đã đóng
    private List<NopTienDTO> khoanDaDong;
    
    // Danh sách khoản bắt buộc chưa đóng
    private List<KhoanThuDTO> khoanChuaDong;
}
