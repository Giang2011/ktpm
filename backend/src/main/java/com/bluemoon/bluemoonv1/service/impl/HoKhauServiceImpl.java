package com.bluemoon.bluemoonv1.service.impl;

import com.bluemoon.bluemoonv1.annotation.AuditLog;
import com.bluemoon.bluemoonv1.dto.*;
import com.bluemoon.bluemoonv1.entity.*;
import com.bluemoon.bluemoonv1.repository.*;
import com.bluemoon.bluemoonv1.service.HoKhauService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class HoKhauServiceImpl implements HoKhauService {
    
    private final HoKhauRepository hoKhauRepository;
    private final NhanKhauRepository nhanKhauRepository;
    private final NopTienRepository nopTienRepository;
    private final KhoanThuRepository khoanThuRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<HoKhauDTO> getAllHoKhau() {
        return hoKhauRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public HoKhauDTO getHoKhauById(Long id) {
        HoKhau hoKhau = hoKhauRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hộ khẩu not found with id: " + id));
        return convertToDTO(hoKhau);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<HoKhauDTO> getActiveHoKhau() {
        return hoKhauRepository.findAllActive().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<HoKhauDTO> searchByTenChuHo(String tenChuHo) {
        return hoKhauRepository.findByTenChuHoContaining(tenChuHo).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<HoKhauDTO> searchByDiaChi(String diaChi) {
        return hoKhauRepository.findByDiaChiContaining(diaChi).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @AuditLog(tableName = "ho_khau", action = AuditAction.CREATE)
    public HoKhauDTO createHoKhau(HoKhauRequestDTO requestDTO) {
        HoKhau hoKhau = new HoKhau();
        hoKhau.setTenChuHo(requestDTO.getTenChuHo());
        hoKhau.setDiaChi(requestDTO.getDiaChi());
        hoKhau.setTrangThai(requestDTO.getTrangThai() != null ? requestDTO.getTrangThai() : 1);
        
        HoKhau savedHoKhau = hoKhauRepository.save(hoKhau);
        return convertToDTO(savedHoKhau);
    }
    
    @Override
    @AuditLog(tableName = "ho_khau", action = AuditAction.UPDATE)
    public HoKhauDTO updateHoKhau(Long id, HoKhauRequestDTO requestDTO) {
        HoKhau hoKhau = hoKhauRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hộ khẩu not found with id: " + id));
        
        hoKhau.setTenChuHo(requestDTO.getTenChuHo());
        hoKhau.setDiaChi(requestDTO.getDiaChi());
        if (requestDTO.getTrangThai() != null) {
            hoKhau.setTrangThai(requestDTO.getTrangThai());
        }
        
        HoKhau updatedHoKhau = hoKhauRepository.save(hoKhau);
        return convertToDTO(updatedHoKhau);
    }
    
    @Override
    @AuditLog(tableName = "ho_khau", action = AuditAction.DELETE)
    public void deleteHoKhau(Long id) {
        HoKhau hoKhau = hoKhauRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hộ khẩu not found with id: " + id));
        
        hoKhauRepository.deleteById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public HoKhauDetailDTO getHoKhauChiTiet(Long id) {
        // Lấy thông tin hộ khẩu
        HoKhauDTO hoKhau = getHoKhauById(id);
        
        // Lấy danh sách thành viên
        List<NhanKhauDTO> thanhVien = getThanhVienByHoKhauId(id);
        
        // Lấy danh sách khoản đã đóng
        List<NopTienDTO> khoanDaDong = getKhoanDaDong(id);
        
        // Lấy danh sách khoản chưa đóng
        List<KhoanThuDTO> khoanChuaDong = getKhoanChuaDong(id);
        
        return HoKhauDetailDTO.builder()
                .hoKhau(hoKhau)
                .thanhVien(thanhVien)
                .khoanDaDong(khoanDaDong)
                .khoanChuaDong(khoanChuaDong)
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<NhanKhauDTO> getThanhVienByHoKhauId(Long hoKhauId) {
        List<NhanKhau> nhanKhauList = nhanKhauRepository.findByHoKhauId(hoKhauId);
        
        return nhanKhauList.stream()
                .map(this::convertNhanKhauToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<NopTienDTO> getKhoanDaDong(Long hoKhauId) {
        List<NopTien> nopTienList = nopTienRepository.findByHoKhauId(hoKhauId);
        
        return nopTienList.stream()
                .map(this::convertNopTienToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<KhoanThuDTO> getKhoanChuaDong(Long hoKhauId) {
        // Lấy tất cả các khoản thu bắt buộc
        List<KhoanThu> allKhoanThuBatBuoc = khoanThuRepository.findKhoanThuBatBuoc();
        
        // Lấy danh sách ID của các khoản đã đóng
        List<NopTien> daDong = nopTienRepository.findByHoKhauId(hoKhauId);
        Set<Long> khoanDaDongIds = daDong.stream()
                .map(nt -> nt.getKhoanThu().getId())
                .collect(Collectors.toSet());
        
        // Lọc ra các khoản chưa đóng
        return allKhoanThuBatBuoc.stream()
                .filter(kt -> !khoanDaDongIds.contains(kt.getId()))
                .map(this::convertKhoanThuToDTO)
                .collect(Collectors.toList());
    }
    
    private NhanKhauDTO convertNhanKhauToDTO(NhanKhau nhanKhau) {
        NhanKhauDTO dto = new NhanKhauDTO();
        dto.setId(nhanKhau.getId());
        dto.setHoKhauId(nhanKhau.getHoKhau() != null ? nhanKhau.getHoKhau().getId() : null);
        dto.setTenChuHo(nhanKhau.getHoKhau() != null ? nhanKhau.getHoKhau().getTenChuHo() : null);
        dto.setHoTen(nhanKhau.getHoTen());
        dto.setNgaySinh(nhanKhau.getNgaySinh());
        dto.setGioiTinh(nhanKhau.getGioiTinh());
        dto.setCmndCccd(nhanKhau.getCmndCccd());
        dto.setQuanHeVoiChuHo(nhanKhau.getQuanHeVoiChuHo());
        dto.setNgheNghiep(nhanKhau.getNgheNghiep());
        return dto;
    }
    
    private NopTienDTO convertNopTienToDTO(NopTien nopTien) {
        NopTienDTO dto = new NopTienDTO();
        dto.setId(nopTien.getId());
        dto.setKhoanThuId(nopTien.getKhoanThu() != null ? nopTien.getKhoanThu().getId() : null);
        dto.setTenKhoanThu(nopTien.getKhoanThu() != null ? nopTien.getKhoanThu().getTenKhoanThu() : null);
        dto.setHoKhauId(nopTien.getHoKhau() != null ? nopTien.getHoKhau().getId() : null);
        dto.setTenChuHo(nopTien.getHoKhau() != null ? nopTien.getHoKhau().getTenChuHo() : null);
        dto.setSoTien(nopTien.getSoTien());
        dto.setNgayNop(nopTien.getNgayNop());
        dto.setNguoiNop(nopTien.getNguoiNop());
        dto.setGhiChu(nopTien.getGhiChu());
        return dto;
    }
    
    private KhoanThuDTO convertKhoanThuToDTO(KhoanThu khoanThu) {
        KhoanThuDTO dto = new KhoanThuDTO();
        dto.setId(khoanThu.getId());
        dto.setTenKhoanThu(khoanThu.getTenKhoanThu());
        dto.setLoaiKhoanThu(khoanThu.getLoaiKhoanThu());
        dto.setDonGia(khoanThu.getDonGia());
        dto.setMoTa(khoanThu.getMoTa());
        dto.setNgayBatDau(khoanThu.getNgayBatDau());
        dto.setNgayKetThuc(khoanThu.getNgayKetThuc());
        return dto;
    }
    
    private HoKhauDTO convertToDTO(HoKhau hoKhau) {
        HoKhauDTO dto = new HoKhauDTO();
        dto.setId(hoKhau.getId());
        dto.setTenChuHo(hoKhau.getTenChuHo());
        dto.setDiaChi(hoKhau.getDiaChi());
        dto.setNgayTao(hoKhau.getNgayTao());
        dto.setTrangThai(hoKhau.getTrangThai());
        
        // Đếm số nhân khẩu trong hộ
        Long soNhanKhau = nhanKhauRepository.countByHoKhauId(hoKhau.getId());
        dto.setSoNhanKhau(soNhanKhau.intValue());
        
        return dto;
    }
}
