package com.aiesec.enums;

public enum UserRole {
    LCP("Local Committee President"),
    LCVP("Local Committee Vice President"),
    Team_Leader("Team Leader"),
    Member("Member");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
