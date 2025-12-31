package com.bluemoon.bluemoonv1.controller;

import com.bluemoon.bluemoonv1.dto.*;
import com.bluemoon.bluemoonv1.service.KhoanThuService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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
    
    // ========== Các endpoint mới cho chi tiết khoản thu ==========
    
    /**
     * Lấy thông tin chi tiết đầy đủ của khoản thu
     * Bao gồm: thông tin khoản thu, danh sách hộ đã đóng, danh sách hộ chưa đóng (chỉ khoản bắt buộc), tổng tiền đã thu
     * 
     * @param id ID của khoản thu
     * @return Thông tin chi tiết đầy đủ
     */
    @GetMapping("/{id}/chi-tiet")
    public ResponseEntity<KhoanThuDetailDTO> getKhoanThuChiTiet(@PathVariable Long id) {
        try {
            KhoanThuDetailDTO chiTiet = khoanThuService.getKhoanThuChiTiet(id);
            return ResponseEntity.ok(chiTiet);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Lấy danh sách các hộ khẩu đã đóng tiền cho khoản thu này
     * 
     * @param id ID của khoản thu
     * @return Danh sách hộ khẩu đã nộp tiền
     */
    @GetMapping("/{id}/ho-da-dong")
    public ResponseEntity<List<HoKhauDTO>> getHoDaDong(@PathVariable Long id) {
        try {
            List<HoKhauDTO> hoDaDong = khoanThuService.getHoDaDongByKhoanThuId(id);
            return ResponseEntity.ok(hoDaDong);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Lấy danh sách các hộ khẩu chưa đóng tiền (chỉ áp dụng với khoản bắt buộc)
     * Trả về null nếu khoản thu là tự nguyện
     * 
     * @param id ID của khoản thu
     * @return Danh sách hộ khẩu chưa nộp tiền, hoặc null nếu không phải khoản bắt buộc
     */
    @GetMapping("/{id}/ho-chua-dong")
    public ResponseEntity<List<HoKhauDTO>> getHoChuaDong(@PathVariable Long id) {
        try {
            List<HoKhauDTO> hoChuaDong = khoanThuService.getHoChuaDongByKhoanThuId(id);
            if (hoChuaDong == null) {
                // Khoản thu không phải bắt buộc
                return ResponseEntity.ok(null);
            }
            return ResponseEntity.ok(hoChuaDong);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Lấy tổng số tiền đã thu được cho khoản thu này
     * 
     * @param id ID của khoản thu
     * @return Tổng số tiền đã thu
     */
    @GetMapping("/{id}/tong-thu")
    public ResponseEntity<BigDecimal> getTongThu(@PathVariable Long id) {
        try {
            BigDecimal tongThu = khoanThuService.getTongThuByKhoanThuId(id);
            return ResponseEntity.ok(tongThu);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
