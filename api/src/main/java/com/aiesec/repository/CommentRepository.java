package com.aiesec.repository;

import com.aiesec.model.Comment;
import com.aiesec.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByMemberOrderByCreatedAtDesc(Long member);
}

