package com.bluemoon.bluemoonv1.service.impl;

import com.bluemoon.bluemoonv1.dto.HoKhauDTO;
import com.bluemoon.bluemoonv1.dto.HoKhauRequestDTO;
import com.bluemoon.bluemoonv1.entity.HoKhau;
import com.bluemoon.bluemoonv1.repository.HoKhauRepository;
import com.bluemoon.bluemoonv1.repository.NhanKhauRepository;
import com.bluemoon.bluemoonv1.service.HoKhauService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class HoKhauServiceImpl implements HoKhauService {
    
    private final HoKhauRepository hoKhauRepository;
    private final NhanKhauRepository nhanKhauRepository;
    
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
    public HoKhauDTO createHoKhau(HoKhauRequestDTO requestDTO) {
        HoKhau hoKhau = new HoKhau();
        hoKhau.setTenChuHo(requestDTO.getTenChuHo());
        hoKhau.setDiaChi(requestDTO.getDiaChi());
        hoKhau.setTrangThai(requestDTO.getTrangThai() != null ? requestDTO.getTrangThai() : 1);
        
        HoKhau savedHoKhau = hoKhauRepository.save(hoKhau);
        return convertToDTO(savedHoKhau);
    }
    
    @Override
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
    public void deleteHoKhau(Long id) {
        if (!hoKhauRepository.existsById(id)) {
            throw new RuntimeException("Hộ khẩu not found with id: " + id);
        }
        hoKhauRepository.deleteById(id);
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
