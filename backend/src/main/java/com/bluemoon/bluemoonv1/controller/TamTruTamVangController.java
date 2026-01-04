package com.bluemoon.bluemoonv1.controller;

import com.bluemoon.bluemoonv1.dto.TamTruTamVangDTO;
import com.bluemoon.bluemoonv1.dto.TamTruTamVangRequestDTO;
import com.bluemoon.bluemoonv1.service.TamTruTamVangService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tamtrutamvang")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class TamTruTamVangController {
    
    private final TamTruTamVangService tamTruTamVangService;
    
    @GetMapping
    public ResponseEntity<List<TamTruTamVangDTO>> getAllTamTruTamVang() {
        List<TamTruTamVangDTO> tamTruTamVangList = tamTruTamVangService.getAllTamTruTamVang();
        return ResponseEntity.ok(tamTruTamVangList);
    }
    
    @GetMapping("/paged")
    public ResponseEntity<Page<TamTruTamVangDTO>> getTamTruTamVangPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<TamTruTamVangDTO> tamTruTamVangPage = tamTruTamVangService.getTamTruTamVangPaged(pageable);
        return ResponseEntity.ok(tamTruTamVangPage);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TamTruTamVangDTO> getTamTruTamVangById(@PathVariable Long id) {
        try {
            TamTruTamVangDTO tamTruTamVang = tamTruTamVangService.getTamTruTamVangById(id);
            return ResponseEntity.ok(tamTruTamVang);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/nhankhau/{nhanKhauId}")
    public ResponseEntity<List<TamTruTamVangDTO>> getTamTruTamVangByNhanKhauId(@PathVariable Long nhanKhauId) {
        List<TamTruTamVangDTO> tamTruTamVangList = tamTruTamVangService.getTamTruTamVangByNhanKhauId(nhanKhauId);
        return ResponseEntity.ok(tamTruTamVangList);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<TamTruTamVangDTO>> searchByKeyword(@RequestParam String keyword) {
        List<TamTruTamVangDTO> result = tamTruTamVangService.searchByKeyword(keyword);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<TamTruTamVangDTO>> getActiveByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<TamTruTamVangDTO> result = tamTruTamVangService.getActiveByDate(date);
        return ResponseEntity.ok(result);
    }
    
    @PostMapping
    public ResponseEntity<?> createTamTruTamVang(@Valid @RequestBody TamTruTamVangRequestDTO requestDTO) {
        try {
            log.info("Creating tam tru tam vang with data: {}", requestDTO);
            log.info("LoaiTamTru: {}, DiaChi: {}", requestDTO.getLoaiTamTru(), requestDTO.getDiaChi());
            
            // Validate địa chỉ bắt buộc khi tạm trú (loaiTamTru = 0)
            if (requestDTO.getLoaiTamTru() != null && requestDTO.getLoaiTamTru() == 0) {
                if (requestDTO.getDiaChi() == null || requestDTO.getDiaChi().trim().isEmpty()) {
                    log.warn("Validation failed: DiaChi is required for loaiTamTru = 0");
                    return ResponseEntity.badRequest().body("Địa chỉ là bắt buộc khi đăng ký tạm trú");
                }
            }
            
            TamTruTamVangDTO createdTamTruTamVang = tamTruTamVangService.createTamTruTamVang(requestDTO);
            log.info("Successfully created tam tru tam vang with id: {}", createdTamTruTamVang.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTamTruTamVang);
        } catch (RuntimeException e) {
            log.error("Error creating tam tru tam vang: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTamTruTamVang(@PathVariable Long id, @Valid @RequestBody TamTruTamVangRequestDTO requestDTO) {
        try {
            log.info("Updating tam tru tam vang id {} with data: {}", id, requestDTO);
            log.info("LoaiTamTru: {}, DiaChi: {}", requestDTO.getLoaiTamTru(), requestDTO.getDiaChi());
            
            // Validate địa chỉ bắt buộc khi tạm trú (loaiTamTru = 0)
            if (requestDTO.getLoaiTamTru() != null && requestDTO.getLoaiTamTru() == 0) {
                if (requestDTO.getDiaChi() == null || requestDTO.getDiaChi().trim().isEmpty()) {
                    log.warn("Validation failed: DiaChi is required for loaiTamTru = 0");
                    return ResponseEntity.badRequest().body("Địa chỉ là bắt buộc khi đăng ký tạm trú");
                }
            }
            
            TamTruTamVangDTO updatedTamTruTamVang = tamTruTamVangService.updateTamTruTamVang(id, requestDTO);
            log.info("Successfully updated tam tru tam vang with id: {}", id);
            return ResponseEntity.ok(updatedTamTruTamVang);
        } catch (RuntimeException e) {
            log.error("Error updating tam tru tam vang: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTamTruTamVang(@PathVariable Long id) {
        try {
            log.info("Deleting tam tru tam vang id: {}", id);
            tamTruTamVangService.deleteTamTruTamVang(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error deleting tam tru tam vang: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
