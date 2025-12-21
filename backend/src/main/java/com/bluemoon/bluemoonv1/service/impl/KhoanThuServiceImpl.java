package com.bluemoon.bluemoonv1.service.impl;

import com.bluemoon.bluemoonv1.dto.KhoanThuDTO;
import com.bluemoon.bluemoonv1.dto.KhoanThuRequestDTO;
import com.bluemoon.bluemoonv1.entity.KhoanThu;
import com.bluemoon.bluemoonv1.repository.KhoanThuRepository;
import com.bluemoon.bluemoonv1.repository.NopTienRepository;
import com.bluemoon.bluemoonv1.service.KhoanThuService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class KhoanThuServiceImpl implements KhoanThuService {
    
    private final KhoanThuRepository khoanThuRepository;
    private final NopTienRepository nopTienRepository;
    
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
    public void deleteKhoanThu(Long id) {
        if (!khoanThuRepository.existsById(id)) {
            throw new RuntimeException("Khoản thu not found with id: " + id);
        }
        khoanThuRepository.deleteById(id);
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
