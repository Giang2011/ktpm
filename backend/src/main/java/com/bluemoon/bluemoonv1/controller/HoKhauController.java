package com.bluemoon.bluemoonv1.controller;

import com.bluemoon.bluemoonv1.dto.HoKhauDTO;
import com.bluemoon.bluemoonv1.dto.HoKhauRequestDTO;
import com.bluemoon.bluemoonv1.service.HoKhauService;
import lombok.RequiredArgsConstructor;
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
}
