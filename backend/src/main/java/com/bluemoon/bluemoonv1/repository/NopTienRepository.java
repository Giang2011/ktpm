package com.bluemoon.bluemoonv1.repository;

import com.bluemoon.bluemoonv1.entity.NopTien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NopTienRepository extends JpaRepository<NopTien, Long> {
    
    List<NopTien> findByHoKhauId(Long hoKhauId);
    
    List<NopTien> findByKhoanThuId(Long khoanThuId);
    
    List<NopTien> findByNgayNopBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT n FROM NopTien n WHERE n.hoKhau.id = :hoKhauId AND n.khoanThu.id = :khoanThuId")
    List<NopTien> findByHoKhauAndKhoanThu(@Param("hoKhauId") Long hoKhauId, @Param("khoanThuId") Long khoanThuId);
    
    @Query("SELECT SUM(n.soTien) FROM NopTien n WHERE n.khoanThu.id = :khoanThuId")
    BigDecimal sumByKhoanThuId(@Param("khoanThuId") Long khoanThuId);
    
    @Query("SELECT SUM(n.soTien) FROM NopTien n WHERE n.ngayNop BETWEEN :startDate AND :endDate")
    BigDecimal sumByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(n) FROM NopTien n WHERE n.khoanThu.id = :khoanThuId")
    Long countByKhoanThuId(@Param("khoanThuId") Long khoanThuId);
}
