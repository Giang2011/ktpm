package com.bluemoon.bluemoonv1.controller;

import com.bluemoon.bluemoonv1.dto.NopTienDTO;
import com.bluemoon.bluemoonv1.dto.NopTienRequestDTO;
import com.bluemoon.bluemoonv1.service.NopTienService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/noptien")
@RequiredArgsConstructor
public class NopTienController {
    
    private final NopTienService nopTienService;
    
    @GetMapping
    public ResponseEntity<List<NopTienDTO>> getAllNopTien() {
        List<NopTienDTO> nopTienList = nopTienService.getAllNopTien();
        return ResponseEntity.ok(nopTienList);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<NopTienDTO> getNopTienById(@PathVariable Long id) {
        try {
            NopTienDTO nopTien = nopTienService.getNopTienById(id);
            return ResponseEntity.ok(nopTien);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/hokhau/{hoKhauId}")
    public ResponseEntity<List<NopTienDTO>> getNopTienByHoKhauId(@PathVariable Long hoKhauId) {
        List<NopTienDTO> nopTienList = nopTienService.getNopTienByHoKhauId(hoKhauId);
        return ResponseEntity.ok(nopTienList);
    }
    
    @GetMapping("/khoanthu/{khoanThuId}")
    public ResponseEntity<List<NopTienDTO>> getNopTienByKhoanThuId(@PathVariable Long khoanThuId) {
        List<NopTienDTO> nopTienList = nopTienService.getNopTienByKhoanThuId(khoanThuId);
        return ResponseEntity.ok(nopTienList);
    }
    
    @GetMapping("/daterange")
    public ResponseEntity<List<NopTienDTO>> getNopTienByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<NopTienDTO> nopTienList = nopTienService.getNopTienByDateRange(startDate, endDate);
        return ResponseEntity.ok(nopTienList);
    }
    
    @GetMapping("/thongke/khoanthu/{khoanThuId}")
    public ResponseEntity<BigDecimal> getTongTienByKhoanThuId(@PathVariable Long khoanThuId) {
        BigDecimal tongTien = nopTienService.getTongTienByKhoanThuId(khoanThuId);
        return ResponseEntity.ok(tongTien);
    }
    
    @GetMapping("/thongke/daterange")
    public ResponseEntity<BigDecimal> getTongTienByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        BigDecimal tongTien = nopTienService.getTongTienByDateRange(startDate, endDate);
        return ResponseEntity.ok(tongTien);
    }
    
    @PostMapping
    public ResponseEntity<NopTienDTO> createNopTien(@RequestBody NopTienRequestDTO requestDTO) {
        try {
            NopTienDTO createdNopTien = nopTienService.createNopTien(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdNopTien);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<NopTienDTO> updateNopTien(@PathVariable Long id, @RequestBody NopTienRequestDTO requestDTO) {
        try {
            NopTienDTO updatedNopTien = nopTienService.updateNopTien(id, requestDTO);
            return ResponseEntity.ok(updatedNopTien);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteNopTien(@PathVariable Long id) {
        try {
            nopTienService.deleteNopTien(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
