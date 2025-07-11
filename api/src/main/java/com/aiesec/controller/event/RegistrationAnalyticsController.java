package com.aiesec.controller.event;


import com.aiesec.dto.RegistrationAnalyticsDTO;
import com.aiesec.dto.TrendDTO;
import com.aiesec.service.interfaces.AnalyticsService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/analytics/registrations")
public class RegistrationAnalyticsController {

    private final AnalyticsService analyticsService;

    public RegistrationAnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/by-event")
    public List<RegistrationAnalyticsDTO> getRegistrationsByEvent(
            @RequestParam(defaultValue = "all") String type
    ) {
        return analyticsService.getRegistrationsByEvent(type.toLowerCase());
    }

    @GetMapping("/trends")
    public List<TrendDTO> getTrendData(
            @RequestParam(defaultValue = "all") String type,
            @RequestParam(defaultValue = "30") int days
    ) {
        return analyticsService.getTrendData(type.toLowerCase(), days);
    }

    @GetMapping("/status-distribution")
    public Map<String, Integer> getStatusDistribution(
            @RequestParam Long eventId,
            @RequestParam(defaultValue = "all") String type
    ) {
        return analyticsService.getStatusDistribution(eventId, type.toLowerCase());
    }

    @GetMapping("/export")
    public void exportRegistrationsCsv(
            @RequestParam(defaultValue = "all") String type,
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) String status,
            HttpServletResponse response
    ) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"registrations.csv\"");
        analyticsService.writeRegistrationsCsv(response.getWriter(), type.toLowerCase(), eventId, status);
    }



}
