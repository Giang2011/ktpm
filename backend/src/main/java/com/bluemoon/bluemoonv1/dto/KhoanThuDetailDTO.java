package com.bluemoon.bluemoonv1.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO tổng hợp thông tin chi tiết của khoản thu
 * Bao gồm: thông tin khoản thu, danh sách hộ đã đóng, danh sách hộ chưa đóng, tổng tiền đã thu
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KhoanThuDetailDTO {
    
    // Thông tin khoản thu
    private KhoanThuDTO khoanThu;
    
    // Danh sách hộ khẩu đã đóng tiền
    private List<HoKhauDTO> hoDaDong;
    
    // Danh sách hộ khẩu chưa đóng tiền (chỉ áp dụng với khoản bắt buộc)
    private List<HoKhauDTO> hoChuaDong;
    
    // Tổng số tiền đã thu được
    private BigDecimal tongTienDaThu;
    
    // Số lượng hộ đã đóng
    private Integer soHoDaDong;
    
    // Số lượng hộ chưa đóng (chỉ áp dụng với khoản bắt buộc)
    private Integer soHoChuaDong;
}
