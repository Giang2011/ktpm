package com.bluemoon.bluemoonv1.service.impl;

import com.bluemoon.bluemoonv1.annotation.AuditLog;
import com.bluemoon.bluemoonv1.dto.*;
import com.bluemoon.bluemoonv1.entity.*;
import com.bluemoon.bluemoonv1.repository.*;
import com.bluemoon.bluemoonv1.service.KhoanThuService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class KhoanThuServiceImpl implements KhoanThuService {
    
    private final KhoanThuRepository khoanThuRepository;
    private final NopTienRepository nopTienRepository;
    private final HoKhauRepository hoKhauRepository;
    private final NhanKhauRepository nhanKhauRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<KhoanThuDTO> getAllKhoanThu() {
        return khoanThuRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public KhoanThuDTO getKhoanThuById(Long id) {
        KhoanThu khoanThu = khoanThuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khoản thu not found with id: " + id));
        return convertToDTO(khoanThu);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<KhoanThuDTO> getKhoanThuBatBuoc() {
        return khoanThuRepository.findKhoanThuBatBuoc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<KhoanThuDTO> getKhoanThuTuNguyen() {
        return khoanThuRepository.findKhoanThuTuNguyen().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<KhoanThuDTO> getActiveKhoanThu(LocalDate ngay) {
        return khoanThuRepository.findActiveKhoanThu(ngay).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @AuditLog(tableName = "khoan_thu", action = AuditAction.CREATE)
    public KhoanThuDTO createKhoanThu(KhoanThuRequestDTO requestDTO) {
        KhoanThu khoanThu = new KhoanThu();
        khoanThu.setTenKhoanThu(requestDTO.getTenKhoanThu());
        khoanThu.setLoaiKhoanThu(requestDTO.getLoaiKhoanThu());
        khoanThu.setDonGia(requestDTO.getDonGia() != null ? requestDTO.getDonGia() : BigDecimal.ZERO);
        khoanThu.setMoTa(requestDTO.getMoTa());
        khoanThu.setNgayBatDau(requestDTO.getNgayBatDau());
        khoanThu.setNgayKetThuc(requestDTO.getNgayKetThuc());
        
        KhoanThu savedKhoanThu = khoanThuRepository.save(khoanThu);
        return convertToDTO(savedKhoanThu);
    }
    
    @Override
    @AuditLog(tableName = "khoan_thu", action = AuditAction.UPDATE)
    public KhoanThuDTO updateKhoanThu(Long id, KhoanThuRequestDTO requestDTO) {
        KhoanThu khoanThu = khoanThuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khoản thu not found with id: " + id));
        
        khoanThu.setTenKhoanThu(requestDTO.getTenKhoanThu());
        khoanThu.setLoaiKhoanThu(requestDTO.getLoaiKhoanThu());
        khoanThu.setDonGia(requestDTO.getDonGia() != null ? requestDTO.getDonGia() : BigDecimal.ZERO);
        khoanThu.setMoTa(requestDTO.getMoTa());
        khoanThu.setNgayBatDau(requestDTO.getNgayBatDau());
        khoanThu.setNgayKetThuc(requestDTO.getNgayKetThuc());
        
        KhoanThu updatedKhoanThu = khoanThuRepository.save(khoanThu);
        return convertToDTO(updatedKhoanThu);
    }
    
    @Override
    @AuditLog(tableName = "khoan_thu", action = AuditAction.DELETE)
    public void deleteKhoanThu(Long id) {
        KhoanThu khoanThu = khoanThuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khoản thu not found with id: " + id));
        
        khoanThuRepository.deleteById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public KhoanThuDetailDTO getKhoanThuChiTiet(Long khoanThuId) {
        // Lấy thông tin khoản thu
        KhoanThuDTO khoanThu = getKhoanThuById(khoanThuId);
        
        // Lấy danh sách hộ đã đóng
        List<HoKhauDTO> hoDaDong = getHoDaDongByKhoanThuId(khoanThuId);
        
        // Lấy danh sách hộ chưa đóng (chỉ với khoản bắt buộc)
        List<HoKhauDTO> hoChuaDong = getHoChuaDongByKhoanThuId(khoanThuId);
        
        // Lấy tổng tiền đã thu
        BigDecimal tongTien = getTongThuByKhoanThuId(khoanThuId);
        
        return KhoanThuDetailDTO.builder()
                .khoanThu(khoanThu)
                .hoDaDong(hoDaDong)
                .hoChuaDong(hoChuaDong)
                .tongTienDaThu(tongTien)
                .soHoDaDong(hoDaDong.size())
                .soHoChuaDong(hoChuaDong != null ? hoChuaDong.size() : null)
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<HoKhauDTO> getHoDaDongByKhoanThuId(Long khoanThuId) {
        // Lấy danh sách NopTien theo khoanThuId
        List<NopTien> nopTienList = nopTienRepository.findByKhoanThuId(khoanThuId);
        
        // Lấy danh sách hoKhauId đã đóng (distinct)
        Set<Long> hoKhauIds = nopTienList.stream()
                .map(nt -> nt.getHoKhau().getId())
                .collect(Collectors.toSet());
        
        // Lấy thông tin chi tiết các hộ khẩu
        return hoKhauIds.stream()
                .map(hoKhauRepository::findById)
                .filter(opt -> opt.isPresent())
                .map(opt -> convertHoKhauToDTO(opt.get()))
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<HoKhauDTO> getHoChuaDongByKhoanThuId(Long khoanThuId) {
        // Kiểm tra xem khoản thu có phải là bắt buộc không
        KhoanThu khoanThu = khoanThuRepository.findById(khoanThuId)
                .orElseThrow(() -> new RuntimeException("Khoản thu not found with id: " + khoanThuId));
        
        // Chỉ áp dụng cho khoản bắt buộc (loaiKhoanThu = 0)
        if (khoanThu.getLoaiKhoanThu() != 0) {
            return null; // Không áp dụng cho khoản tự nguyện
        }
        
        // Lấy tất cả hộ khẩu active
        List<HoKhau> allHoKhau = hoKhauRepository.findAllActive();
        
        // Lấy danh sách hộ đã đóng
        List<NopTien> daDong = nopTienRepository.findByKhoanThuId(khoanThuId);
        Set<Long> hoDaDongIds = daDong.stream()
                .map(nt -> nt.getHoKhau().getId())
                .collect(Collectors.toSet());
        
        // Lọc ra các hộ chưa đóng
        return allHoKhau.stream()
                .filter(hk -> !hoDaDongIds.contains(hk.getId()))
                .map(this::convertHoKhauToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public BigDecimal getTongThuByKhoanThuId(Long khoanThuId) {
        BigDecimal tongThu = nopTienRepository.sumByKhoanThuId(khoanThuId);
        return tongThu != null ? tongThu : BigDecimal.ZERO;
    }
    
    private HoKhauDTO convertHoKhauToDTO(HoKhau hoKhau) {
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
    
    private KhoanThuDTO convertToDTO(KhoanThu khoanThu) {
        KhoanThuDTO dto = new KhoanThuDTO();
        dto.setId(khoanThu.getId());
        dto.setTenKhoanThu(khoanThu.getTenKhoanThu());
        dto.setLoaiKhoanThu(khoanThu.getLoaiKhoanThu());
        dto.setDonGia(khoanThu.getDonGia());
        dto.setMoTa(khoanThu.getMoTa());
        dto.setNgayBatDau(khoanThu.getNgayBatDau());
        dto.setNgayKetThuc(khoanThu.getNgayKetThuc());
        
        // Tính tổng tiền đã thu được
        BigDecimal tongThu = nopTienRepository.sumByKhoanThuId(khoanThu.getId());
        dto.setTongThuDuoc(tongThu != null ? tongThu : BigDecimal.ZERO);
        
        // Đếm số hộ đã đóng
        Long soHoDaDong = nopTienRepository.countByKhoanThuId(khoanThu.getId());
        dto.setSoHoDaDong(soHoDaDong != null ? soHoDaDong : 0L);
        
        return dto;
    }
}
