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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
    public Page<NopTienDTO> getNopTienPaged(int page, int size, String sortBy, String sortDir,
                                             Long hoKhauId, Long khoanThuId,
                                             LocalDateTime startDate, LocalDateTime endDate,
                                             String searchTerm) {
        // Get all nop tien
        List<NopTien> allNopTien = nopTienRepository.findAll();
        
        // Apply filters
        List<NopTien> filtered = allNopTien.stream()
                .filter(nt -> {
                    // Filter by hoKhauId
                    if (hoKhauId != null && !nt.getHoKhau().getId().equals(hoKhauId)) {
                        return false;
                    }
                    
                    // Filter by khoanThuId
                    if (khoanThuId != null && !nt.getKhoanThu().getId().equals(khoanThuId)) {
                        return false;
                    }
                    
                    // Filter by date range
                    if (startDate != null && nt.getNgayNop().isBefore(startDate)) {
                        return false;
                    }
                    if (endDate != null && nt.getNgayNop().isAfter(endDate)) {
                        return false;
                    }
                    
                    // Filter by search term (nguoiNop or ghiChu)
                    if (searchTerm != null && !searchTerm.isEmpty()) {
                        String search = searchTerm.toLowerCase();
                        boolean matchNguoiNop = nt.getNguoiNop() != null && 
                                nt.getNguoiNop().toLowerCase().contains(search);
                        boolean matchGhiChu = nt.getGhiChu() != null && 
                                nt.getGhiChu().toLowerCase().contains(search);
                        boolean matchTenChuHo = nt.getHoKhau().getTenChuHo() != null && 
                                nt.getHoKhau().getTenChuHo().toLowerCase().contains(search);
                        boolean matchTenKhoanThu = nt.getKhoanThu().getTenKhoanThu() != null && 
                                nt.getKhoanThu().getTenKhoanThu().toLowerCase().contains(search);
                        
                        if (!matchNguoiNop && !matchGhiChu && !matchTenChuHo && !matchTenKhoanThu) {
                            return false;
                        }
                    }
                    
                    return true;
                })
                .collect(Collectors.toList());
        
        // Sort
        if ("desc".equalsIgnoreCase(sortDir)) {
            filtered.sort((a, b) -> {
                if ("id".equals(sortBy)) {
                    return b.getId().compareTo(a.getId());
                } else if ("ngayNop".equals(sortBy)) {
                    return b.getNgayNop().compareTo(a.getNgayNop());
                } else if ("soTien".equals(sortBy)) {
                    return b.getSoTien().compareTo(a.getSoTien());
                }
                return b.getId().compareTo(a.getId());
            });
        } else {
            filtered.sort((a, b) -> {
                if ("id".equals(sortBy)) {
                    return a.getId().compareTo(b.getId());
                } else if ("ngayNop".equals(sortBy)) {
                    return a.getNgayNop().compareTo(b.getNgayNop());
                } else if ("soTien".equals(sortBy)) {
                    return a.getSoTien().compareTo(b.getSoTien());
                }
                return a.getId().compareTo(b.getId());
            });
        }
        
        // Convert to DTO
        List<NopTienDTO> dtoList = filtered.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        // Pagination
        int start = page * size;
        int end = Math.min(start + size, dtoList.size());
        
        if (start > dtoList.size()) {
            return new PageImpl<>(List.of(), PageRequest.of(page, size), dtoList.size());
        }
        
        List<NopTienDTO> pagedList = dtoList.subList(start, end);
        return new PageImpl<>(pagedList, PageRequest.of(page, size), dtoList.size());
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
