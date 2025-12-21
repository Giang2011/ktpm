package com.bluemoon.bluemoonv1.controller;

import com.bluemoon.bluemoonv1.dto.KhoanThuDTO;
import com.bluemoon.bluemoonv1.dto.KhoanThuRequestDTO;
import com.bluemoon.bluemoonv1.service.KhoanThuService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/khoanthu")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class KhoanThuController {
    
    private final KhoanThuService khoanThuService;
    
    @GetMapping
    public ResponseEntity<List<KhoanThuDTO>> getAllKhoanThu() {
        List<KhoanThuDTO> khoanThuList = khoanThuService.getAllKhoanThu();
        return ResponseEntity.ok(khoanThuList);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<KhoanThuDTO> getKhoanThuById(@PathVariable Long id) {
        try {
            KhoanThuDTO khoanThu = khoanThuService.getKhoanThuById(id);
            return ResponseEntity.ok(khoanThu);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/batbuoc")
    public ResponseEntity<List<KhoanThuDTO>> getKhoanThuBatBuoc() {
        List<KhoanThuDTO> khoanThuList = khoanThuService.getKhoanThuBatBuoc();
        return ResponseEntity.ok(khoanThuList);
    }
    
    @GetMapping("/tunguyen")
    public ResponseEntity<List<KhoanThuDTO>> getKhoanThuTuNguyen() {
        List<KhoanThuDTO> khoanThuList = khoanThuService.getKhoanThuTuNguyen();
        return ResponseEntity.ok(khoanThuList);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<KhoanThuDTO>> getActiveKhoanThu(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngay) {
        LocalDate searchDate = ngay != null ? ngay : LocalDate.now();
        List<KhoanThuDTO> khoanThuList = khoanThuService.getActiveKhoanThu(searchDate);
        return ResponseEntity.ok(khoanThuList);
    }
    
    @PostMapping
    public ResponseEntity<KhoanThuDTO> createKhoanThu(@RequestBody KhoanThuRequestDTO requestDTO) {
        try {
            KhoanThuDTO createdKhoanThu = khoanThuService.createKhoanThu(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdKhoanThu);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<KhoanThuDTO> updateKhoanThu(@PathVariable Long id, @RequestBody KhoanThuRequestDTO requestDTO) {
        try {
            KhoanThuDTO updatedKhoanThu = khoanThuService.updateKhoanThu(id, requestDTO);
            return ResponseEntity.ok(updatedKhoanThu);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteKhoanThu(@PathVariable Long id) {
        try {
            khoanThuService.deleteKhoanThu(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
