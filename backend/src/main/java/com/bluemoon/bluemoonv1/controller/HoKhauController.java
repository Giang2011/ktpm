package com.bluemoon.bluemoonv1.controller;

import com.bluemoon.bluemoonv1.dto.*;
import com.bluemoon.bluemoonv1.service.HoKhauService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hokhau")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HoKhauController {
    
    private final HoKhauService hoKhauService;
    
    @GetMapping
    public ResponseEntity<List<HoKhauDTO>> getAllHoKhau() {
        List<HoKhauDTO> hoKhauList = hoKhauService.getAllHoKhau();
        return ResponseEntity.ok(hoKhauList);
    }
    
    @GetMapping("/paged")
    public ResponseEntity<Page<HoKhauDTO>> getHoKhauPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Page<HoKhauDTO> hoKhauPage = hoKhauService.getHoKhauPaged(page, size, sortBy, sortDir);
        return ResponseEntity.ok(hoKhauPage);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<HoKhauDTO> getHoKhauById(@PathVariable Long id) {
        try {
            HoKhauDTO hoKhau = hoKhauService.getHoKhauById(id);
            return ResponseEntity.ok(hoKhau);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<HoKhauDTO>> getActiveHoKhau() {
        List<HoKhauDTO> activeHoKhau = hoKhauService.getActiveHoKhau();
        return ResponseEntity.ok(activeHoKhau);
    }
    
    @GetMapping("/search/chuho")
    public ResponseEntity<List<HoKhauDTO>> searchByTenChuHo(@RequestParam String keyword) {
        List<HoKhauDTO> result = hoKhauService.searchByTenChuHo(keyword);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/search/diachi")
    public ResponseEntity<List<HoKhauDTO>> searchByDiaChi(@RequestParam String keyword) {
        List<HoKhauDTO> result = hoKhauService.searchByDiaChi(keyword);
        return ResponseEntity.ok(result);
    }
    
    @PostMapping
    public ResponseEntity<HoKhauDTO> createHoKhau(@RequestBody HoKhauRequestDTO requestDTO) {
        try {
            HoKhauDTO createdHoKhau = hoKhauService.createHoKhau(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdHoKhau);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<HoKhauDTO> updateHoKhau(@PathVariable Long id, @RequestBody HoKhauRequestDTO requestDTO) {
        try {
            HoKhauDTO updatedHoKhau = hoKhauService.updateHoKhau(id, requestDTO);
            return ResponseEntity.ok(updatedHoKhau);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteHoKhau(@PathVariable Long id) {
        try {
            hoKhauService.deleteHoKhau(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // ========== Các endpoint mới cho chi tiết hộ khẩu ==========
    
    /**
     * Lấy thông tin chi tiết đầy đủ của hộ khẩu
     * Bao gồm: thông tin hộ, danh sách thành viên, khoản đã đóng, khoản chưa đóng
     * 
     * @param id ID của hộ khẩu
     * @return Thông tin chi tiết đầy đủ
     */
    @GetMapping("/{id}/chi-tiet")
    public ResponseEntity<HoKhauDetailDTO> getHoKhauChiTiet(@PathVariable Long id) {
        try {
            HoKhauDetailDTO chiTiet = hoKhauService.getHoKhauChiTiet(id);
            return ResponseEntity.ok(chiTiet);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Lấy danh sách thành viên của hộ khẩu
     * 
     * @param id ID của hộ khẩu
     * @return Danh sách nhân khẩu trong hộ với thông tin chi tiết
     */
    @GetMapping("/{id}/thanh-vien")
    public ResponseEntity<List<NhanKhauDTO>> getThanhVien(@PathVariable Long id) {
        try {
            List<NhanKhauDTO> thanhVien = hoKhauService.getThanhVienByHoKhauId(id);
            return ResponseEntity.ok(thanhVien);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Lấy danh sách các khoản thu đã đóng
     * 
     * @param id ID của hộ khẩu
     * @return Danh sách các khoản đã nộp tiền
     */
    @GetMapping("/{id}/khoan-da-dong")
    public ResponseEntity<List<NopTienDTO>> getKhoanDaDong(@PathVariable Long id) {
        try {
            List<NopTienDTO> khoanDaDong = hoKhauService.getKhoanDaDong(id);
            return ResponseEntity.ok(khoanDaDong);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Lấy danh sách các khoản thu bắt buộc chưa đóng
     * 
     * @param id ID của hộ khẩu
     * @return Danh sách các khoản bắt buộc chưa nộp tiền
     */
    @GetMapping("/{id}/khoan-chua-dong")
    public ResponseEntity<List<KhoanThuDTO>> getKhoanChuaDong(@PathVariable Long id) {
        try {
            List<KhoanThuDTO> khoanChuaDong = hoKhauService.getKhoanChuaDong(id);
            return ResponseEntity.ok(khoanChuaDong);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
