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
