package com.notequiz.domain.user.repository;

import com.notequiz.domain.user.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("사용자 저장 및 이메일로 조회 테스트")
    void saveAndFindByEmail() {
        // given
        User user = User.builder()
                .email("test@example.com")
                .passwordHash("hashedpassword")
                .nickname("tester")
                .build();

        // when
        User savedUser = userRepository.save(user);
        User foundUser = userRepository.findByEmail("test@example.com").orElseThrow();

        // then
        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getId()).isEqualTo(savedUser.getId());
        assertThat(foundUser.getEmail()).isEqualTo("test@example.com");
        assertThat(foundUser.getNickname()).isEqualTo("tester");
        assertThat(foundUser.getCreatedAt()).isBeforeOrEqualTo(LocalDateTime.now());
    }
}
