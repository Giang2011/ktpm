// package com.bluemoon.bluemoonv1.controller;

// import com.bluemoon.bluemoonv1.dto.LoginRequestDTO;
// import com.bluemoon.bluemoonv1.dto.LoginResponseDTO;
// import com.bluemoon.bluemoonv1.entity.User;
// import com.bluemoon.bluemoonv1.repository.UserRepository;
// import com.bluemoon.bluemoonv1.security.JwtUtil;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.BadCredentialsException;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.Authentication;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api/auth")
// @RequiredArgsConstructor
// @CrossOrigin(origins = "*")
// public class AuthController {
    
//     private final AuthenticationManager authenticationManager;
//     private final JwtUtil jwtUtil;
//     private final UserRepository userRepository;
    
//     @PostMapping("/login")
//     public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
//         try {
//             Authentication authentication = authenticationManager.authenticate(
//                     new UsernamePasswordAuthenticationToken(
//                             loginRequest.getUsername(),
//                             loginRequest.getPassword()
//                     )
//             );
            
//             User user = userRepository.findByUsername(loginRequest.getUsername())
//                     .orElseThrow(() -> new RuntimeException("User not found"));
            
//             String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
            
//             LoginResponseDTO response = new LoginResponseDTO(
//                     token,
//                     user.getUsername(),
//                     user.getRole(),
//                     user.getId()
//             );
            
//             return ResponseEntity.ok(response);
            
//         } catch (BadCredentialsException e) {
//             return ResponseEntity.status(401).body("Invalid username or password");
//         } catch (Exception e) {
//             return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
//         }
//     }
// }
