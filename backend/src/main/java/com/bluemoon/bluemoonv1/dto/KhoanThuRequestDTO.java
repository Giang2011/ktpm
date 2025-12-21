package com.bluemoon.bluemoonv1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhoanThuRequestDTO {
    private String tenKhoanThu;
    private Integer loaiKhoanThu;
    private BigDecimal donGia;
    private String moTa;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
}
