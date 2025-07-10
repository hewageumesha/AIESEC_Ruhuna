package com.aiesec.dto;

import lombok.Data;
import java.util.List;

@Data
public class GalleryBatchUploadDTO {
    private Long eventId;
    private List<GalleryDTO> images;
}
