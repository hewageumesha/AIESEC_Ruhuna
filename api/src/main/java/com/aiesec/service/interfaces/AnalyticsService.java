package com.aiesec.service.interfaces;

import com.aiesec.dto.RegistrationAnalyticsDTO;
import com.aiesec.dto.TrendDTO;

import java.util.List;

public interface AnalyticsService {
    List<RegistrationAnalyticsDTO> getRegistrationsByEvent(String type);
    List<TrendDTO> getTrendData(String type, int days);

}