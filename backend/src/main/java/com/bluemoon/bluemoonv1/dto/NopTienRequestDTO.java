package com.bluemoon.bluemoonv1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NopTienRequestDTO {
    private Long khoanThuId;
    private Long hoKhauId;
    private BigDecimal soTien;
    private String nguoiNop;
    private String ghiChu;
}
