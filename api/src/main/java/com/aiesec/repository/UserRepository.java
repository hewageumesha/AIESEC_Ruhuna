package com.aiesec.repository;

import com.aiesec.enums.UserRole;
import com.aiesec.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByAiesecEmail(String aiesecEmail);
    Optional<User> findByAiesecEmailAndPassword(String aiesecEmail, String password);
    void deleteByAiesecEmail(String aieseEmail);
    List<User> findByRole(UserRole role);
    List<User> findByTeamLeaderAiesecEmail(String teamLeaderAiesecEmail);
    List<User> findByDepartmentId(Long departmentId);
    List<User> findByFunctionId(Long functionId);

    @Query("SELECT COUNT(u) FROM User u WHERE u.joinedDate BETWEEN :start AND :end")
    Long countUsersJoinedLastMonth(Date start, Date end);

    // Get latest 5 users
    List<User> findTop5ByOrderByJoinedDateDesc();
    User getUserById(Long id);
}

