package com.bluemoon.bluemoonv1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NhanKhauDTO {
    private Long id;
    private Long hoKhauId;
    private String tenChuHo; // Tên chủ hộ (để hiển thị)
    private String diaChi; // Địa chỉ hộ khẩu
    private String hoTen;
    private LocalDate ngaySinh;
    private String gioiTinh;
    private String cmndCccd;
    private String quanHeVoiChuHo;
    private String ngheNghiep;
}
