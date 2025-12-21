package com.bluemoon.bluemoonv1.service.impl;

import com.bluemoon.bluemoonv1.dto.NhanKhauDTO;
import com.bluemoon.bluemoonv1.dto.NhanKhauRequestDTO;
import com.bluemoon.bluemoonv1.entity.HoKhau;
import com.bluemoon.bluemoonv1.entity.NhanKhau;
import com.bluemoon.bluemoonv1.repository.HoKhauRepository;
import com.bluemoon.bluemoonv1.repository.NhanKhauRepository;
import com.bluemoon.bluemoonv1.service.NhanKhauService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NhanKhauServiceImpl implements NhanKhauService {
    
    private final NhanKhauRepository nhanKhauRepository;
    private final HoKhauRepository hoKhauRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<NhanKhauDTO> getAllNhanKhau() {
        return nhanKhauRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public NhanKhauDTO getNhanKhauById(Long id) {
        NhanKhau nhanKhau = nhanKhauRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nhân khẩu not found with id: " + id));
        return convertToDTO(nhanKhau);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<NhanKhauDTO> getNhanKhauByHoKhauId(Long hoKhauId) {
        return nhanKhauRepository.findByHoKhauId(hoKhauId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<NhanKhauDTO> searchByHoTen(String hoTen) {
        return nhanKhauRepository.findByHoTenContaining(hoTen).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public NhanKhauDTO getByCmndCccd(String cmndCccd) {
        NhanKhau nhanKhau = nhanKhauRepository.findByCmndCccd(cmndCccd)
                .orElseThrow(() -> new RuntimeException("Nhân khẩu not found with CMND/CCCD: " + cmndCccd));
        return convertToDTO(nhanKhau);
    }
    
    @Override
    public NhanKhauDTO createNhanKhau(NhanKhauRequestDTO requestDTO) {
        HoKhau hoKhau = hoKhauRepository.findById(requestDTO.getHoKhauId())
                .orElseThrow(() -> new RuntimeException("Hộ khẩu not found with id: " + requestDTO.getHoKhauId()));
        
        NhanKhau nhanKhau = new NhanKhau();
        nhanKhau.setHoKhau(hoKhau);
        nhanKhau.setHoTen(requestDTO.getHoTen());
        nhanKhau.setNgaySinh(requestDTO.getNgaySinh());
        nhanKhau.setGioiTinh(requestDTO.getGioiTinh());
        nhanKhau.setCmndCccd(requestDTO.getCmndCccd());
        nhanKhau.setQuanHeVoiChuHo(requestDTO.getQuanHeVoiChuHo());
        nhanKhau.setNgheNghiep(requestDTO.getNgheNghiep());
        
        NhanKhau savedNhanKhau = nhanKhauRepository.save(nhanKhau);
        return convertToDTO(savedNhanKhau);
    }
    
    @Override
    public NhanKhauDTO updateNhanKhau(Long id, NhanKhauRequestDTO requestDTO) {
        NhanKhau nhanKhau = nhanKhauRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nhân khẩu not found with id: " + id));
        
        if (requestDTO.getHoKhauId() != null && !requestDTO.getHoKhauId().equals(nhanKhau.getHoKhau().getId())) {
            HoKhau hoKhau = hoKhauRepository.findById(requestDTO.getHoKhauId())
                    .orElseThrow(() -> new RuntimeException("Hộ khẩu not found with id: " + requestDTO.getHoKhauId()));
            nhanKhau.setHoKhau(hoKhau);
        }
        
        nhanKhau.setHoTen(requestDTO.getHoTen());
        nhanKhau.setNgaySinh(requestDTO.getNgaySinh());
        nhanKhau.setGioiTinh(requestDTO.getGioiTinh());
        nhanKhau.setCmndCccd(requestDTO.getCmndCccd());
        nhanKhau.setQuanHeVoiChuHo(requestDTO.getQuanHeVoiChuHo());
        nhanKhau.setNgheNghiep(requestDTO.getNgheNghiep());
        
        NhanKhau updatedNhanKhau = nhanKhauRepository.save(nhanKhau);
        return convertToDTO(updatedNhanKhau);
    }
    
    @Override
    public void deleteNhanKhau(Long id) {
        if (!nhanKhauRepository.existsById(id)) {
            throw new RuntimeException("Nhân khẩu not found with id: " + id);
        }
        nhanKhauRepository.deleteById(id);
    }
    
    private NhanKhauDTO convertToDTO(NhanKhau nhanKhau) {
        NhanKhauDTO dto = new NhanKhauDTO();
        dto.setId(nhanKhau.getId());
        dto.setHoKhauId(nhanKhau.getHoKhau().getId());
        dto.setTenChuHo(nhanKhau.getHoKhau().getTenChuHo());
        dto.setHoTen(nhanKhau.getHoTen());
        dto.setNgaySinh(nhanKhau.getNgaySinh());
        dto.setGioiTinh(nhanKhau.getGioiTinh());
        dto.setCmndCccd(nhanKhau.getCmndCccd());
        dto.setQuanHeVoiChuHo(nhanKhau.getQuanHeVoiChuHo());
        dto.setNgheNghiep(nhanKhau.getNgheNghiep());
        return dto;
    }
}
