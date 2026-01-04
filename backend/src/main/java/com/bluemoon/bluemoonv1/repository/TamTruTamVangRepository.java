package com.bluemoon.bluemoonv1.repository;

import com.bluemoon.bluemoonv1.entity.TamTruTamVang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TamTruTamVangRepository extends JpaRepository<TamTruTamVang, Long> {
    
    List<TamTruTamVang> findByNhanKhauId(Long nhanKhauId);
    
    List<TamTruTamVang> findBySoDienThoaiContaining(String soDienThoai);
    
    @Query("SELECT t FROM TamTruTamVang t WHERE t.ngayBatDau <= :date AND t.ngayKetThuc >= :date")
    List<TamTruTamVang> findActiveByDate(@Param("date") LocalDate date);
    
    @Query("SELECT t FROM TamTruTamVang t WHERE t.nhanKhau.hoTen LIKE %:keyword% OR t.soDienThoai LIKE %:keyword%")
    List<TamTruTamVang> searchByKeyword(@Param("keyword") String keyword);
}
