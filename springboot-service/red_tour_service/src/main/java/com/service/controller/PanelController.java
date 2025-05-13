package com.service.controller;


import com.service.pojo.Result;
import com.service.service.PanelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin   // 解决跨域问题
public class PanelController {

    @Autowired
    PanelService panelService;


    @GetMapping("/api/getPanel")
    public Result getPanel() {
        return panelService.getPanel();
    }




}
