package com.aiesec.service;

import com.aiesec.dto.UserDTO;
import com.aiesec.dto.UserHierarchyDTO;
import com.aiesec.enums.UserRole;
import com.aiesec.model.User;
import com.aiesec.repository.DepartmentRepo;
import com.aiesec.repository.UserRepository;

import io.jsonwebtoken.lang.Collections;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    // Method to add a new user
    public User addUser(User user) {
        Optional<User> existingUser = userRepository.findByAiesecEmail(user.getAiesecEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User with email " + user.getAiesecEmail() + " already exists.");
        }

        return userRepository.save(user);
    }

    // Method to update user details
    public User updateUser(String aiesecEmail, User userDetails) {
        User user = userRepository.findByAiesecEmail(aiesecEmail)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + aiesecEmail));
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
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
    
    public List<Map<String, Object>>  getCommitteeHierarchy() {
        List<User> userList = userRepository.findAll();
        return buildAiesecHierarchy(userList);
    }

    public List<Map<String, Object>> buildAiesecHierarchy(List<User> userList) {
        Map<String, User> userById = userList.stream()
                .collect(Collectors.toMap(u -> u.getId().toString(), u -> u));

        // Find all LCPs (top-level users)
        List<User> lcps = userList.stream()
                .filter(u -> u.getRole().equals(UserRole.LCP) && u.getTeamLeaderId() == null)
                .toList();

        List<Map<String, Object>> hierarchyList = new ArrayList<>();

        for (User lcp : lcps) {
            Map<String, Object> lcpMap = new LinkedHashMap<>();

            // LCP section
            Map<String, Object> lcpDetails = new LinkedHashMap<>();
            lcpDetails.put("id", lcp.getId().toString());
            lcpDetails.put("name", lcp.getFirstName() + " " + lcp.getLastName());
            lcpDetails.put("role", "lcp");
            lcpDetails.put("image", lcp.getProfilePicture());
            lcpDetails.put("email", lcp.getAiesecEmail());
            lcpDetails.put("tenure", getTenureString(lcp.getJoinedDate()));
            lcpMap.put("lcp", lcpDetails);

            // LCVPs
            List<Map<String, Object>> lcvpList = new ArrayList<>();
            for (User lcvp : findChildren(userList, lcp.getId(), UserRole.LCVP)) {
                Map<String, Object> lcvpMap = new LinkedHashMap<>();
                lcvpMap.put("id", lcvp.getId().toString());
                lcvpMap.put("name", lcvp.getFirstName() + " " + lcvp.getLastName());
                lcvpMap.put("role", "lcvp");
                lcvpMap.put("image", lcvp.getProfilePicture());
                lcvpMap.put("email", lcvp.getAiesecEmail());
                lcvpMap.put("tenure", getTenureString(lcvp.getJoinedDate()));

                // Team Leaders
                List<Map<String, Object>> teamLeaders = new ArrayList<>();
                for (User tl : findChildren(userList, lcvp.getId(), UserRole.Team_Leader)) {
                    Map<String, Object> tlMap = new LinkedHashMap<>();
                    tlMap.put("id", tl.getId().toString());
                    tlMap.put("name", tl.getFirstName() + " " + tl.getLastName());
                    tlMap.put("role", "team_leader");
                    tlMap.put("image", tl.getProfilePicture());
                    tlMap.put("email", tl.getAiesecEmail());

                    // Members
                    List<Map<String, Object>> memberList = new ArrayList<>();
                    for (User member : findChildren(userList, tl.getId(), UserRole.Member)) {
                        Map<String, Object> memberMap = new LinkedHashMap<>();
                        memberMap.put("id", member.getId().toString());
                        memberMap.put("name", member.getFirstName() + " " + member.getLastName());
                        memberMap.put("role", "member");
                        memberMap.put("image", member.getProfilePicture());
                        memberMap.put("email", member.getAiesecEmail());
                        memberList.add(memberMap);
                    }

                    tlMap.put("members", memberList);
                    teamLeaders.add(tlMap);
                }

                lcvpMap.put("tls", teamLeaders);
                lcvpList.add(lcvpMap);
            }

            lcpMap.put("lcvps", lcvpList);
            hierarchyList.add(lcpMap);
        }

        return hierarchyList;
    }

    private List<User> findChildren(List<User> allUsers, Long parentId, UserRole role) {
        return allUsers.stream()
                .filter(u -> u.getTeamLeaderId() != null)
                .filter(u -> u.getTeamLeaderId().equals(parentId.toString()))
                .filter(u -> u.getRole().equals(role))
                .collect(Collectors.toList());
    }

    private String getTenureString(Date joinedDate) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(joinedDate);
        int startYear = cal.get(Calendar.YEAR);
        return startYear + "-" + (startYear + 1);
    }



    /* 
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