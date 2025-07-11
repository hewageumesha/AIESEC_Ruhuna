package com.aiesec.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.aiesec.enums.UserRole;
import com.aiesec.model.User;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long>{
    Optional<User> findByAiesecEmail(String aiesecEmail);
    Optional<User> findByAiesecEmailAndPassword(String aiesecEmail, String password);
    void deleteByAiesecEmail(String aieseEmail);
    List<User> findByRole(UserRole role);
    List<User> findByTeamLeaderAiesecEmail(String teamLeaderAiesecEmail);
    List<User> findByDepartmentId(Long departmentId);
    List<User> findByFunctionId(Long functionId);
    User findByUserName(String userName);


    @Query("SELECT COUNT(u) FROM User u WHERE u.joinedDate BETWEEN :start AND :end")
    Long countUsersJoinedLastMonth(Date start, Date end);

    // Get latest 5 users
    List<User> findTop5ByOrderByJoinedDateDesc();
    User getUserById(Long id);
    

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.password = ?2 WHERE u.aiesecEmail = ?1")
    void updatePassword(String aiesecEmail, String password);
}
