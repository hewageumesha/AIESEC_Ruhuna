package com.aiesec.controller;

import com.aiesec.dto.PasswordUpdateRequest;
import com.aiesec.dto.UserRequestDTO;
import com.aiesec.dto.UserUpdateDTO;
import com.aiesec.enums.Gender;
import com.aiesec.enums.UserRole;
import com.aiesec.model.User;

import com.aiesec.repository.UserRepository;
import com.aiesec.service.UserService;

import java.sql.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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


    @PutMapping(value = "/profile/update/{aiesecEmail}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<User> updateUserProfile(
            @PathVariable String aiesecEmail,
            @RequestPart("userDetails") User userDetails,
            @RequestPart(value = "profilePhoto", required = false) MultipartFile profilePhoto) throws Exception {
        
        User updatedUser = userService.updateUserProfile(aiesecEmail, userDetails, profilePhoto);
        return ResponseEntity.ok(updatedUser);
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

    @GetMapping("/totalaieseccount")
    public ResponseEntity<Map<String, Long>> getAiesecUserStats() {
        return ResponseEntity.ok(userService.getAiesecUserStats());
    }

    @GetMapping("/team-leader/{memberId}")
    public ResponseEntity<?> getTeamLeaderByMemberId(@PathVariable Long memberId) {
        try {
            User member = userRepo.getUserById(memberId);

            if (member == null) {
                System.out.println("Member not found with ID: " + memberId);
                return ResponseEntity.status(404).body("Member not found.");
            }

            System.out.println("member.getTeamLeaderId(): " + member.getTeamLeaderId());

            if (member.getTeamLeaderId() == null || member.getTeamLeaderId().isBlank()) {
                return ResponseEntity.status(404).body("Assigned person not found.");
            }

            Long teamLeaderId = Long.parseLong(member.getTeamLeaderId());
            User assignedPerson = userRepo.getUserById(teamLeaderId);

            if (assignedPerson == null) {
                System.out.println("No user found with ID: " + teamLeaderId);
                return ResponseEntity.status(404).body("Assigned user not found.");
            }

            return ResponseEntity.ok(assignedPerson);

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid team leader ID format.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error.");
        }
    }
}
