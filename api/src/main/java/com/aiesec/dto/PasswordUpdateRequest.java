package com.aiesec.dto;

public class PasswordUpdateRequest {
    private String userAiesecEmail;
    private String currentPassword;
    private String newPassword;

    public String getCurrentPassword() {
        return currentPassword;
    }
    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }
    public String getNewPassword() {
        return newPassword;
    }
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
    public String getUserAiesecEmail() {
        return userAiesecEmail;
    }
    public void setUserAiesecEmail(String userAiesecEmail) {
        this.userAiesecEmail = userAiesecEmail;
    }
}
