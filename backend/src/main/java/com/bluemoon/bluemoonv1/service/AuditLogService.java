package com.bluemoon.bluemoonv1.service;

import com.bluemoon.bluemoonv1.dto.AuditLogDTO;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditLogService {
    
    /**
     * Ghi log khi tạo mới entity
     */
    void logCreate(String actor, String entityName, Long entityId, Object newData);
    
    /**
     * Ghi log khi cập nhật entity
     */
    void logUpdate(String actor, String entityName, Long entityId, Object oldData, Object newData);
    
    /**
     * Ghi log khi xóa entity
     */
    void logDelete(String actor, String entityName, Long entityId, Object oldData);
    
    /**
     * Lấy tất cả log
     */
    List<AuditLogDTO> getAllLogs();
    
    /**
     * Lấy log với pagination và filter theo ngày
     */
    Page<AuditLogDTO> getLogsPaged(int page, int size, String sortBy, String sortDir,
                                    LocalDateTime startDate, LocalDateTime endDate,
                                    String searchTerm);
    
    /**
     * Lấy log theo entity name và entity id
     */
    List<AuditLogDTO> getLogsByEntity(String entityName, Long entityId);
    
    /**
     * Lấy log theo entity name
     */
    List<AuditLogDTO> getLogsByEntityName(String entityName);
    
    /**
     * Lấy log theo actor
     */
    List<AuditLogDTO> getLogsByActor(String actor);
    
    /**
     * Lấy log theo action
     */
    List<AuditLogDTO> getLogsByAction(String action);
    
    /**
     * Lấy log trong khoảng thời gian
     */
    List<AuditLogDTO> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate);
}
