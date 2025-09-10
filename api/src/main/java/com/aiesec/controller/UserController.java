package com.aiesec.controller;

import com.aiesec.dto.DepartmentDTO;
import com.aiesec.dto.FunctionDTO;
import com.aiesec.dto.PasswordUpdateRequest;
import com.aiesec.dto.UserDTO;
import com.aiesec.dto.UserRequestDTO;
import com.aiesec.dto.UserUpdateDTO;
import com.aiesec.enums.Gender;
import com.aiesec.enums.UserRole;
import com.aiesec.exception.ResourcesNotFoundException;
import com.aiesec.model.User;

import com.aiesec.repository.UserRepository;
import com.aiesec.service.UserService;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
        Long department = body.get("department") != null ? Long.parseLong(body.get("department").toString()) : null;
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
        dto.setDepartmentId(department);
        dto.setRole(role);
        dto.setFirstName(firstName);
        dto.setLastName(lastName);
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

    public UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setAiesecEmail(user.getAiesecEmail());
        dto.setPhone(user.getPhoneNumber());
        dto.setStreetAddress(user.getStreetAddress());
        dto.setCity(user.getCity());
        dto.setStateORProvince(user.getStateORProvince());
        dto.setS_department(user.getS_department());
        dto.setFaculty(user.getFaculty());
        dto.setBirthday(user.getBirthday());
        dto.setGender(user.getGender());
        dto.setJoinedDate(user.getJoinedDate());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setTeamLeaderAiesecEmail(user.getTeamLeaderAiesecEmail());

        if (user.getDepartment() != null) {
            dto.setDepartmentId(new DepartmentDTO(user.getDepartment().getId(), user.getDepartment().getName()));
            dto.setDepartmentName(user.getDepartment().getName());
        }

        if (user.getFunction() != null) {
            dto.setFunctionId(new FunctionDTO(user.getFunction().getId(), user.getFunction().getName()));
            dto.setFunctionName(user.getFunction().getName());
        }
        return dto;
    }


    @GetMapping("/members")
    public List<UserDTO> getAllMembers() {
        List<User> members = userRepo.findByRole(UserRole.Member);
        return members.stream().map(this::mapToDTO).collect(Collectors.toList());
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

    @GetMapping("/list")
    public List<User> getUsersList(@AuthenticationPrincipal User currentUser,
                               @RequestParam(required = false) UserRole roleFilter) {
        if (currentUser.getRole() == UserRole.LCP) {
            return userService.getAllUsers(roleFilter);
        } else if (currentUser.getRole() == UserRole.LCVP) {
            return userService.getUsersByFunction(currentUser.getFunction(), roleFilter);
        } else if (currentUser.getRole() == UserRole.Team_Leader) {
            return userService.getMembersByFunction(currentUser.getFunction());
        } else {
            return List.of(currentUser);
        }
    }
  
    @GetMapping("/birthdays")
    public ResponseEntity<List<UserDTO>> getAllBirthdays() {
        List<User> users = userRepo.findAll();

        List<UserDTO> birthdays = users.stream()
            .filter(user -> user.getBirthday() != null) // only users with a birthday
            .map(this::mapToDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(birthdays);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Integer id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
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
