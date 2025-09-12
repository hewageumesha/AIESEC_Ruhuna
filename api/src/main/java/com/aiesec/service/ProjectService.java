package com.aiesec.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aiesec.model.Project;
import com.aiesec.repository.ProjectRepository;
import com.aiesec.security.ProjectNotFoundException;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id: " + id));
    }

    public Project addProject(Project project) {
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Project projectDetails) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id: " + id));

        project.setName(projectDetails.getName());
        project.setType(projectDetails.getType());
        project.setLogo(projectDetails.getLogo());
        project.setOverview(projectDetails.getOverview());
        project.setDescription(projectDetails.getDescription());
        project.setLinks(projectDetails.getLinks());
        project.setSdgFocus(projectDetails.getSdgFocus());
        project.setOpportunityLinks(projectDetails.getOpportunityLinks());
        project.setProjectBooklets(projectDetails.getProjectBooklets());
        project.setProjectFee(projectDetails.getProjectFee());
        project.setAvailableSlots(projectDetails.getAvailableSlots());
        project.setLogistics(projectDetails.getLogistics());
        project.setEligibility(projectDetails.getEligibility());
        project.setRole(projectDetails.getRole());
        project.setProjectActivities(projectDetails.getProjectActivities());

        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id: " + id));
        projectRepository.delete(project);
    }

    public List<Project> getPublishedProjects() {
        return projectRepository.findByPublishedTrue();
    }

    public Project togglePublishStatus(Long id, Boolean published) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"));
        project.setPublished(published);
        return projectRepository.save(project);
    }
}
