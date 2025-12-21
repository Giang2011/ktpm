package com.bluemoon.bluemoonv1.service;

import com.bluemoon.bluemoonv1.dto.HoKhauDTO;
import com.bluemoon.bluemoonv1.dto.HoKhauRequestDTO;

import java.util.List;

public interface HoKhauService {
    
    List<HoKhauDTO> getAllHoKhau();
    
    HoKhauDTO getHoKhauById(Long id);
    
    List<HoKhauDTO> getActiveHoKhau();
    
    List<HoKhauDTO> searchByTenChuHo(String tenChuHo);
    
    List<HoKhauDTO> searchByDiaChi(String diaChi);
    
    HoKhauDTO createHoKhau(HoKhauRequestDTO requestDTO);
    
    HoKhauDTO updateHoKhau(Long id, HoKhauRequestDTO requestDTO);
    
    void deleteHoKhau(Long id);
}
