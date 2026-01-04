package com.bluemoon.bluemoonv1.service;

import com.bluemoon.bluemoonv1.dto.TamTruTamVangDTO;
import com.bluemoon.bluemoonv1.dto.TamTruTamVangRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface TamTruTamVangService {
    
    List<TamTruTamVangDTO> getAllTamTruTamVang();
    
    Page<TamTruTamVangDTO> getTamTruTamVangPaged(Pageable pageable);
    
    TamTruTamVangDTO getTamTruTamVangById(Long id);
    
    List<TamTruTamVangDTO> getTamTruTamVangByNhanKhauId(Long nhanKhauId);
    
    List<TamTruTamVangDTO> searchByKeyword(String keyword);
    
    List<TamTruTamVangDTO> getActiveByDate(LocalDate date);
    
    TamTruTamVangDTO createTamTruTamVang(TamTruTamVangRequestDTO requestDTO);
    
    TamTruTamVangDTO updateTamTruTamVang(Long id, TamTruTamVangRequestDTO requestDTO);
    
    void deleteTamTruTamVang(Long id);
}
