package com.bluemoon.bluemoonv1.repository;

import com.bluemoon.bluemoonv1.entity.KhoanThu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface KhoanThuRepository extends JpaRepository<KhoanThu, Long> {
    
    List<KhoanThu> findByLoaiKhoanThu(Integer loaiKhoanThu);
    
    List<KhoanThu> findByTenKhoanThuContaining(String tenKhoanThu);
    
    @Query("SELECT k FROM KhoanThu k WHERE k.ngayBatDau <= :ngay AND (k.ngayKetThuc IS NULL OR k.ngayKetThuc >= :ngay)")
    List<KhoanThu> findActiveKhoanThu(LocalDate ngay);
    
    @Query("SELECT k FROM KhoanThu k WHERE k.loaiKhoanThu = 0")
    List<KhoanThu> findKhoanThuBatBuoc();
    
    @Query("SELECT k FROM KhoanThu k WHERE k.loaiKhoanThu = 1")
    List<KhoanThu> findKhoanThuTuNguyen();
}
