package com.bluemoon.bluemoonv1.controller;

import com.bluemoon.bluemoonv1.dto.NhanKhauDTO;
import com.bluemoon.bluemoonv1.dto.NhanKhauRequestDTO;
import com.bluemoon.bluemoonv1.service.NhanKhauService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nhankhau")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NhanKhauController {
    
    private final NhanKhauService nhanKhauService;
    
    @GetMapping
    public ResponseEntity<List<NhanKhauDTO>> getAllNhanKhau() {
        List<NhanKhauDTO> nhanKhauList = nhanKhauService.getAllNhanKhau();
        return ResponseEntity.ok(nhanKhauList);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<NhanKhauDTO> getNhanKhauById(@PathVariable Long id) {
        try {
            NhanKhauDTO nhanKhau = nhanKhauService.getNhanKhauById(id);
            return ResponseEntity.ok(nhanKhau);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/hokhau/{hoKhauId}")
    public ResponseEntity<List<NhanKhauDTO>> getNhanKhauByHoKhauId(@PathVariable Long hoKhauId) {
        List<NhanKhauDTO> nhanKhauList = nhanKhauService.getNhanKhauByHoKhauId(hoKhauId);
        return ResponseEntity.ok(nhanKhauList);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<NhanKhauDTO>> searchByHoTen(@RequestParam String keyword) {
        List<NhanKhauDTO> result = nhanKhauService.searchByHoTen(keyword);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/cmnd/{cmndCccd}")
    public ResponseEntity<NhanKhauDTO> getByCmndCccd(@PathVariable String cmndCccd) {
        try {
            NhanKhauDTO nhanKhau = nhanKhauService.getByCmndCccd(cmndCccd);
            return ResponseEntity.ok(nhanKhau);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<NhanKhauDTO> createNhanKhau(@RequestBody NhanKhauRequestDTO requestDTO) {
        try {
            NhanKhauDTO createdNhanKhau = nhanKhauService.createNhanKhau(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdNhanKhau);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<NhanKhauDTO> updateNhanKhau(@PathVariable Long id, @RequestBody NhanKhauRequestDTO requestDTO) {
        try {
            NhanKhauDTO updatedNhanKhau = nhanKhauService.updateNhanKhau(id, requestDTO);
            return ResponseEntity.ok(updatedNhanKhau);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteNhanKhau(@PathVariable Long id) {
        try {
            nhanKhauService.deleteNhanKhau(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
