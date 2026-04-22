package com.hyunjin.study.springboot.domain.posts;

import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PostRepositoryTest {

    @Autowired
    PostsRepository postsRepository;

    @After // Junit에서 단위 테스트가 끝날 때마다 수행되는 메소드를 지정.
    public void cleanup() {
        postsRepository.deleteAll();
    }

    @Test
    public void saveAndFindAll() {
        //given
        String title = "테스트 게시글";
        String content = "테스트 본문";

        // save() - 테이블에 insert/update 쿼리 실행. id 값이 있다면 update, 없다면 insert.
        postsRepository.save(Posts.builder().title(title).content(content).author("kim-hyunjin@github.com").build());

        //when
        List<Posts> postsList = postsRepository.findAll(); // findAll() - 모든 데이터 조회

        //then
        Posts posts = postsList.get(0);
        assertThat(posts.getTitle()).isEqualTo(title);
        assertThat(posts.getContent()).isEqualTo(content);
    }

    @Test
    public void BaseTimeEntitySubmit() {
        //given
        LocalDateTime now = LocalDateTime.of(2020, 9, 1, 0, 0, 0);
        postsRepository.save(Posts.builder().title("title").content("content").author("author").build());

        //when
        List<Posts> postsList = postsRepository.findAll();

        //then
        Posts posts = postsList.get(0);

        System.out.println(">>>>>> createdDate="+posts.getCreatedDate()+", modifiedDate="+posts.getModifiedDate());

        assertThat(posts.getCreatedDate()).isAfter(now);
        assertThat(posts.getModifiedDate()).isAfter(now);
    }

}
