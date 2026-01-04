package com.bluemoon.bluemoonv1.service.impl;

import com.bluemoon.bluemoonv1.annotation.AuditLog;
import com.bluemoon.bluemoonv1.dto.TamTruTamVangDTO;
import com.bluemoon.bluemoonv1.dto.TamTruTamVangRequestDTO;
import com.bluemoon.bluemoonv1.entity.AuditAction;
import com.bluemoon.bluemoonv1.entity.NhanKhau;
import com.bluemoon.bluemoonv1.entity.TamTruTamVang;
import com.bluemoon.bluemoonv1.repository.NhanKhauRepository;
import com.bluemoon.bluemoonv1.repository.TamTruTamVangRepository;
import com.bluemoon.bluemoonv1.service.TamTruTamVangService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TamTruTamVangServiceImpl implements TamTruTamVangService {
    
    private final TamTruTamVangRepository tamTruTamVangRepository;
    private final NhanKhauRepository nhanKhauRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<TamTruTamVangDTO> getAllTamTruTamVang() {
        return tamTruTamVangRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<TamTruTamVangDTO> getTamTruTamVangPaged(Pageable pageable) {
        return tamTruTamVangRepository.findAll(pageable)
                .map(this::convertToDTO);
    }
    
    @Override
    @Transactional(readOnly = true)
    public TamTruTamVangDTO getTamTruTamVangById(Long id) {
        TamTruTamVang tamTruTamVang = tamTruTamVangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tạm trú tạm vắng not found with id: " + id));
        return convertToDTO(tamTruTamVang);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TamTruTamVangDTO> getTamTruTamVangByNhanKhauId(Long nhanKhauId) {
        return tamTruTamVangRepository.findByNhanKhauId(nhanKhauId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TamTruTamVangDTO> searchByKeyword(String keyword) {
        return tamTruTamVangRepository.searchByKeyword(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TamTruTamVangDTO> getActiveByDate(LocalDate date) {
        return tamTruTamVangRepository.findActiveByDate(date).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @AuditLog(tableName = "tam_tru_tam_vang", action = AuditAction.CREATE)
    public TamTruTamVangDTO createTamTruTamVang(TamTruTamVangRequestDTO requestDTO) {
        NhanKhau nhanKhau = nhanKhauRepository.findById(requestDTO.getNhanKhauId())
                .orElseThrow(() -> new RuntimeException("Nhân khẩu not found with id: " + requestDTO.getNhanKhauId()));
        
        TamTruTamVang tamTruTamVang = new TamTruTamVang();
        tamTruTamVang.setNhanKhau(nhanKhau);
        tamTruTamVang.setLoaiTamTru(requestDTO.getLoaiTamTru());
        tamTruTamVang.setDiaChi(requestDTO.getDiaChi());
        tamTruTamVang.setSoDienThoai(requestDTO.getSoDienThoai());
        tamTruTamVang.setNgayBatDau(requestDTO.getNgayBatDau());
        tamTruTamVang.setNgayKetThuc(requestDTO.getNgayKetThuc());
        tamTruTamVang.setLyDo(requestDTO.getLyDo());
        
        TamTruTamVang savedTamTruTamVang = tamTruTamVangRepository.save(tamTruTamVang);
        return convertToDTO(savedTamTruTamVang);
    }
    
    @Override
    @AuditLog(tableName = "tam_tru_tam_vang", action = AuditAction.UPDATE)
    public TamTruTamVangDTO updateTamTruTamVang(Long id, TamTruTamVangRequestDTO requestDTO) {
        TamTruTamVang tamTruTamVang = tamTruTamVangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tạm trú tạm vắng not found with id: " + id));
        
        if (requestDTO.getNhanKhauId() != null && !requestDTO.getNhanKhauId().equals(tamTruTamVang.getNhanKhau().getId())) {
            NhanKhau nhanKhau = nhanKhauRepository.findById(requestDTO.getNhanKhauId())
                    .orElseThrow(() -> new RuntimeException("Nhân khẩu not found with id: " + requestDTO.getNhanKhauId()));
            tamTruTamVang.setNhanKhau(nhanKhau);
        }
        
        tamTruTamVang.setLoaiTamTru(requestDTO.getLoaiTamTru());
        tamTruTamVang.setSoDienThoai(requestDTO.getSoDienThoai());
        tamTruTamVang.setNgayBatDau(requestDTO.getNgayBatDau());
        tamTruTamVang.setNgayKetThuc(requestDTO.getNgayKetThuc());
        tamTruTamVang.setLyDo(requestDTO.getLyDo());
        
        TamTruTamVang updatedTamTruTamVang = tamTruTamVangRepository.save(tamTruTamVang);
        return convertToDTO(updatedTamTruTamVang);
    }
    
    @Override
    @AuditLog(tableName = "tam_tru_tam_vang", action = AuditAction.DELETE)
    public void deleteTamTruTamVang(Long id) {
        TamTruTamVang tamTruTamVang = tamTruTamVangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tạm trú tạm vắng not found with id: " + id));
        
        tamTruTamVangRepository.deleteById(id);
    }
    
    private TamTruTamVangDTO convertToDTO(TamTruTamVang tamTruTamVang) {
        TamTruTamVangDTO dto = new TamTruTamVangDTO();
        dto.setId(tamTruTamVang.getId());
        dto.setNhanKhauId(tamTruTamVang.getNhanKhau().getId());
        dto.setHoTenNhanKhau(tamTruTamVang.getNhanKhau().getHoTen());
        dto.setCmndCccdNhanKhau(tamTruTamVang.getNhanKhau().getCmndCccd());
        dto.setLoaiTamTru(tamTruTamVang.getLoaiTamTru());
        dto.setDiaChi(tamTruTamVang.getDiaChi());
        dto.setSoDienThoai(tamTruTamVang.getSoDienThoai());
        dto.setNgayBatDau(tamTruTamVang.getNgayBatDau());
        dto.setNgayKetThuc(tamTruTamVang.getNgayKetThuc());
        dto.setLyDo(tamTruTamVang.getLyDo());
        return dto;
    }
}
