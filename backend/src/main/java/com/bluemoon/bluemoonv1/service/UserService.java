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
}
