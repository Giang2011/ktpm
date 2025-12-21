package com.bluemoon.bluemoonv1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NhanKhauRequestDTO {
    private Long hoKhauId;
    private String hoTen;
    private LocalDate ngaySinh;
    private String gioiTinh;
    private String cmndCccd;
    private String quanHeVoiChuHo;
    private String ngheNghiep;
}
