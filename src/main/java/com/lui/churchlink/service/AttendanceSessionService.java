package com.lui.churchlink.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lui.churchlink.dto.AttendanceSessionDTO;
import com.lui.churchlink.model.Activity;
import com.lui.churchlink.model.AttendanceSession;
import com.lui.churchlink.model.Member;
import com.lui.churchlink.repository.ActivityRepository;
import com.lui.churchlink.repository.AttendanceSessionRepository;
import com.lui.churchlink.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceSessionService {

    private final AttendanceSessionRepository sessionRepository;
    private final MemberRepository memberRepository;
    private final ActivityRepository activityRepository;
    private final ObjectMapper objectMapper;

    public AttendanceSessionService(
            AttendanceSessionRepository sessionRepository,
            MemberRepository memberRepository,
            ActivityRepository activityRepository,
            ObjectMapper objectMapper
    ) {
        this.sessionRepository = sessionRepository;
        this.memberRepository = memberRepository;
        this.activityRepository = activityRepository;
        this.objectMapper = objectMapper;
    }

    // Save attendance session
    public void saveAttendanceSession(Integer activityId, String activityName, LocalDate date, List<Integer> presentIds) throws JsonProcessingException {
        if (date == null) date = LocalDate.now();

        // Compute absent members
        List<Integer> allMemberIds = memberRepository.findAll().stream()
                .map(Member::getMemberId)
                .collect(Collectors.toList());

        List<Integer> absentIds = allMemberIds.stream()
                .filter(id -> !presentIds.contains(id))
                .collect(Collectors.toList());

        // Create attendance session
        AttendanceSession session = new AttendanceSession();
        session.setActivityId(activityId);
        session.setActivityName(activityName);
        session.setDate(date);
        session.setPresent(objectMapper.writeValueAsString(presentIds));
        session.setAbsent(objectMapper.writeValueAsString(absentIds));

        sessionRepository.save(session);

        // Mark activity as completed
        if (activityId != null) {
            Activity activity = activityRepository.findById(activityId)
                    .orElseThrow(() -> new RuntimeException("Activity not found"));
            activity.setCompleted(true);
            activity.setStatus(Activity.ActivityStatus.COMPLETED);
            activityRepository.save(activity);
        }
    }

    // Fetch all sessions
    public List<AttendanceSessionDTO> getAllSessions() {
        return sessionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceSessionDTO> getGeneralSessions() {
        return sessionRepository.findByActivityIdIsNull().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceSessionDTO> getSpecificSessions() {
        return sessionRepository.findByActivityIdIsNotNull().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private AttendanceSessionDTO toDTO(AttendanceSession session) {
        try {
            String[] present = objectMapper.readValue(session.getPresent(), String[].class);
            String[] absent = objectMapper.readValue(session.getAbsent(), String[].class);

            return new AttendanceSessionDTO(
                    session.getSessionId(),
                    session.getActivityId(),
                    session.getActivityName(),
                    session.getDate(),
                    present,
                    absent
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse attendance session JSON", e);
        }
    }
}
