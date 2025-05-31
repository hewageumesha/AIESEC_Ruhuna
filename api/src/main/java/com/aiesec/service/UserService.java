package com.aiesec.service;

import com.aiesec.dto.UserDTO;
import com.aiesec.dto.UserHierarchyDTO;
import com.aiesec.model.Role;
import com.aiesec.model.User;
import com.aiesec.repository.DepartmentRepo;
import com.aiesec.repository.UserRepo;

import io.jsonwebtoken.lang.Collections;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepo userRepository;

    // Method to add a new user
    public User addUser(User user) {
        Optional<User> existingUser = userRepository.findByAiesecEmail(user.getAiesecEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User with email " + user.getAiesecEmail() + " already exists.");
        }

        return userRepository.save(user);
    }

    // Method to update user details
    public User updateUser(String aiesecEmail, UserDTO userDetails) {
        User user = userRepository.findByAiesecEmail(aiesecEmail)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + aiesecEmail));
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setStateORProvince(userDetails.getStateORProvince());
        user.setCity(userDetails.getCity());
        user.setStreetAddress(userDetails.getStreetAddress());
        user.setZIPORPostalCode(userDetails.getZIPORPostalCode());
        user.setPhone(userDetails.getPhone());
        user.setAbout(userDetails.getAbout());
        return userRepository.save(user);
    }

    // Method to delete a user
    public void deleteUser(String aiesecEmail) {
        User user = userRepository.findByAiesecEmail(aiesecEmail)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + aiesecEmail));
        userRepository.delete(user);
    }

    // Method to retrieve a user by AIESEC email
    public Optional<User> getUserByAiesecEmail(String aiesecEmail) {
        try {
            return userRepository.findByAiesecEmail(aiesecEmail);
        } catch (Exception e) {
            // Log the exception
            logger.error("Error retrieving user by email: " + aiesecEmail, e);
            throw new RuntimeException("Error retrieving user by email");
        }
    }

    public Map<String, Object> getUserStats(int limit) {
        Map<String, Object> response = new HashMap<>();

        // Get total users
        long totalUsers = userRepository.count();
        response.put("totalUsers", totalUsers);

        // Get 5 most recent users
        List<User> recentUsers = userRepository.findTop5ByOrderByJoinedDateDesc();
        response.put("users", recentUsers);

        // Calculate last month's date range
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 1); // 1st of current month
        Date startOfThisMonth = calendar.getTime();

        calendar.add(Calendar.MONTH, -1); // go to last month
        Date startOfLastMonth = calendar.getTime();

        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        Date endOfLastMonth = calendar.getTime();

        // Get users joined last month
        long lastMonthUsers = userRepository.countUsersJoinedLastMonth(startOfLastMonth, endOfLastMonth);
        response.put("lastMonthUsers", lastMonthUsers);

        return response;
    }

    public User updateUserProfile(String aiesecEmail, User userDetails, MultipartFile profilePhoto) throws IOException {
        User user = userRepository.findByAiesecEmail(aiesecEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        //Update allowed fields
        if (userDetails.getFirstName() != null) {
            user.setAiesecEmail(userDetails.getAiesecEmail());
        }
        if (userDetails.getLastName() != null) {
            user.setLastName(userDetails.getLastName());
        }
        if (userDetails.getBirthday() != null) {
            user.setBirthday(userDetails.getBirthday());
        }
        if (userDetails.getGender() != null) {
            user.setGender(userDetails.getGender());
        }
        if (userDetails.getEmail() != null) {
            user.setEmail(userDetails.getEmail());
        }
        if (userDetails.getStateORProvince() != null) {
            user.setStateORProvince(userDetails.getStateORProvince());
        }
        if (userDetails.getCity() != null) {
            user.setCity(userDetails.getCity());
        }
        if (userDetails.getStreetAddress() != null) {
            user.setStreetAddress(userDetails.getStreetAddress());
        }
        if (userDetails.getZIPORPostalCode() != null) {
            user.setZIPORPostalCode(userDetails.getZIPORPostalCode());
        }

        return userRepository.save(user);
   }

    public User getUserProfile(String aiesecEmail) {
        return userRepository.findByAiesecEmail(aiesecEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /* 
    public List<UserHierarchyDTO> getCommitteeHierarchy() {
        User lcp = userRepository.findByRole(Role.LCP).stream()
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("LCP not found"));
        
        return List.of(buildHierarchy(lcp));
    }

    private UserHierarchyDTO buildHierarchy(User user) {
        UserHierarchyDTO dto = new UserHierarchyDTO();
        dto.setId(user.getId());
        dto.setName(user.getFirstName() + " " + user.getLastName());
        dto.setAiesecEmail(user.getAiesecEmail());
        dto.setRole(user.getRole());
        dto.setProfilePicture(user.getProfilePicture());
        
        if (user.getDepartment() != null) {
            dto.setDepartmentName(user.getDepartment().getName());
        }
        
        if (user.getFunction() != null) {
            dto.setFunctionName(user.getFunction().getName());
        }

        List<User> children;
        if (user.getRole() == Role.LCP) {
            children = userRepository.findByRole(Role.LCVP);
        } else if (user.getRole() == Role.LCVP) {
            children = userRepository.findByRoleAndTeamLeaderId(Role.Team_Leader, user.getId());
        } else if (user.getRole() == Role.Team_Leader) {
            children = userRepository.findByTeamLeaderId(user.getId());
        } else {
            children = Collections.emptyList();
        }

        if (!children.isEmpty()) {
            dto.setChildren(children.stream()
                .map(this::buildHierarchy)
                .collect(Collectors.toList()));
        }

        return dto;
    }

    public UserDTO getUserDetails(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return convertToDTO(user);
    }

    /* 
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setAiesecEmail(user.getAiesecEmail());
        dto.setBirthday(user.getBirthday());
        dto.setJoinedDate(user.getJoinedDate());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        
        if (user.getFunction() != null) {
            dto.setFunctionId(user.getFunction().getId());
            dto.setFunctionName(user.getFunction().getName());
        }
        
        if (user.getDepartment() != null) {
            dto.setDepartmentId(user.getDepartment().getId());
            dto.setDepartmentName(user.getDepartment().getName());
        }
        
        if (user.getTeamLeader() != null) {
            dto.setTeamLeaderId(user.getTeamLeader().getId());
            dto.setTeamLeaderName(user.getTeamLeader().getFirstName() + " " + user.getTeamLeader().getLastName());
        }
        
        if (!user.getTeamMembers().isEmpty()) {
            dto.setTeamMembers(user.getTeamMembers().stream()
                .map(this::convertToSimpleDTO)
                .collect(Collectors.toList()));
        }
        
        return dto;
    }

    private UserDTO convertToSimpleDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setAiesecEmail(user.getAiesecEmail());
        dto.setRole(user.getRole());
        dto.setProfilePicture(user.getProfilePicture());
        return dto;
    }

    @Transactional
    public UserDTO createUser(UserDTO userDTO) {
        User user = new User();
        // Set all fields from DTO
        // Handle relationships
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    @Transactional
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        // Update fields from DTO
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(user);
    }
    */
}