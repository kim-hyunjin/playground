package com.hyunjin.study.springboot.web;

import com.hyunjin.study.springboot.config.auth.LoginUser;
import com.hyunjin.study.springboot.config.auth.dto.SessionUser;
import com.hyunjin.study.springboot.services.posts.PostsService;
import com.hyunjin.study.springboot.web.dto.PostsResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RequiredArgsConstructor
@Controller
public class IndexController {

    private final PostsService postsService;

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("posts", postsService.findAllDesc()); // 서버 템플릿 안에서 사용할 수 있는 객체를 저장.
        return "index"; // 앞의 경로와 파일 확장자를 자동으로 지정해줌. 앞의 경로는 src/main/resources/templates. 확장자는 .mustache가 붙는다.
    }

    @GetMapping("/posts-form")
    public String postsSave() {
        return "posts-form";
    }

    @GetMapping("/posts/{id}")
    public String postGet(@PathVariable Long id, @LoginUser SessionUser user, Model model) {
        PostsResponseDto dto = postsService.findById(id);
        model.addAttribute("post", dto);

        if(user != null) {
            if(user.getName().equals(dto.getAuthor())) {
                return "posts-update";
            }
        }

        return "post";
    }
}
