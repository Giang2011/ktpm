package com.bluemoon.bluemoonv1.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogDTO {
    private Long id;
    private String actor;
    private String action;
    private String entityName;
    private Long entityId;
    private String oldData;
    private String newData;
    private LocalDateTime createdAt;
}
