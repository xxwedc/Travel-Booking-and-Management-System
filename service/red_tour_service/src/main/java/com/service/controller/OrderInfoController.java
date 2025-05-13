package com.service.controller;

import com.service.pojo.OrderInfo;
import com.service.pojo.PageItem;
import com.service.pojo.Result;
import com.service.service.OrderInfoService;
import com.service.utils.qrCodeConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin   // 解决跨域问题
public class OrderInfoController {
    @Autowired
    OrderInfoService orderService;


    @Autowired
    private qrCodeConfig qrCodeGenerationService;

//    订单请求二维码路由
    @PostMapping("/api/orders/makeQRCode")
    public Result generateQRCode(@RequestBody OrderInfo orderInfo) {
        return orderService.saveQRCode(orderInfo.getId());
    }
    //根据订单ID查询订单
    @PostMapping("/api/orders/selectOrderById")
    public Result selectOrderById(@RequestBody OrderInfo orderInfo) {
        return orderService.selectOrderByOrderId(orderInfo.getId());
    }

    @PostMapping("/api/orders/selectMyOrder")
    public Result selectOrder(@RequestHeader("Authorization") String token) {
        return orderService.selectOrderById(token);
    }

    @PostMapping("/api/order/insertOrder")
    public Result insertOrder(@RequestBody OrderInfo orderInfo) {
        System.out.println("前端传输的预约数据"+orderInfo);
        return orderService.insertOrder(orderInfo);
    }

    @GetMapping("/order/getRankingMonth")
    public Result getRanking() {
        return orderService.getRankingMonth();
    }
    @GetMapping("/order/getRankingYear")
    public Result getRankingYear() {
        return orderService.getRankingYear();
    }

    @PostMapping("/orderInfo/getOrderInfoByPage/{currentPage}/size/{pageSize}")
    public PageItem<OrderInfo> queryByPage(@PathVariable("currentPage") String current, @PathVariable("pageSize") String size, @RequestBody OrderInfo orderInfo) {
        return orderService.getOrderInfoByPage(current,size,orderInfo);
    }

    @PostMapping("/order/deleteOrderById")
    public Result deleteOrderById(@RequestBody OrderInfo orderInfo) {
        return orderService.deleteOrderById(orderInfo);
    }

    @PostMapping("/order/getScenicName")
    public Object getScenicName() {
        return orderService.getScenicName();
    }

    //    返回景点可以预约的时间段
    @GetMapping("/order/getScenicTime/{scenicId}")
    public Result getBookTime(@PathVariable("scenicId") String scenicId) {
        return orderService.getScenicTime(scenicId);
    }



}
