package com.aiesec.service.interfaces;

import com.aiesec.dto.RegistrationAnalyticsDTO;
import com.aiesec.dto.TrendDTO;

import java.io.IOException;
import java.io.Writer;
import java.util.List;
import java.util.Map;

public interface AnalyticsService {
    List<RegistrationAnalyticsDTO> getRegistrationsByEvent(String type);
    List<TrendDTO> getTrendData(String type, int days);
    Map<String, Integer> getStatusDistribution(Long eventId, String type);
    void writeRegistrationsCsv(Writer writer, String type, Long eventId, String status) throws IOException;



}