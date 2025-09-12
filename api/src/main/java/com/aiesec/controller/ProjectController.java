package com.aiesec.controller;

import com.aiesec.model.Project;
import com.aiesec.repository.ProjectRepository;
import com.aiesec.service.ProjectService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final ProjectService projectService;

    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
        this.projectService = new ProjectService();
    }

    @GetMapping("/")
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public Project createProject(@RequestBody Project project) {
        return projectRepository.save(project);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project updatedProject) {
        return projectRepository.findById(id).map(project -> {
            updatedProject.setId(id);
            return ResponseEntity.ok(projectRepository.save(updatedProject));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        if (!projectRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        projectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/published")
    public ResponseEntity<List<Project>> getPublishedProjects() {
        List<Project> projects = projectService.getPublishedProjects();
        return ResponseEntity.ok(projects);
    }

    @PatchMapping("/publish/{id}")
    public ResponseEntity<Project> togglePublishStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, Boolean> publishRequest) {
        Project updatedProject = projectService.togglePublishStatus(id, publishRequest.get("published"));
        return ResponseEntity.ok(updatedProject);
    }
}