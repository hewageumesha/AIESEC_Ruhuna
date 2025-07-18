package com.aiesec.controller;

import com.aiesec.dto.CommentDTO;
import com.aiesec.dto.PasswordUpdateRequest;
import com.aiesec.dto.UserDTO;
import com.aiesec.dto.UserHierarchyDTO;
import com.aiesec.dto.UserRequestDTO;
import com.aiesec.dto.UserUpdateDTO;
import com.aiesec.enums.Gender;
import com.aiesec.enums.UserRole;
import com.aiesec.exception.ResourcesNotFoundException;
import com.aiesec.model.User;

import com.aiesec.repository.UserRepository;
import com.aiesec.security.UserDetailsImpl;
import com.aiesec.service.CommentService;
import com.aiesec.service.UserService;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired 
    private UserRepository userRepo;


    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userRepo.getUserById(id));
    }

@Autowired
private JavaMailSender mailSender;

@GetMapping("/sendmail")
public String senMail() {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo("n.u.m.hewage@gmail.com");
    message.setSubject("Test Mail");
    message.setText("This is a test email from Spring Boot!");

    mailSender.send(message);

    return "Mail sent successfully!";
}

    @GetMapping("/id/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Integer id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }


    @PostMapping("/add")
    public User addUser(@RequestBody Map<String, Object> body) {

        try {
        
        String aiesecEmail = (String) body.get("aiesecEmail");
        String email = (String) body.get("email");
        Date birthday = body.get("birthday") != null ? java.sql.Date.valueOf(body.get("birthday").toString()) : null;
        Long function = body.get("function") != null ? Long.parseLong(body.get("function").toString()) : null;
        String firstName = (String) body.get("firstName");
        String lastName = (String) body.get("lastName");
        Date joinedDate = body.get("joinedDate") != null ? java.sql.Date.valueOf(body.get("joinedDate").toString()) : null;
        Gender gender = body.get("gender") != null ? Gender.valueOf(body.get("gender").toString()) : null;
        UserRole role = body.get("role") != null ? UserRole.valueOf(body.get("role").toString()) : null;
        String team_leader_aiesecEmail = (String) body.get("teamLeaderAiesecEmail");

        UserRequestDTO dto  = new UserRequestDTO();
        dto.setAiesecEmail(aiesecEmail);
        dto.setEmail(email);
        dto.setFunctionId(function);
        dto.setRole(role);
        dto.setFirstName(firstName);
        dto.setLastName(lastName);
        dto.setTeamLeaderAiesecEmail(aiesecEmail);
        dto.setBirthday(birthday);
        dto.setJoinedDate(joinedDate);
        dto.setGender(gender);
        dto.setTeamLeaderAiesecEmail(team_leader_aiesecEmail);

        String tempString = userService.generateTempPassword();
        userService.sendTempPasswordEmail(email, tempString, aiesecEmail);
        return userService.addUser(dto);

       } catch (Exception e) {
            e.printStackTrace();
            return new User();
        }
    }

    @PostMapping("/update/{aiesecEmail}")
    public User updateUser(@PathVariable String aiesecEmail, @RequestBody UserUpdateDTO dto) {
        return userService.updateUser(aiesecEmail, dto);
    }
    

    @DeleteMapping("/delete/{aiesecEmail}")
    public String deleteUser(@PathVariable String aiesecEmail) {
        userService.deleteUser(aiesecEmail);
        return "User deleted successfully!";
    }

    @GetMapping("/{aiesecEmail}")
    public Optional<User> getUserByAiesecEmail(@PathVariable String aiesecEmail) {
        return userService.getUserByAiesecEmail(aiesecEmail);
    }

    @GetMapping("/profile/{aiesecEmail}")
    public ResponseEntity<User> getProfile(@PathVariable String aiesecEmail) {
        User user = userService.getUserProfile(aiesecEmail);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/getusers")
    public Map<String, Object> getUsers(@RequestParam(defaultValue = "5") int limit) {
        return userService.getUserStats(limit);
    }


    @GetMapping("/members")
    public List<User> getAllMembers() {
       List<User> members =  userRepo.findByRole(UserRole.Member);
       System.out.println(members.size());
        return members;
    }

    @GetMapping("/getall")
    public List<User> getAll() {
       List<User> members =  userRepo.findAll();
       System.out.println(members.size());
        return members;
    }


    @PutMapping(value = "/profile/update/{aiesecEmail}")
    public User updateUserProfile(
            @PathVariable String aiesecEmail,
            @RequestPart User userDetails,
            @RequestPart(required = false) MultipartFile profilePhoto) throws Exception {
        
        return userService.updateUserProfile(aiesecEmail, userDetails, profilePhoto);
    }
    

    @GetMapping("/hierarchy")
    public ResponseEntity<List<Map<String, Object>>> getCommitteeHierarchy() {
        return ResponseEntity.ok(userService.getCommitteeHierarchy());
    }

    @PostMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordUpdateRequest request) {
        try {
            String message = userService.updatePassword(request);
            return ResponseEntity.ok().body(message);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/aiesec-emails")
    public List<String> getAllAiesecEmails() {
        return userRepo.findAll()
            .stream()
            .map(User::getAiesecEmail)
            .collect(Collectors.toList());
    }

    @GetMapping("/profile/id/{id}")
    public ResponseEntity<Map<String, Object>> getProfileById(@PathVariable Integer id) {
        User user = userRepo.findById(Long.valueOf(id))
                .orElseThrow(() -> new ResourcesNotFoundException("User", "id", id));

        Map<String, Object> simpleUser = new HashMap<>();
        simpleUser.put("id", user.getId());
        simpleUser.put("firstName", user.getFirstName());
        simpleUser.put("role", user.getRole().toString());
        simpleUser.put("departmentId", user.getDepartment() != null ? user.getDepartment().getId() : null);

        // ✅ Add functionId as an object {id, name}
        if (user.getFunction() != null) {
            Map<String, Object> functionMap = new HashMap<>();
            functionMap.put("id", user.getFunction().getId());
            functionMap.put("name", user.getFunction().getName());
            simpleUser.put("functionId", functionMap);
        } else {
            simpleUser.put("functionId", null);
        }

        return ResponseEntity.ok(simpleUser);
    }
}
