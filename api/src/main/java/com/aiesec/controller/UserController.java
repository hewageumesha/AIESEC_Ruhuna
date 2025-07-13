package com.aiesec.controller;

import com.aiesec.dto.PasswordUpdateRequest;
import com.aiesec.dto.UserRequestDTO;
import com.aiesec.dto.UserUpdateDTO;
import com.aiesec.enums.UserRole;
import com.aiesec.enums.Gender;
import com.aiesec.model.User;

import com.aiesec.repository.UserRepository;
import com.aiesec.service.UserService;

import java.sql.Date;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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

    @Autowired
    private JavaMailSender mailSender;


    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userRepo.getUserById(id));
    }


    @PostMapping("/add")
    public User addUser(@RequestBody Map<String, Object> body) {
        String aiesecEmail = (String) body.get("aiesecEmail");
        String email = (String) body.get("email");
        Date birthday = (Date) body.get("birthday");
        Long function = (Long) body.get("function");
        String firstName = (String) body.get("firstName");
        String lastName = (String) body.get("lastName");
        Gender gender = (Gender) body.get("gender");
        Date joinedDate = (Date) body.get("joinedDate");
        UserRole role = (UserRole) body.get("role");
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
        userService.sendTempPasswordEmail(email, tempString);

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
}
