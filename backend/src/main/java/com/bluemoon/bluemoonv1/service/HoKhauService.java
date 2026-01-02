package com.bluemoon.bluemoonv1.service;

import com.bluemoon.bluemoonv1.dto.*;
import org.springframework.data.domain.Page;

import java.util.List;

public interface HoKhauService {
    
    List<HoKhauDTO> getAllHoKhau();
    
    Page<HoKhauDTO> getHoKhauPaged(int page, int size, String sortBy, String sortDir);
    
    HoKhauDTO getHoKhauById(Long id);
    
    List<HoKhauDTO> getActiveHoKhau();
    
    List<HoKhauDTO> searchByTenChuHo(String tenChuHo);
    
    List<HoKhauDTO> searchByDiaChi(String diaChi);
    
    HoKhauDTO createHoKhau(HoKhauRequestDTO requestDTO);
    
    HoKhauDTO updateHoKhau(Long id, HoKhauRequestDTO requestDTO);
    
    void deleteHoKhau(Long id);
    
    // Các phương thức mới cho chi tiết hộ khẩu
    
    /**
     * Lấy thông tin tổng hợp chi tiết của hộ khẩu
     * @param id ID của hộ khẩu
     * @return Thông tin chi tiết bao gồm: hộ, thành viên, khoản đã đóng, khoản chưa đóng
     */
    HoKhauDetailDTO getHoKhauChiTiet(Long id);
    
    /**
     * Lấy danh sách thành viên trong hộ
     * @param hoKhauId ID của hộ khẩu
     * @return Danh sách nhân khẩu trong hộ
     */
    List<NhanKhauDTO> getThanhVienByHoKhauId(Long hoKhauId);
    
    /**
     * Lấy danh sách các khoản đã đóng
     * @param hoKhauId ID của hộ khẩu
     * @return Danh sách các khoản thu đã đóng
     */
    List<NopTienDTO> getKhoanDaDong(Long hoKhauId);
    
    /**
     * Lấy danh sách các khoản bắt buộc chưa đóng
     * @param hoKhauId ID của hộ khẩu
     * @return Danh sách các khoản thu bắt buộc chưa đóng
     */
    List<KhoanThuDTO> getKhoanChuaDong(Long hoKhauId);
}
