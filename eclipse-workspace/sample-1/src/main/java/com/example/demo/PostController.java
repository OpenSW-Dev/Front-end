package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PostController {

    @GetMapping("/post-detail")
    public String postDetail(Model model) {
        model.addAttribute("title", "게시글 상세 페이지");
        return "post-detail";
    }
}
