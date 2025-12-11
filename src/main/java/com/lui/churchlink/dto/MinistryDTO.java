package com.lui.churchlink.dto;

import com.lui.churchlink.model.Ministry;

public class MinistryDTO {

    private Integer ministryId;
    private String ministryName;

    public MinistryDTO() {}

    // Construct from entity
    public MinistryDTO(Ministry ministry) {
        this.ministryId = ministry.getMinistryId();
        this.ministryName = ministry.getMinistry();
    }

    // Construct manually
    public MinistryDTO(Integer ministryId, String ministryName) {
        this.ministryId = ministryId;
        this.ministryName = ministryName;
    }

    // Getters & Setters
    public Integer getMinistryId() { return ministryId; }
    public void setMinistryId(Integer ministryId) { this.ministryId = ministryId; }

    public String getMinistryName() { return ministryName; }
    public void setMinistryName(String ministryName) { this.ministryName = ministryName; }
}
