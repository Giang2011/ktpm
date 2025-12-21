package com.bluemoon.bluemoonv1.repository;

import com.bluemoon.bluemoonv1.entity.HoKhau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoKhauRepository extends JpaRepository<HoKhau, Long> {
    
    List<HoKhau> findByTrangThai(Integer trangThai);
    
    List<HoKhau> findByTenChuHoContaining(String tenChuHo);
    
    List<HoKhau> findByDiaChiContaining(String diaChi);
    
    @Query("SELECT h FROM HoKhau h WHERE h.trangThai = 1")
    List<HoKhau> findAllActive();
}
