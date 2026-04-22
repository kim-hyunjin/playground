package com.hyunjin.study.springboot.domain.posts;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostsRepository extends JpaRepository<Posts, Long> {

    @Query("SELECT p FROM Posts p ORDER BY p.id DESC") // SpringDataJpa에서 제공하지 않는 메소드는 쿼리로 작성해도 됨.
    List<Posts> findAllDesc();
    // 규모가 있는 프로젝트에서는 조회용 프레임워크를 추가로 사용함. 대표적으로 querydsl, jooq, MyBatis 등이 있음.
    // Querydsl은 타입 안전성이 보장되고 국내 많은 회사에서 사용 중. 따라서 레퍼런스가 많다.
}

// 단순히 인터페이스를 생성 후, JpaRepository<Entity 클래스, PK 타입>을 상속하면 기본적인 CRUD 메소드가 자동으로 생성된다.
// 주의! Entity클래스와 Entity Repository는 함께 위치해야 한다.
