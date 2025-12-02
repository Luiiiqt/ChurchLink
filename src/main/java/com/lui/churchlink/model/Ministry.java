package com.lui.churchlink.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Ministry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ministryId;

    private String ministry;

    // Many Ministries → One User
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // One Ministry → Many Members
    @OneToMany(mappedBy = "ministry")
    private List<Member> members;

    // One Ministry → Many Activities
    @OneToMany(mappedBy = "ministry")
    private List<Activity> activities;

    public int getMinistryId() {
        return ministryId;
    }

    public String getMinistry() {
        return ministry;
    }

    public void setMinistry(String ministry) {
        this.ministry = ministry;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Member> getMembers() {
        return members;
    }

    public void setMembers(List<Member> members) {
        this.members = members;
    }

    public List<Activity> getActivities() {
        return activities;
    }

    public void setActivities(List<Activity> activities) {
        this.activities = activities;
    }
}