package com.bluemoon.bluemoonv1.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "ho_khau")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"danhSachNhanKhau", "danhSachNopTien"})
@EqualsAndHashCode(exclude = {"danhSachNhanKhau", "danhSachNopTien"})
public class HoKhau {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "ten_chu_ho", nullable = false, length = 100)
    private String tenChuHo;
    
    @Column(name = "dia_chi", nullable = false, length = 255)
    private String diaChi;
    
    @Column(name = "ngay_tao")
    private LocalDate ngayTao;
    
    @Column(name = "trang_thai")
    private Integer trangThai = 1; // 1: Đang ở, 0: Đã chuyển đi
    
    @OneToMany(mappedBy = "hoKhau", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NhanKhau> danhSachNhanKhau;
    
    @OneToMany(mappedBy = "hoKhau", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NopTien> danhSachNopTien;
    
    @PrePersist
    protected void onCreate() {
        if (ngayTao == null) {
            ngayTao = LocalDate.now();
        }
    }
}
