package com.aiesec.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aiesec.model.SessionLog;
import com.aiesec.model.User;
import com.aiesec.repository.SessionLogRepository;

@Service
public class SessionService {

    @Autowired
    private SessionLogRepository sessionLogRepo;

    @Autowired
    private UserService userService;  // Inject UserService

    public void logLogin(String userEmail, String ipAddress, String userAgent) {
        SessionLog log = new SessionLog();
        log.setUserEmail(userEmail);
        log.setLoginTime(LocalDateTime.now());
        log.setStatus("ACTIVE");
        log.setIpAddress(ipAddress);
        log.setUserAgent(userAgent);
        sessionLogRepo.save(log);
    }

    public void logLogout(String userEmail) {
        Optional<SessionLog> optional = sessionLogRepo.findTopByUserEmailOrderByLoginTimeDesc(userEmail);
        optional.ifPresent(log -> {
            log.setLogoutTime(LocalDateTime.now());
            log.setStatus("LOGGED_OUT");
            sessionLogRepo.save(log);
        });
    }

    public List<SessionLog> getAllSessions() {
        return sessionLogRepo.findAll();
    }

    // DTO class combining session log + user role
    public static class SessionLogWithRole {
        private Long id;
        private String userEmail;
        private String role;
        private LocalDateTime loginTime;
        private LocalDateTime logoutTime;
        private String status;
        private String ipAddress;
        private String userAgent;

        public SessionLogWithRole(SessionLog log, String role) {
            this.id = log.getId();
            this.userEmail = log.getUserEmail();
            this.role = role;
            this.loginTime = log.getLoginTime();
            this.logoutTime = log.getLogoutTime();
            this.status = log.getStatus();
            this.ipAddress = log.getIpAddress();
            this.userAgent = log.getUserAgent();
        }

        // Getters and setters (or use Lombok @Getter/@Setter if preferred)
        public Long getId() { return id; }
        public String getUserEmail() { return userEmail; }
        public String getRole() { return role; }
        public LocalDateTime getLoginTime() { return loginTime; }
        public LocalDateTime getLogoutTime() { return logoutTime; }
        public String getStatus() { return status; }
        public String getIpAddress() { return ipAddress; }
        public String getUserAgent() { return userAgent; }

        public void setId(Long id) { this.id = id; }
        public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
        public void setRole(String role) { this.role = role; }
        public void setLoginTime(LocalDateTime loginTime) { this.loginTime = loginTime; }
        public void setLogoutTime(LocalDateTime logoutTime) { this.logoutTime = logoutTime; }
        public void setStatus(String status) { this.status = status; }
        public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
        public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    }

    // New method to return session logs with user roles
    public List<SessionLogWithRole> getAllSessionsWithRoles() {
        List<SessionLog> sessions = sessionLogRepo.findAll();
        return sessions.stream().map(log -> {
            Optional<User> userOpt = userService.getUserByAiesecEmail(log.getUserEmail());
            String role = userOpt.map(user -> user.getRole().toString()).orElse("unknown");
            return new SessionLogWithRole(log, role);
        }).collect(Collectors.toList());
    }
}
