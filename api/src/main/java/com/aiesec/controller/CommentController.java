package com.aiesec.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aiesec.dto.CommentDTO;
import com.aiesec.model.Comment;
import com.aiesec.enums.UserRole;
import com.aiesec.model.User;
import com.aiesec.repository.UserRepository;
import com.aiesec.service.CommentService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserRepository userRepo;

    @PostMapping("/add")
    public Comment addComment(@RequestBody Map<String, Object> requestBody) {

        String content = (String) requestBody.get("content");
        Long memberId = Long.valueOf(requestBody.get("memberId").toString());
        String creatorEmail = (String) requestBody.get("creatorEmail");

        System.out.println(content);
        System.out.println(memberId);
        System.out.println(creatorEmail);

        return commentService.addComment(content, memberId, creatorEmail);
    }

    @GetMapping("/member/{memberId}/{requesterRole}")
    public ResponseEntity<List<CommentDTO>> getCommentsForMember(
            @PathVariable Long memberId,
            @PathVariable String requesterRole
    ) {
        List<CommentDTO> comments = commentService.getCommentsForMember(memberId, UserRole.valueOf(requesterRole));
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/members")
    public ResponseEntity<List<User>> getAllMembersWithComments() {
        List<User> members = userRepo.findByRole(UserRole.Member);
        return ResponseEntity.ok(members);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable Long id) {
        boolean deleted = commentService.deleteCommentById(id);
        if (deleted) {
            return ResponseEntity.ok("Comment deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found");
        }
    }
}
