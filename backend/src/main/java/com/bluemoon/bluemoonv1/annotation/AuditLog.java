package com.bluemoon.bluemoonv1.annotation;

import com.bluemoon.bluemoonv1.entity.AuditAction;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation để đánh dấu các method cần audit log
 * Sử dụng AOP để tự động ghi log
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AuditLog {
    
    /**
     * Tên bảng trong database (ho_khau, nhan_khau, khoan_thu, nop_tien)
     */
    String tableName();
    
    /**
     * Loại action: CREATE, UPDATE, DELETE
     */
    AuditAction action();
}
