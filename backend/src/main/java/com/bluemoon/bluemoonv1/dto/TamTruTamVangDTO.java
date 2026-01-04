package com.bluemoon.bluemoonv1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TamTruTamVangDTO {
    private Long id;
    private Long nhanKhauId;
    private String hoTenNhanKhau; // Tên nhân khẩu (để hiển thị)
    private String cmndCccdNhanKhau; // CMND/CCCD (để hiển thị)
    private Integer loaiTamTru; // 0: Tạm trú, 1: Tạm vắng
    private String diaChi; // Địa chỉ (chỉ bắt buộc khi tạm trú)
    private String soDienThoai;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private String lyDo;
}
