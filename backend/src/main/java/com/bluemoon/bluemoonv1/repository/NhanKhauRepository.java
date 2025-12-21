package com.bluemoon.bluemoonv1.repository;

import com.bluemoon.bluemoonv1.entity.NhanKhau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NhanKhauRepository extends JpaRepository<NhanKhau, Long> {
    
    List<NhanKhau> findByHoKhauId(Long hoKhauId);
    
    List<NhanKhau> findByHoTenContaining(String hoTen);
    
    Optional<NhanKhau> findByCmndCccd(String cmndCccd);
    
    List<NhanKhau> findByGioiTinh(String gioiTinh);
    
    @Query("SELECT COUNT(n) FROM NhanKhau n WHERE n.hoKhau.id = :hoKhauId")
    Long countByHoKhauId(@Param("hoKhauId") Long hoKhauId);
}
