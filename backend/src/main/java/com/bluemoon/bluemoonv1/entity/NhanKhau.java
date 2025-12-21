package com.bluemoon.bluemoonv1.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "nhan_khau")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"hoKhau"})
@EqualsAndHashCode(exclude = {"hoKhau"})
public class NhanKhau {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ho_khau_id")
    private HoKhau hoKhau;
    
    @Column(name = "ho_ten", nullable = false, length = 100)
    private String hoTen;
    
    @Column(name = "ngay_sinh", nullable = false)
    private LocalDate ngaySinh;
    
    @Column(name = "gioi_tinh", nullable = false, length = 10)
    private String gioiTinh;
    
    @Column(name = "cmnd_cccd", length = 20)
    private String cmndCccd;
    
    @Column(name = "quan_he_voi_chu_ho", length = 50)
    private String quanHeVoiChuHo;
    
    @Column(name = "nghe_nghiep", length = 100)
    private String ngheNghiep;
}
