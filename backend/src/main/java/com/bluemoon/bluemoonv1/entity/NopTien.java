package com.bluemoon.bluemoonv1.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "nop_tien")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"khoanThu", "hoKhau"})
@EqualsAndHashCode(exclude = {"khoanThu", "hoKhau"})
public class NopTien {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "khoan_thu_id", nullable = false)
    private KhoanThu khoanThu;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ho_khau_id", nullable = false)
    private HoKhau hoKhau;
    
    @Column(name = "so_tien", nullable = false, precision = 15, scale = 0)
    private BigDecimal soTien;
    
    @Column(name = "ngay_nop")
    private LocalDateTime ngayNop;
    
    @Column(name = "nguoi_nop", length = 100)
    private String nguoiNop;
    
    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;
    
    @PrePersist
    protected void onCreate() {
        if (ngayNop == null) {
            ngayNop = LocalDateTime.now();
        }
    }
}
