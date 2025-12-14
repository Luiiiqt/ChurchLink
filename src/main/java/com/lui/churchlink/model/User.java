package com.lui.churchlink.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "leader")
    private List<Ministry> ministriesLed;

    public Integer getUserId() { return userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public List<Ministry> getMinistriesLed() { return ministriesLed; }
    public void setMinistriesLed(List<Ministry> ministriesLed) { this.ministriesLed = ministriesLed; }
}
