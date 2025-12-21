package com.bluemoon.bluemoonv1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NopTienDTO {
    private Long id;
    private Long khoanThuId;
    private String tenKhoanThu;
    private Long hoKhauId;
    private String tenChuHo;
    private BigDecimal soTien;
    private LocalDateTime ngayNop;
    private String nguoiNop;
    private String ghiChu;
}
