package com.lui.churchlink.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "ministry")
public class Ministry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ministryId;

    private String ministry;

    @ManyToOne
    @JoinColumn(name = "leader_id")
    private User leader;

    @OneToMany(mappedBy = "ministry")
    private List<Member> members;

    @OneToMany(mappedBy = "ministry")
    private List<Activity> activities;

    // Getters & Setters
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
