package com.aiesec.controller;

import com.aiesec.model.Department;
import com.aiesec.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // Allow requests from all origins (CORS configuration)
@RestController // Marks this class as a REST controller
@RequestMapping("/api/departments") // Base path for all department-related endpoints
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;  // Inject DepartmentService to handle business logic

    /**
     * Endpoint to add a new department
     * URL: POST /api/departments/add
     * Request Body: JSON representation of Department
     * Response: Created Department object
     */
    @PostMapping("/add")
    public Department addDepartment(@RequestBody Department department) {
        return departmentService.addDepartment(department);
    }

    /**
     * Endpoint to retrieve all departments
     * URL: GET /api/departments/
     * Response: List of all departments
     */
    @GetMapping("/")
    public List<Department> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    /**
     * Endpoint to retrieve a department by its ID
     * URL: GET /api/departments/{id}
     * Path Variable: id - ID of the department to retrieve
     * Response: Department object with the given ID
     */
    @GetMapping("/{id}")
    public Department getDepartmentById(@PathVariable Long id) {
        return departmentService.getDepartmentById(id);
    }

    /**
     * Endpoint to delete a department by its ID
     * URL: DELETE /api/departments/delete/{id}
     * Path Variable: id - ID of the department to delete
     * Response: Success message
     */
    @DeleteMapping("/delete/{id}")
    public String deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id); // Call service to perform deletion
        return "Department deleted successfully"; // Return confirmation message
    }
}

