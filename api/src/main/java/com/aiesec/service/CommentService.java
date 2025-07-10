package com.aiesec.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.aiesec.enums.UserRole;
import com.aiesec.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.aiesec.dto.CommentDTO;
import com.aiesec.model.Comment;

import com.aiesec.model.User;
import com.aiesec.repository.CommentRepository;


@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepo;

    @Autowired
    private UserRepository userRepo;

    public Comment addComment(String content, Long memberId, String creatorEmail) {
        User member = userRepo.findById(memberId)
            .orElseThrow(() -> new RuntimeException("Member not found"));

        User creator = userRepo.findByAiesecEmail(creatorEmail)
            .orElseThrow(() -> new RuntimeException("Creator not found"));


        if (!UserRole.LCVP.equals(creator.getRole())) {
            throw new AccessDeniedException("Only LCVP can add comments");
        }

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setMember(member);
        comment.setCreatedBy(creator);
        comment.setCreatedAt(LocalDateTime.now());

        return commentRepo.save(comment);
    }

    public List<CommentDTO> getCommentsForMember(Long memberId, UserRole requesterRole) {

          if (UserRole.LCVP.equals(requesterRole) || UserRole.LCP.equals(requesterRole)) {
                    return commentRepo.findByMemberIdOrderByCreatedAtDesc(memberId)
                .stream()
                .map(c -> new CommentDTO(c.getId(), c.getContent(),
                      c.getCreatedBy(), c.getMember(),
                      c.getCreatedAt()))
                .collect(Collectors.toList());
        }else{
                throw new AccessDeniedException("Not authorized to view comments");
        }

    }
    
    public Comment updateComment(Long commentId, String content, String updaterEmail) {
        Comment comment = commentRepo.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        User updater = userRepo.findByAiesecEmail(updaterEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!comment.getCreatedBy().getAiesecEmail().equals(updaterEmail)) {
            throw new AccessDeniedException("Only comment author can update the comment");
        }
        
        comment.setContent(content);
        return commentRepo.save(comment);
    }

    public void deleteComment(Long commentId, String deleterEmail) {
        Comment comment = commentRepo.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        User deleter = userRepo.findByAiesecEmail(deleterEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!comment.getCreatedBy().getAiesecEmail().equals(deleterEmail) && 
            !UserRole.LCVP.equals(deleter.getRole())) {
            throw new AccessDeniedException("Not authorized to delete this comment");
        }
        
        commentRepo.delete(comment);
    }
}

