package com.aiesec.controller;

import com.aiesec.dto.DepartmentDTO;
import com.aiesec.service.DepartmentService;
import com.aiesec.model.Department;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController 
@RequestMapping("/api/departments") 
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;  

    @PostMapping("/add")
    public DepartmentDTO addDepartment(@RequestBody DepartmentDTO dto) {
        return departmentService.addDepartment(dto);
    }

    @GetMapping("/")
    public List<DepartmentDTO> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    @GetMapping("/{id}")
    public DepartmentDTO getDepartmentById(@PathVariable Long id) {
        return departmentService.getDepartmentById(id);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return "Function deleted successfully with id: " + id;
    }

    @PutMapping("/update/{id}")
    public DepartmentDTO updateDepartment(@PathVariable Long id, @RequestBody DepartmentDTO dto) {
        return departmentService.updateDepartment(id, dto);
    }

    @GetMapping("/all")
    public List<String> getDepartments() {
        List<Department> functions = departmentService.getDepartments();
        return functions.stream()
                .map(Department::getName)
                .collect(Collectors.toList());
    }
}


