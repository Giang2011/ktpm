package com.bluemoon.bluemoonv1.service;

import com.bluemoon.bluemoonv1.dto.NhanKhauDTO;
import com.bluemoon.bluemoonv1.dto.NhanKhauRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NhanKhauService {
    
    List<NhanKhauDTO> getAllNhanKhau();
    
    Page<NhanKhauDTO> getNhanKhauPaged(Pageable pageable);
    
    NhanKhauDTO getNhanKhauById(Long id);
    
    List<NhanKhauDTO> getNhanKhauByHoKhauId(Long hoKhauId);
    
    List<NhanKhauDTO> searchByHoTen(String hoTen);
    
    NhanKhauDTO getByCmndCccd(String cmndCccd);
    
    NhanKhauDTO createNhanKhau(NhanKhauRequestDTO requestDTO);
    
    NhanKhauDTO updateNhanKhau(Long id, NhanKhauRequestDTO requestDTO);
    
    void deleteNhanKhau(Long id);
}
