package com.aiesec.dto;

import com.aiesec.enums.UserRole;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserHierarchyDTO {
    private Long id;
    private String name;
    private String aiesecEmail;
    private UserRole role;
    private String functionName;
    private String profilePicture;
    private String phoneNumber;
    private List<UserHierarchyDTO> children;    
}
