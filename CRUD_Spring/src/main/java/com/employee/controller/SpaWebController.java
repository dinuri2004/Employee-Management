package com.employee.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaWebController {

    /**
     * Forwards all non-API and non-file routes to index.html for Angular client-side routing.
     */
    @GetMapping(value = {
        "/",
        "/{path:[^\\.]*}",
        "/{path:[^\\.]*}/**"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
