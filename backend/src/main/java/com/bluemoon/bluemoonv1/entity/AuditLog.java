package com.bluemoon.bluemoonv1.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "actor", nullable = false, length = 50)
    private String actor; // ADMIN hoặc ACCOUNTANT
    
    @Column(name = "action", nullable = false, length = 20)
    private String action; // CREATE, UPDATE, DELETE
    
    @Column(name = "entity_name", nullable = false, length = 50)
    private String entityName; // ho_khau, nhan_khau, khoan_thu, nop_tien
    
    @Column(name = "entity_id", nullable = false)
    private Long entityId;
    
    @Column(name = "old_data", columnDefinition = "JSON")
    @JdbcTypeCode(SqlTypes.JSON)
    private String oldData; // JSON string của dữ liệu cũ
    
    @Column(name = "new_data", columnDefinition = "JSON")
    @JdbcTypeCode(SqlTypes.JSON)
    private String newData; // JSON string của dữ liệu mới
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (actor == null) {
            actor = "SYSTEM"; // Default nếu không có thông tin user
        }
    }
}
