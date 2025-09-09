package com.aiesec.repository.birthday;

import com.aiesec.model.birthday.Birthday;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface BirthdayRepository extends JpaRepository<Birthday, Long> {
    List<Birthday> findByDate(LocalDate date);
}
