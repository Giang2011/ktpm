package com.bluemoon.bluemoonv1.controller;

import com.bluemoon.bluemoonv1.dto.UserDTO;
import com.bluemoon.bluemoonv1.dto.UserRequestDTO;
import com.bluemoon.bluemoonv1.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        try {
            UserDTO user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        try {
            UserDTO user = userService.getUserByUsername(username);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/exists/{username}")
    public ResponseEntity<Boolean> checkUsernameExists(@PathVariable String username) {
        boolean exists = userService.existsByUsername(username);
        return ResponseEntity.ok(exists);
    }
    
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserRequestDTO requestDTO) {
        try {
            UserDTO createdUser = userService.createUser(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserRequestDTO requestDTO) {
        try {
            UserDTO updatedUser = userService.updateUser(id, requestDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/check-password")
    public ResponseEntity<Boolean> checkPassword(@RequestParam String username, @RequestParam String password) {
        boolean isValid = userService.checkPassword(username, password);
        return ResponseEntity.ok(isValid);
    }
    
    /**
     * Đăng nhập với username và password
     * Trả về thông tin đầy đủ của tài khoản (bao gồm role) nếu đăng nhập thành công
     * Không bao gồm password trong response
     * 
     * @param username Tên đăng nhập
     * @param password Mật khẩu
     * @return Thông tin tài khoản nếu đăng nhập thành công
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            UserDTO user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

    // Thêm class này
    public static class LoginRequest {
        private String username;
        private String password;
        
        // Getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
