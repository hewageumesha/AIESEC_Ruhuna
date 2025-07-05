package com.aiesec.controller;
import java.util.List;
import java.util.Map;

import com.aiesec.enums.UserRole;
import com.aiesec.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.aiesec.dto.CommentDTO;
import com.aiesec.model.Comment;
import com.aiesec.model.User;
import com.aiesec.service.CommentService;

@CrossOrigin(origins = "*") // Allow cross-origin requests from any origin
@RestController // Mark this class as a REST controller
@RequestMapping("/api/comments") // Base path for all comment-related APIs
public class CommentController {

    // Injecting the CommentService to delegate business logic
    @Autowired
    private CommentService commentService;

    // Injecting the UserRepo to access user-related DB operations
    @Autowired
    private UserRepository userRepo;

     /**
     * Endpoint to add a new comment to a member profile
     * Expects a JSON request body with: content, memberId, and creatorEmail
     */
    @PostMapping("/add")
    public Comment addComment(@RequestBody Map<String, Object> requestBody) {

        // Extract fields from the incoming request body
        String content = (String) requestBody.get("content");
        Long memberId = Long.valueOf(requestBody.get("memberId").toString());
        String creatorEmail = (String) requestBody.get("creatorEmail");

        // Print for debugging purposes
        System.out.println(content);
        System.out.println(memberId);
        System.out.println(creatorEmail);

        // Call the service to create and save the comment
        return commentService.addComment(content, memberId, creatorEmail);
    }

    /**
     * Endpoint to fetch comments for a specific member, based on requester's role
     * Example: /api/comments/member/5/Manager
     */
    @GetMapping("/member/{memberId}/{requesterRole}")
    public ResponseEntity<List<CommentDTO>> getCommentsForMember(
            @PathVariable Long memberId, // ID of the member whose comments to fetch
            @PathVariable String requesterRole // Role of the requester (to filter comments by access)
    ) {
        // Convert the role from String to Enum
        List<CommentDTO> comments = commentService.getCommentsForMember(memberId, UserRole.valueOf(requesterRole));
        return ResponseEntity.ok(comments); // Return the filtered comment list
    }

    /**
     * Endpoint to retrieve all users with the role "Member"
     * This can be used to list all members who may have comments
     */
    @GetMapping("/members")
    public ResponseEntity<List<User>> getAllMembersWithComments() {
        List<User> members = userRepo.findByRole(UserRole.Member); // Fetch users with Member role
        return ResponseEntity.ok(members); // Return list of members
    }
}
