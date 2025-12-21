package com.bluemoon.bluemoonv1.service;

import com.bluemoon.bluemoonv1.dto.NhanKhauDTO;
import com.bluemoon.bluemoonv1.dto.NhanKhauRequestDTO;

import java.util.List;

public interface NhanKhauService {
    
    List<NhanKhauDTO> getAllNhanKhau();
    
    NhanKhauDTO getNhanKhauById(Long id);
    
    List<NhanKhauDTO> getNhanKhauByHoKhauId(Long hoKhauId);
    
    List<NhanKhauDTO> searchByHoTen(String hoTen);
    
    NhanKhauDTO getByCmndCccd(String cmndCccd);
    
    NhanKhauDTO createNhanKhau(NhanKhauRequestDTO requestDTO);
    
    NhanKhauDTO updateNhanKhau(Long id, NhanKhauRequestDTO requestDTO);
    
    void deleteNhanKhau(Long id);
}
