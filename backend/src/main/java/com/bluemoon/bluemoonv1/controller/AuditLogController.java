package com.bluemoon.bluemoonv1.controller;

import com.bluemoon.bluemoonv1.dto.AuditLogDTO;
import com.bluemoon.bluemoonv1.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {
    
    private final AuditLogService auditLogService;
    
    /**
     * Lấy tất cả log
     * GET /api/audit-logs
     */
    @GetMapping
    public ResponseEntity<List<AuditLogDTO>> getAllLogs() {
        List<AuditLogDTO> logs = auditLogService.getAllLogs();
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Lấy log theo entity name và entity id
     * GET /api/audit-logs/entity?name=ho_khau&id=1
     */
    @GetMapping("/entity")
    public ResponseEntity<List<AuditLogDTO>> getLogsByEntity(
            @RequestParam String name,
            @RequestParam Long id) {
        List<AuditLogDTO> logs = auditLogService.getLogsByEntity(name, id);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Lấy log theo entity name
     * GET /api/audit-logs/entity-name/ho_khau
     */
    @GetMapping("/entity-name/{entityName}")
    public ResponseEntity<List<AuditLogDTO>> getLogsByEntityName(@PathVariable String entityName) {
        List<AuditLogDTO> logs = auditLogService.getLogsByEntityName(entityName);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Lấy log theo actor
     * GET /api/audit-logs/actor/ADMIN
     */
    @GetMapping("/actor/{actor}")
    public ResponseEntity<List<AuditLogDTO>> getLogsByActor(@PathVariable String actor) {
        List<AuditLogDTO> logs = auditLogService.getLogsByActor(actor);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Lấy log theo action
     * GET /api/audit-logs/action/CREATE
     */
    @GetMapping("/action/{action}")
    public ResponseEntity<List<AuditLogDTO>> getLogsByAction(@PathVariable String action) {
        List<AuditLogDTO> logs = auditLogService.getLogsByAction(action);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Lấy log trong khoảng thời gian
     * GET /api/audit-logs/date-range?start=2024-01-01T00:00:00&end=2024-12-31T23:59:59
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<AuditLogDTO>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<AuditLogDTO> logs = auditLogService.getLogsByDateRange(start, end);
        return ResponseEntity.ok(logs);
    }
}
