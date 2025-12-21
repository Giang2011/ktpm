package com.bluemoon.bluemoonv1.service;

import com.bluemoon.bluemoonv1.dto.KhoanThuDTO;
import com.bluemoon.bluemoonv1.dto.KhoanThuRequestDTO;

import java.time.LocalDate;
import java.util.List;

public interface KhoanThuService {
    
    List<KhoanThuDTO> getAllKhoanThu();
    
    KhoanThuDTO getKhoanThuById(Long id);
    
    List<KhoanThuDTO> getKhoanThuBatBuoc();
    
    List<KhoanThuDTO> getKhoanThuTuNguyen();
    
    List<KhoanThuDTO> getActiveKhoanThu(LocalDate ngay);
    
    KhoanThuDTO createKhoanThu(KhoanThuRequestDTO requestDTO);
    
    KhoanThuDTO updateKhoanThu(Long id, KhoanThuRequestDTO requestDTO);
    
    void deleteKhoanThu(Long id);
}
