package com.bluemoon.bluemoonv1.service;

import com.bluemoon.bluemoonv1.dto.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface KhoanThuService {
    
    List<KhoanThuDTO> getAllKhoanThu();
    
    KhoanThuDTO getKhoanThuById(Long id);
    
    List<KhoanThuDTO> getKhoanThuBatBuoc();
    
    List<KhoanThuDTO> getKhoanThuTuNguyen();
    
    List<KhoanThuDTO> getActiveKhoanThu(LocalDate ngay);
    
    KhoanThuDTO createKhoanThu(KhoanThuRequestDTO requestDTO);
    
    KhoanThuDTO updateKhoanThu(Long id, KhoanThuRequestDTO requestDTO);
    
    void deleteKhoanThu(Long id);
    
    // Các phương thức mới cho chi tiết khoản thu
    
    /**
     * Lấy thông tin tổng hợp chi tiết của khoản thu
     * @param khoanThuId ID của khoản thu
     * @return Thông tin chi tiết bao gồm: khoản thu, hộ đã đóng, hộ chưa đóng, tổng tiền
     */
    KhoanThuDetailDTO getKhoanThuChiTiet(Long khoanThuId);
    
    /**
     * Lấy danh sách hộ khẩu đã đóng tiền cho khoản thu
     * @param khoanThuId ID của khoản thu
     * @return Danh sách hộ khẩu đã nộp tiền
     */
    List<HoKhauDTO> getHoDaDongByKhoanThuId(Long khoanThuId);
    
    /**
     * Lấy danh sách hộ khẩu chưa đóng tiền (chỉ áp dụng với khoản bắt buộc)
     * @param khoanThuId ID của khoản thu
     * @return Danh sách hộ khẩu chưa nộp tiền (null nếu khoản thu không bắt buộc)
     */
    List<HoKhauDTO> getHoChuaDongByKhoanThuId(Long khoanThuId);
    
    /**
     * Lấy tổng số tiền đã thu được cho khoản thu
     * @param khoanThuId ID của khoản thu
     * @return Tổng số tiền đã thu
     */
    BigDecimal getTongThuByKhoanThuId(Long khoanThuId);
}
