package com.bluemoon.bluemoonv1.repository;

import com.bluemoon.bluemoonv1.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    // Tìm log theo entity name và entity id
    List<AuditLog> findByEntityNameAndEntityIdOrderByCreatedAtDesc(String entityName, Long entityId);
    
    // Tìm log theo entity name
    List<AuditLog> findByEntityNameOrderByCreatedAtDesc(String entityName);
    
    // Tìm log theo actor
    List<AuditLog> findByActorOrderByCreatedAtDesc(String actor);
    
    // Tìm log theo action
    List<AuditLog> findByActionOrderByCreatedAtDesc(String action);
    
    // Tìm log trong khoảng thời gian
    @Query("SELECT a FROM AuditLog a WHERE a.createdAt BETWEEN :startDate AND :endDate ORDER BY a.createdAt DESC")
    List<AuditLog> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                    @Param("endDate") LocalDateTime endDate);
    
    // Lấy tất cả log, sắp xếp theo thời gian mới nhất
    List<AuditLog> findAllByOrderByCreatedAtDesc();
}
