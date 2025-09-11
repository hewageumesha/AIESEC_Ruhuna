package com.aiesec.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FunctionDTO {
    private Long id;
    private String name;

    public FunctionDTO() {
    }

    public FunctionDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
