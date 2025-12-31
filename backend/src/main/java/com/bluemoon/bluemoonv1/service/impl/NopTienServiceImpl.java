package com.bluemoon.bluemoonv1.service.impl;

import com.bluemoon.bluemoonv1.annotation.AuditLog;
import com.bluemoon.bluemoonv1.dto.NopTienDTO;
import com.bluemoon.bluemoonv1.dto.NopTienRequestDTO;
import com.bluemoon.bluemoonv1.entity.AuditAction;
import com.bluemoon.bluemoonv1.entity.HoKhau;
import com.bluemoon.bluemoonv1.entity.KhoanThu;
import com.bluemoon.bluemoonv1.entity.NopTien;
import com.bluemoon.bluemoonv1.repository.HoKhauRepository;
import com.bluemoon.bluemoonv1.repository.KhoanThuRepository;
import com.bluemoon.bluemoonv1.repository.NopTienRepository;
import com.bluemoon.bluemoonv1.service.NopTienService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NopTienServiceImpl implements NopTienService {
    
    private final NopTienRepository nopTienRepository;
    private final HoKhauRepository hoKhauRepository;
    private final KhoanThuRepository khoanThuRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<NopTienDTO> getAllNopTien() {
        return nopTienRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public NopTienDTO getNopTienById(Long id) {
        NopTien nopTien = nopTienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nộp tiền not found with id: " + id));
        return convertToDTO(nopTien);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<NopTienDTO> getNopTienByHoKhauId(Long hoKhauId) {
        return nopTienRepository.findByHoKhauId(hoKhauId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<NopTienDTO> getNopTienByKhoanThuId(Long khoanThuId) {
        return nopTienRepository.findByKhoanThuId(khoanThuId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<NopTienDTO> getNopTienByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return nopTienRepository.findByNgayNopBetween(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public BigDecimal getTongTienByKhoanThuId(Long khoanThuId) {
        BigDecimal total = nopTienRepository.sumByKhoanThuId(khoanThuId);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    @Override
    @Transactional(readOnly = true)
    public BigDecimal getTongTienByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        BigDecimal total = nopTienRepository.sumByDateRange(startDate, endDate);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    @Override
    @AuditLog(tableName = "nop_tien", action = AuditAction.CREATE)
    public NopTienDTO createNopTien(NopTienRequestDTO requestDTO) {
        KhoanThu khoanThu = khoanThuRepository.findById(requestDTO.getKhoanThuId())
                .orElseThrow(() -> new RuntimeException("Khoản thu not found with id: " + requestDTO.getKhoanThuId()));
        
        HoKhau hoKhau = hoKhauRepository.findById(requestDTO.getHoKhauId())
                .orElseThrow(() -> new RuntimeException("Hộ khẩu not found with id: " + requestDTO.getHoKhauId()));
        
        NopTien nopTien = new NopTien();
        nopTien.setKhoanThu(khoanThu);
        nopTien.setHoKhau(hoKhau);
        nopTien.setSoTien(requestDTO.getSoTien());
        nopTien.setNguoiNop(requestDTO.getNguoiNop());
        nopTien.setGhiChu(requestDTO.getGhiChu());
        
        NopTien savedNopTien = nopTienRepository.save(nopTien);
        return convertToDTO(savedNopTien);
    }
    
    @Override
    @AuditLog(tableName = "nop_tien", action = AuditAction.UPDATE)
    public NopTienDTO updateNopTien(Long id, NopTienRequestDTO requestDTO) {
        NopTien nopTien = nopTienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nộp tiền not found with id: " + id));
        
        if (requestDTO.getKhoanThuId() != null && !requestDTO.getKhoanThuId().equals(nopTien.getKhoanThu().getId())) {
            KhoanThu khoanThu = khoanThuRepository.findById(requestDTO.getKhoanThuId())
                    .orElseThrow(() -> new RuntimeException("Khoản thu not found with id: " + requestDTO.getKhoanThuId()));
            nopTien.setKhoanThu(khoanThu);
        }
        
        if (requestDTO.getHoKhauId() != null && !requestDTO.getHoKhauId().equals(nopTien.getHoKhau().getId())) {
            HoKhau hoKhau = hoKhauRepository.findById(requestDTO.getHoKhauId())
                    .orElseThrow(() -> new RuntimeException("Hộ khẩu not found with id: " + requestDTO.getHoKhauId()));
            nopTien.setHoKhau(hoKhau);
        }
        
        nopTien.setSoTien(requestDTO.getSoTien());
        nopTien.setNguoiNop(requestDTO.getNguoiNop());
        nopTien.setGhiChu(requestDTO.getGhiChu());
        
        NopTien updatedNopTien = nopTienRepository.save(nopTien);
        return convertToDTO(updatedNopTien);
    }
    
    @Override
    @AuditLog(tableName = "nop_tien", action = AuditAction.DELETE)
    public void deleteNopTien(Long id) {
        NopTien nopTien = nopTienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nộp tiền not found with id: " + id));
        
        nopTienRepository.deleteById(id);
    }
    
    private NopTienDTO convertToDTO(NopTien nopTien) {
        NopTienDTO dto = new NopTienDTO();
        dto.setId(nopTien.getId());
        dto.setKhoanThuId(nopTien.getKhoanThu().getId());
        dto.setTenKhoanThu(nopTien.getKhoanThu().getTenKhoanThu());
        dto.setHoKhauId(nopTien.getHoKhau().getId());
        dto.setTenChuHo(nopTien.getHoKhau().getTenChuHo());
        dto.setSoTien(nopTien.getSoTien());
        dto.setNgayNop(nopTien.getNgayNop());
        dto.setNguoiNop(nopTien.getNguoiNop());
        dto.setGhiChu(nopTien.getGhiChu());
        return dto;
    }
}
