package com.bluemoon.bluemoonv1.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "tam_tru_tam_vang")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"nhanKhau"})
@EqualsAndHashCode(exclude = {"nhanKhau"})
public class TamTruTamVang {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_khau_id", nullable = false)
    private NhanKhau nhanKhau;
    
    @Column(name = "loai_tam_tru", nullable = false)
    private Integer loaiTamTru; // 0: Tạm trú, 1: Tạm vắng
    
    @Column(name = "dia_chi", length = 255)
    private String diaChi; // Địa chỉ (chỉ bắt buộc khi tạm trú)
    
    @Column(name = "so_dien_thoai", nullable = false, length = 15)
    private String soDienThoai;
    
    @Column(name = "ngay_bat_dau", nullable = false)
    private LocalDate ngayBatDau;
    
    @Column(name = "ngay_ket_thuc", nullable = false)
    private LocalDate ngayKetThuc;
    
    @Column(name = "ly_do", nullable = false, columnDefinition = "TEXT")
    private String lyDo;
}
