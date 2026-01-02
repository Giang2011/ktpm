package com.bluemoon.bluemoonv1.service;

import com.bluemoon.bluemoonv1.dto.NopTienDTO;
import com.bluemoon.bluemoonv1.dto.NopTienRequestDTO;

import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface NopTienService {
    
    List<NopTienDTO> getAllNopTien();
    
    Page<NopTienDTO> getNopTienPaged(int page, int size, String sortBy, String sortDir, 
                                      Long hoKhauId, Long khoanThuId, 
                                      LocalDateTime startDate, LocalDateTime endDate, 
                                      String searchTerm);
    
    NopTienDTO getNopTienById(Long id);
    
    List<NopTienDTO> getNopTienByHoKhauId(Long hoKhauId);
    
    List<NopTienDTO> getNopTienByKhoanThuId(Long khoanThuId);
    
    List<NopTienDTO> getNopTienByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    BigDecimal getTongTienByKhoanThuId(Long khoanThuId);
    
    BigDecimal getTongTienByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    NopTienDTO createNopTien(NopTienRequestDTO requestDTO);
    
    NopTienDTO updateNopTien(Long id, NopTienRequestDTO requestDTO);
    
    void deleteNopTien(Long id);
}
