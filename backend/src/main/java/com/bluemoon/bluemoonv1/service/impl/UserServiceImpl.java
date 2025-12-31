package com.bluemoon.bluemoonv1.service.impl;

import com.bluemoon.bluemoonv1.dto.UserDTO;
import com.bluemoon.bluemoonv1.dto.UserRequestDTO;
import com.bluemoon.bluemoonv1.entity.User;
import com.bluemoon.bluemoonv1.repository.UserRepository;
import com.bluemoon.bluemoonv1.service.UserService;
import lombok.RequiredArgsConstructor;
// import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    // private final PasswordEncoder passwordEncoder;
    
    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return convertToDTO(user);
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        return convertToDTO(user);
    }
    
    @Override
    public UserDTO createUser(UserRequestDTO requestDTO) {
        if (userRepository.existsByUsername(requestDTO.getUsername())) {
            throw new RuntimeException("Username already exists: " + requestDTO.getUsername());
        }
        
        User user = new User();
        user.setUsername(requestDTO.getUsername());
        user.setPassword(requestDTO.getPassword());
        // user.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
        user.setRole(requestDTO.getRole());
        
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }
    
    @Override
    public UserDTO updateUser(Long id, UserRequestDTO requestDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        if (!user.getUsername().equals(requestDTO.getUsername()) 
                && userRepository.existsByUsername(requestDTO.getUsername())) {
            throw new RuntimeException("Username already exists: " + requestDTO.getUsername());
        }
        
        user.setUsername(requestDTO.getUsername());
        if (requestDTO.getPassword() != null && !requestDTO.getPassword().isEmpty()) {
            user.setPassword(requestDTO.getPassword());
            // user.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
        }
        user.setRole(requestDTO.getRole());
        
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }
    
    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean checkPassword(String username, String password) {
        try {
            User user = userRepository.findByUsername(username)
                    .orElse(null);
            if (user == null) {
                return false;
            }
            // So sánh trực tiếp password (vì PasswordEncoder đang bị comment)
            return user.getPassword().equals(password);
        } catch (Exception e) {
            return false;
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserDTO login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));
        
        // Kiểm tra mật khẩu
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Mật khẩu không chính xác");
        }
        
        // Trả về thông tin user (không bao gồm password)
        return convertToDTO(user);
    }
    
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
