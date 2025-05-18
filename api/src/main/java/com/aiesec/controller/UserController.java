package com.aiesec.controller;
import com.aiesec.dto.CommentDTO;
import com.aiesec.dto.UserDTO;
import com.aiesec.dto.UserHierarchyDTO;
import com.aiesec.model.Role;
import com.aiesec.model.User;
import com.aiesec.repository.UserRepo;
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

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired 
    private UserRepo userRepo;


    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userRepo.getUserById(id));
    }

    @PostMapping("/add")
    public User addUser(@RequestBody User user) {
        return userService.addUser(user);
    }

    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable String aiesecEmail, @RequestBody User userDetails) {
        return userService.updateUser(aiesecEmail, userDetails);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable String aiesecEmail) {
        userService.deleteUser(aiesecEmail);
        return "User deleted successfully";
    }

    @GetMapping("/{aiesecEmail}")
    public Optional<User> getUserByAiesecEmail(@PathVariable String aiesecEmail) {
        return userService.getUserByAiesecEmail(aiesecEmail);
    }

    @GetMapping("/profile/{aiesecEmail}")
    public User getUserProfile(@PathVariable String aiesecEmail) {
        return userService.getUserByAiesecEmail(aiesecEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/getusers")
    public Map<String, Object> getUsers(@RequestParam(defaultValue = "5") int limit) {
        return userService.getUserStats(limit);
    }


    @GetMapping("/members")
    public List<User> getAllMembers() {
       List<User> members =  userRepo.findByRole(Role.Member);
       System.out.println(members.size());
        return members;
    }

    /* 
    @PutMapping(value = "/profile/update/{aiesecEmail}", consumes = {"multipart/form-data"})
    public User updateUserProfile(
            @PathVariable String aiesecEmail,
            @RequestPart User userDetails,
            @RequestPart(required = false) MultipartFile profilePhoto) throws Exception {
        
        return userService.updateUserProfile(aiesecEmail, userDetails, profilePhoto);
    }
    

    @GetMapping("/hierarchy")
    public ResponseEntity<List<UserHierarchyDTO>> getCommitteeHierarchy() {
        return ResponseEntity.ok(userService.getCommitteeHierarchy());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserDetails(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserDetails(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('LCP') or hasRole('ADMIN')")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.createUser(userDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('LCP') or hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateUser(id, userDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('LCP') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    */
}
