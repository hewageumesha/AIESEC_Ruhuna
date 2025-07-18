package com.aiesec.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.aiesec.model.ForgotPassword;
import com.aiesec.model.User;

public interface ForgotPasswordRepository extends JpaRepository<ForgotPassword, Integer>{
    @Query("SELECT forgotPassword FROM ForgotPassword forgotPassword WHERE forgotPassword.otp = ?1 AND forgotPassword.user = ?2")
    Optional<ForgotPassword> findByOtpAndUser(Integer otp, User User);
}
