package com.lui.churchlink.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Ministry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ministryId;

    private String ministry;

    // Leader/admin of this ministry
    @ManyToOne
    @JoinColumn(name = "leader_id")
    private User leader;

    // One ministry has many members
    @OneToMany(mappedBy = "ministry")
    private List<Member> members;

    // One ministry has many activities
    @OneToMany(mappedBy = "ministry")
    private List<Activity> activities;

    // Getters and Setters
    public int getMinistryId() { return ministryId; }
    public String getMinistry() { return ministry; }
    public void setMinistry(String ministry) { this.ministry = ministry; }
    public User getLeader() { return leader; }
    public void setLeader(User leader) { this.leader = leader; }
    public List<Member> getMembers() { return members; }
    public void setMembers(List<Member> members) { this.members = members; }
    public List<Activity> getActivities() { return activities; }
    public void setActivities(List<Activity> activities) { this.activities = activities; }
}