package com.bluemoon.bluemoonv1.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TamTruTamVangRequestDTO {
    @NotNull(message = "Nhân khẩu không được để trống")
    private Long nhanKhauId;
    
    @NotNull(message = "Loại tạm trú/tạm vắng không được để trống")
    private Integer loaiTamTru; // 0: Tạm trú, 1: Tạm vắng
    
    private String diaChi; // Địa chỉ (bắt buộc khi loaiTamTru = 0)
    
    @NotBlank(message = "Số điện thoại không được để trống")
    private String soDienThoai;
    
    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate ngayBatDau;
    
    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDate ngayKetThuc;
    
    @NotBlank(message = "Lý do không được để trống")
    private String lyDo;
}
