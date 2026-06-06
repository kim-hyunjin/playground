package com.hyunjin.study.springboot.domain.posts;

import com.hyunjin.study.springboot.domain.BaseTimeEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Getter
@NoArgsConstructor // 기본생성자 자동 추가
@Entity // 테이블과 링크될 클래스임을 나타냄. 기본값으로 카멜케이스로 된 클래스 이름을 언더스코어 네이밍(_)으로 테이블 이름을 매칭한다.
public class Posts extends BaseTimeEntity {

    @Id // 해당 테이블의 PK 필드를 나타낸다.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // PK 생성규칙. 스프링 부트2.0에서는 GenerationType.IDENTITY 옵션을 추가해야 auto_increment가 된다.
    private Long id;

    @Column(length = 500, nullable = false) // 테이블의 컬럼을 나타냄. 선언하지 않아도 테이블의 컬럼이 된다. 필요한 옵션이 있으면 사용.
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String author;

    @Builder // 해당 클래스의 빌더 패턴 클래스를 생성. 생성자 상단에 선언하면 생성자에 포함된 필드만 빌더에 포함한다.
    public Posts(String title, String content, String author) {
        this.title = title;
        this.content = content;
        this.author = author;
    }

    public void update(String title, String content) { // JPA 영속성 컨텍스트. 트랜잭션 안에서 데이터베이스에서 데이터를 가져오면 영속성 컨텍스트가 유지된 상태. 이 상태에서 데이터가 변경되면 트랜잭션이 끝나는 시점에 해당 테이블에 데이터 변경분을 반영한다.
        this.title = title;
        this.content = content;
    }

    // Setter를 만들지 않는 이유는 인스턴스 값들이 언제 어디서 변해야 하는지 코드상으로 명확하게 구분할 수 없어 차후 기능 변경시 복잡해지기 때문이다.
    // Setter가 없기 때문에 DB에 값을 삽입하기 위해서 기본적으로 생성자를 사용한다.
    // 값 변경이 필요한 경우 해당 이벤트에 맞는 public 메소드를 호출하여 변경한다.
}
