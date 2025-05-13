package com.service.service;

import com.service.pojo.OrderInfo;
import com.service.pojo.PageItem;
import com.service.pojo.Result;
import org.springframework.http.ResponseEntity;

public interface OrderInfoService {
    Result selectOrderById(String token);
    Result insertOrder(OrderInfo orderInfo);
    Result getRankingMonth();
    Result getRankingYear();

    PageItem<OrderInfo> getOrderInfoByPage(String pageNum, String pageSize, OrderInfo query);

    Result deleteOrderById(OrderInfo orderInfo);

//    获取景点下拉框
    Object getScenicName();

    //    返回景点可以预约的时间段
    Result getScenicTime(String scenicId);

   Result saveQRCode(String content);

   Result selectOrderByOrderId(String Id);

}
