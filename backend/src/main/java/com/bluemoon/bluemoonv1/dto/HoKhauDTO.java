package com.bluemoon.bluemoonv1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HoKhauDTO {
    private Long id;
    private String tenChuHo;
    private String diaChi;
    private LocalDate ngayTao;
    private Integer trangThai;
    private Integer soNhanKhau; // Số lượng nhân khẩu trong hộ
}
