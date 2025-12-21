// package com.bluemoon.bluemoonv1.security;

// import com.bluemoon.bluemoonv1.entity.User;
// import com.bluemoon.bluemoonv1.repository.UserRepository;
// import lombok.RequiredArgsConstructor;
// import org.springframework.security.core.GrantedAuthority;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.stereotype.Service;

// import java.util.ArrayList;
// import java.util.Collection;
// import java.util.List;

// @Service
// @RequiredArgsConstructor
// public class CustomUserDetailsService implements UserDetailsService {
    
//     private final UserRepository userRepository;
    
//     @Override
//     public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//         User user = userRepository.findByUsername(username)
//                 .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
//         return new org.springframework.security.core.userdetails.User(
//                 user.getUsername(),
//                 user.getPassword(),
//                 getAuthorities(user.getRole())
//         );
//     }
    
//     private Collection<? extends GrantedAuthority> getAuthorities(String role) {
//         List<GrantedAuthority> authorities = new ArrayList<>();
//         authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
//         return authorities;
//     }
// }
