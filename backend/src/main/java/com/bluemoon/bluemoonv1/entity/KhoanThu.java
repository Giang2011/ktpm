package com.bluemoon.bluemoonv1.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "khoan_thu")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"danhSachNopTien"})
@EqualsAndHashCode(exclude = {"danhSachNopTien"})
public class KhoanThu {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "ten_khoan_thu", nullable = false, length = 100)
    private String tenKhoanThu;
    
    @Column(name = "loai_khoan_thu", nullable = false)
    private Integer loaiKhoanThu; // 0: Bắt buộc, 1: Tự nguyện
    
    @Column(name = "don_gia", precision = 15, scale = 0)
    private BigDecimal donGia = BigDecimal.ZERO;
    
    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;
    
    @Column(name = "ngay_bat_dau")
    private LocalDate ngayBatDau;
    
    @Column(name = "ngay_ket_thuc")
    private LocalDate ngayKetThuc;
    
    @OneToMany(mappedBy = "khoanThu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NopTien> danhSachNopTien;
}
