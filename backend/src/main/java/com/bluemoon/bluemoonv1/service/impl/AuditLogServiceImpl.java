package com.bluemoon.bluemoonv1.service.impl;

import com.bluemoon.bluemoonv1.dto.AuditLogDTO;
import com.bluemoon.bluemoonv1.entity.AuditLog;
import com.bluemoon.bluemoonv1.repository.AuditLogRepository;
import com.bluemoon.bluemoonv1.service.AuditLogService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuditLogServiceImpl implements AuditLogService {
    
    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    
    @Override
    public void logCreate(String actor, String entityName, Long entityId, Object newData) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .actor(actor != null ? actor : "SYSTEM")
                    .action("CREATE")
                    .entityName(entityName)
                    .entityId(entityId)
                    .newData(objectMapper.writeValueAsString(newData))
                    .build();
            
            auditLogRepository.save(auditLog);
            log.info("Logged CREATE action for {} with id {}", entityName, entityId);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize new data for logging", e);
        }
    }
    
    @Override
    public void logUpdate(String actor, String entityName, Long entityId, Object oldData, Object newData) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .actor(actor != null ? actor : "SYSTEM")
                    .action("UPDATE")
                    .entityName(entityName)
                    .entityId(entityId)
                    .oldData(objectMapper.writeValueAsString(oldData))
                    .newData(objectMapper.writeValueAsString(newData))
                    .build();
            
            auditLogRepository.save(auditLog);
            log.info("Logged UPDATE action for {} with id {}", entityName, entityId);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize data for logging", e);
        }
    }
    
    @Override
    public void logDelete(String actor, String entityName, Long entityId, Object oldData) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .actor(actor != null ? actor : "SYSTEM")
                    .action("DELETE")
                    .entityName(entityName)
                    .entityId(entityId)
                    .oldData(objectMapper.writeValueAsString(oldData))
                    .build();
            
            auditLogRepository.save(auditLog);
            log.info("Logged DELETE action for {} with id {}", entityName, entityId);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize old data for logging", e);
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getAllLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogDTO> getLogsPaged(int page, int size, String sortBy, String sortDir,
                                           LocalDateTime startDate, LocalDateTime endDate,
                                           String searchTerm) {
        // Get all logs
        List<AuditLog> allLogs = auditLogRepository.findAllByOrderByCreatedAtDesc();
        
        // Apply filters
        List<AuditLog> filtered = allLogs.stream()
                .filter(log -> {
                    // Filter by date range
                    if (startDate != null && log.getCreatedAt().isBefore(startDate)) {
                        return false;
                    }
                    if (endDate != null && log.getCreatedAt().isAfter(endDate)) {
                        return false;
                    }
                    
                    // Filter by search term (actor, action, entityName)
                    if (searchTerm != null && !searchTerm.isEmpty()) {
                        String search = searchTerm.toLowerCase();
                        boolean matchActor = log.getActor() != null && 
                                log.getActor().toLowerCase().contains(search);
                        boolean matchAction = log.getAction() != null && 
                                log.getAction().toLowerCase().contains(search);
                        boolean matchEntity = log.getEntityName() != null && 
                                log.getEntityName().toLowerCase().contains(search);
                        
                        if (!matchActor && !matchAction && !matchEntity) {
                            return false;
                        }
                    }
                    
                    return true;
                })
                .collect(Collectors.toList());
        
        // Sort by createdAt desc (already sorted from repository)
        
        // Convert to DTO
        List<AuditLogDTO> dtoList = filtered.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        // Pagination
        int start = page * size;
        int end = Math.min(start + size, dtoList.size());
        
        if (start > dtoList.size()) {
            return new PageImpl<>(List.of(), PageRequest.of(page, size), dtoList.size());
        }
        
        List<AuditLogDTO> pagedList = dtoList.subList(start, end);
        return new PageImpl<>(pagedList, PageRequest.of(page, size), dtoList.size());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getLogsByEntity(String entityName, Long entityId) {
        return auditLogRepository.findByEntityNameAndEntityIdOrderByCreatedAtDesc(entityName, entityId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getLogsByEntityName(String entityName) {
        return auditLogRepository.findByEntityNameOrderByCreatedAtDesc(entityName).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getLogsByActor(String actor) {
        return auditLogRepository.findByActorOrderByCreatedAtDesc(actor).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getLogsByAction(String action) {
        return auditLogRepository.findByActionOrderByCreatedAtDesc(action).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByDateRange(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private AuditLogDTO convertToDTO(AuditLog auditLog) {
        return AuditLogDTO.builder()
                .id(auditLog.getId())
                .actor(auditLog.getActor())
                .action(auditLog.getAction())
                .entityName(auditLog.getEntityName())
                .entityId(auditLog.getEntityId())
                .oldData(auditLog.getOldData())
                .newData(auditLog.getNewData())
                .createdAt(auditLog.getCreatedAt())
                .build();
    }
}
