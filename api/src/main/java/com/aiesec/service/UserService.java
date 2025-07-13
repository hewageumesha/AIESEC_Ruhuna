package com.aiesec.service;

import com.aiesec.dto.PasswordUpdateRequest;
import com.aiesec.dto.UserDTO;
import com.aiesec.dto.UserHierarchyDTO;
import com.aiesec.dto.UserRequestDTO;
import com.aiesec.dto.UserUpdateDTO;
import com.aiesec.enums.UserRole;
import com.aiesec.model.Function;
import com.aiesec.model.Department;
import com.aiesec.model.User;
import com.aiesec.repository.UserRepository;
import com.aiesec.repository.FunctionRepo;


import java.util.Collections;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    @Autowired
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    private FunctionRepo functionRepository;

    @Autowired
    private JavaMailSender mailSender;

    // Method to add a new user
    public User addUser(UserRequestDTO dto) {
    User user = new User();
    user.setAiesecEmail(dto.getAiesecEmail());
    user.setEmail(dto.getEmail());
    user.setFirstName(dto.getFirstName());
    user.setLastName(dto.getLastName());
    user.setRole(dto.getRole());
    user.setBirthday(dto.getBirthday());
    user.setJoinedDate(dto.getJoinedDate());

    Function function = functionRepository.findById(dto.getFunctionId())
            .orElseThrow(() -> new RuntimeException("Function not found"));
    user.setFunction(function);

    // Check team leader if role == Member
    if (dto.getRole() != UserRole.LCP) {
        if (dto.getTeamLeaderAiesecEmail() == null || dto.getTeamLeaderAiesecEmail().isEmpty()) {
            throw new RuntimeException("teamLeaderAiesecEmail is required for MEMBER role");
        }

        User teamLeader = userRepository.findByAiesecEmail(dto.getTeamLeaderAiesecEmail())
                .orElseThrow(() -> new RuntimeException("Team leader not found"));

        if (teamLeader.getRole() == UserRole.Member) {
            throw new RuntimeException("Provided team leader email does not belong to a TEAM_LEADER");
        }

        user.setTeamLeaderAiesecEmail(dto.getTeamLeaderAiesecEmail());
        user.setTeamLeaderId(String.valueOf(teamLeader.getId())); // Optional, if you want
    }

    String tempPassword = generateTempPassword();
    user.setPassword(tempPassword);
    

    userRepository.save(user);

    sendTempPasswordEmail(user.getEmail(), tempPassword, user.getAiesecEmail());

    return user;
}


    // Method to update user details
    @Transactional
    public User updateUser(String aiesecEmail, UserUpdateDTO dto) {
        User user = userRepository.findByAiesecEmail(aiesecEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getFunctionId() != null) {
            Function function = functionRepository.findById(dto.getFunctionId())
                    .orElseThrow(() -> new RuntimeException("Function not found"));
            user.setFunction(function);
        }

        if (dto.getRole() != null) {
            user.setRole(dto.getRole());
        }

        return userRepository.save(user);
    }

    // Method to delete a user
    public void deleteUser(String aiesecEmail) {
        User user = userRepository.findByAiesecEmail(aiesecEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

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
        if (userDetails.getS_department() != null) {
            user.setS_department(userDetails.getS_department());
        }
        if (userDetails.getFaculty() != null) {
            user.setFaculty(userDetails.getFaculty());
        }
        if(userDetails.getTeamLeaderAiesecEmail() != null) {
            user.setTeamLeaderAiesecEmail(userDetails.getTeamLeaderAiesecEmail());
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
            lcpDetails.put("phoneNumber", lcp.getPhoneNumber());
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
                lcvpMap.put("phoneNumber", lcvp.getPhoneNumber());
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
                    tlMap.put("phoneNumber", tl.getPhoneNumber());

                    // Members
                    List<Map<String, Object>> memberList = new ArrayList<>();
                    for (User member : findChildren(userList, tl.getId(), UserRole.Member)) {
                        Map<String, Object> memberMap = new LinkedHashMap<>();
                        memberMap.put("id", member.getId().toString());
                        memberMap.put("name", member.getFirstName() + " " + member.getLastName());
                        memberMap.put("role", "member");
                        memberMap.put("image", member.getProfilePicture());
                        memberMap.put("email", member.getAiesecEmail());
                        memberMap.put("phoneNumber", member.getPhoneNumber());
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

    public String updatePassword(PasswordUpdateRequest request) {

        User user = userRepository.findByAiesecEmail(request.getUserAiesecEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (request.getCurrentPassword().equals(request.getNewPassword())) {
            throw new RuntimeException("New password must be different");
        }

        if (request.getNewPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password updated successfully";
    }

    public String generateTempPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    public void sendTempPasswordEmail(String toEmail, String tempPassword, String aiesecEmail) {
    String subject = "Your Temporary AIESEC Password";
    String text = "Hello,\n\n" +
                  "Your AIESEC email: " + aiesecEmail + "\n" +
                  "Your temporary password: " + tempPassword + "\n\n" +
                  "Please log in and change it as soon as possible.";

    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(toEmail);
    message.setSubject(subject);
    message.setText(text);
    mailSender.send(message);
}

 public List<UserDTO> getAllUsers() {
        List<User> users = this.userRepository.findAll();
        if (users == null || users.isEmpty()) {
            return Collections.emptyList(); // or return a new ArrayList<UserDto>()
        }
        return users.stream().map(this::userToDto).toList();

=======
    public void sendTempPasswordEmail(String toEmail, String tempPassword) {
        String subject = "Your Temporary AIESEC Password";
        String text = "Hello,\n\nYour temporary password is: " + tempPassword + "\n\nPlease log in and change it as soon as possible.";
>>>>>>> 9a66ff04089ef00e33b999bfeb5fe8e3f94fc62d

    }

    public UserDTO userToDto(User user){
        UserDTO userDto = new UserDTO();
        userDto.setId(Long.valueOf(user.getId()));
        userDto.setFirstName(user.getFirstName());
        userDto.setNoOfTask(user.getNoOfTask());
        userDto.setRole(user.getRole());

        // Department
        if (user.getDepartment() != null) {
            Department Dep = new Department();
            Dep.setId(user.getDepartment().getId());
            Dep.setName(user.getDepartment().getName());
            userDto.setDepartmentName(user.getDepartment().getName());
        }

        // ✅ Function
        if (user.getFunction() != null) {
            Function func = new Function();
            func.setId(user.getFunction().getId());
            func.setName(user.getFunction().getName());
            userDto.setFunctionId(func);
            userDto.setFunctionName(user.getFunction().getName());
        }

        return userDto;
    }

}