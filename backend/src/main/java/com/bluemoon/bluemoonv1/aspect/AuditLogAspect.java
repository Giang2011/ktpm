package com.bluemoon.bluemoonv1.aspect;

import com.bluemoon.bluemoonv1.annotation.AuditLog;
import com.bluemoon.bluemoonv1.entity.AuditAction;
import com.bluemoon.bluemoonv1.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

/**
 * Aspect xử lý audit logging tự động
 * Intercept các method có @AuditLog annotation
 */
@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditLogAspect {
    
    private final AuditLogService auditLogService;
    
    @Around("@annotation(com.bluemoon.bluemoonv1.annotation.AuditLog)")
    public Object logAudit(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        AuditLog auditLog = method.getAnnotation(AuditLog.class);
        
        if (auditLog == null) {
            return joinPoint.proceed();
        }
        
        String tableName = auditLog.tableName();
        AuditAction action = auditLog.action();
        Object[] args = joinPoint.getArgs();
        
        Object oldData = null;
        Long entityId = null;
        Object result;
        
        try {
            // Lấy dữ liệu cũ cho UPDATE và DELETE
            if (action == AuditAction.UPDATE || action == AuditAction.DELETE) {
                if (args.length > 0 && args[0] instanceof Long) {
                    entityId = (Long) args[0];
                    // Lấy data hiện tại trước khi update/delete
                    oldData = getCurrentData(joinPoint, entityId);
                }
            }
            
            // Execute method gốc
            result = joinPoint.proceed();
            
            // Ghi log sau khi thực hiện thành công
            switch (action) {
                case CREATE:
                    if (result != null) {
                        entityId = extractId(result);
                        auditLogService.logCreate("SYSTEM", tableName, entityId, result);
                    }
                    break;
                    
                case UPDATE:
                    if (result != null && entityId != null) {
                        auditLogService.logUpdate("SYSTEM", tableName, entityId, oldData, result);
                    }
                    break;
                    
                case DELETE:
                    if (entityId != null && oldData != null) {
                        auditLogService.logDelete("SYSTEM", tableName, entityId, oldData);
                    }
                    break;
            }
            
            return result;
            
        } catch (Exception e) {
            log.error("Error in audit logging for {}.{}", tableName, action, e);
            throw e;
        }
    }
    
    /**
     * Lấy dữ liệu hiện tại từ database trước khi update/delete
     */
    private Object getCurrentData(ProceedingJoinPoint joinPoint, Long id) {
        try {
            Object target = joinPoint.getTarget();
            String methodName;
            
            // Tìm method get by id tương ứng
            if (target.getClass().getName().contains("HoKhau")) {
                methodName = "getHoKhauById";
            } else if (target.getClass().getName().contains("NhanKhau")) {
                methodName = "getNhanKhauById";
            } else if (target.getClass().getName().contains("KhoanThu")) {
                methodName = "getKhoanThuById";
            } else if (target.getClass().getName().contains("NopTien")) {
                methodName = "getNopTienById";
            } else {
                return null;
            }
            
            Method getMethod = target.getClass().getMethod(methodName, Long.class);
            return getMethod.invoke(target, id);
            
        } catch (Exception e) {
            log.warn("Could not retrieve current data for id: {}", id, e);
            return null;
        }
    }
    
    /**
     * Trích xuất ID từ DTO result
     */
    private Long extractId(Object dto) {
        try {
            Method getIdMethod = dto.getClass().getMethod("getId");
            return (Long) getIdMethod.invoke(dto);
        } catch (Exception e) {
            log.warn("Could not extract ID from result", e);
            return null;
        }
    }
}
