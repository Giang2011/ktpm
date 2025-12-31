package com.bluemoon.bluemoonv1.service;

import com.bluemoon.bluemoonv1.dto.UserDTO;
import com.bluemoon.bluemoonv1.dto.UserRequestDTO;

import java.util.List;

public interface UserService {
    
    List<UserDTO> getAllUsers();
    
    UserDTO getUserById(Long id);
    
    UserDTO getUserByUsername(String username);
    
    UserDTO createUser(UserRequestDTO requestDTO);
    
    UserDTO updateUser(Long id, UserRequestDTO requestDTO);
    
    void deleteUser(Long id);
    
    boolean existsByUsername(String username);
    
    boolean checkPassword(String username, String password);
    
    /**
     * Đăng nhập với username và password
     * @param username Tên đăng nhập
     * @param password Mật khẩu
     * @return Thông tin user (không bao gồm password) nếu đăng nhập thành công
     * @throws RuntimeException nếu username không tồn tại hoặc mật khẩu sai
     */
    UserDTO login(String username, String password);
}
