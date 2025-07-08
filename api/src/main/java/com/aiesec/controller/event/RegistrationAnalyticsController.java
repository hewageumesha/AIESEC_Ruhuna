package com.aiesec.controller.event;


import com.aiesec.dto.RegistrationAnalyticsDTO;
import com.aiesec.dto.TrendDTO;
import com.aiesec.service.interfaces.AnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

}
