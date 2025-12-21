package com.bluemoon.bluemoonv1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhoanThuDTO {
    private Long id;
    private String tenKhoanThu;
    private Integer loaiKhoanThu; // 0: Bắt buộc, 1: Tự nguyện
    private BigDecimal donGia;
    private String moTa;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private BigDecimal tongThuDuoc; // Tổng số tiền đã thu được
    private Long soHoDaDong; // Số hộ đã đóng
}
