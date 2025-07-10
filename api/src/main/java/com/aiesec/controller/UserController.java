package com.aiesec.controller;
import com.aiesec.dto.CommentDTO;
import com.aiesec.dto.PasswordUpdateRequest;
import com.aiesec.dto.UserDTO;
import com.aiesec.dto.UserHierarchyDTO;
import com.aiesec.dto.UserRequestDTO;
import com.aiesec.dto.UserUpdateDTO;
import com.aiesec.enums.UserRole;
import com.aiesec.model.User;

import com.aiesec.repository.UserRepository;
import com.aiesec.security.UserDetailsImpl;
import com.aiesec.service.CommentService;
import com.aiesec.service.UserService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/add")
    public User addUser(@RequestBody UserRequestDTO dto) {
        return userService.addUser(dto);
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
    public String updatePassword(
            @RequestParam String aiesecEmail, // you can pass this from logged-in user context instead of request param
            @RequestBody PasswordUpdateRequest request
    ) {
        return userService.updatePassword(aiesecEmail, request);
    }
}
