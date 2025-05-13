package com.service.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.google.zxing.WriterException;
import com.service.mapper.OrderInfoMapper;
import com.service.mapper.ScenicMapper;
import com.service.mapper.UserMapper;
import com.service.pojo.*;
import com.service.service.OrderInfoService;
import com.service.utils.JwtUtils;
import com.service.utils.TimeConfig;
import com.service.utils.qrCodeConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.Time;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import com.google.zxing.WriterException;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class OrderInfoServiceImpl implements OrderInfoService {
    @Autowired
    OrderInfoMapper orderInfoMapper;
    @Autowired
    ScenicMapper scenicMapper;
    @Autowired
    UserMapper userMapper;

    @Autowired
    qrCodeConfig qrCodeConfig;



    @Override
    public Result selectOrderById(String token) {
        try {
            if (JwtUtils.verifyToken(token)) {
                String tokenId = JwtUtils.getAudience(token);
                if (tokenId!= null) {
                    Long id = Long.parseLong(tokenId);
                    // 查询该用户的所有的预约信息
                    LambdaQueryWrapper<OrderInfo> lqw = new LambdaQueryWrapper<>();
                    // 设置查询条件
                    lqw.eq(OrderInfo::getUserId, id);
                    List<OrderInfo> orders = orderInfoMapper.selectList(lqw);

                    if (orders!= null &&!orders.isEmpty()) {
                        // 遍历订单列表，设置景区名称
                        for (OrderInfo order : orders) {
                            String scenicId = order.getScenicId();
                            Scenic scenic = scenicMapper.selectById(scenicId);
                            if (scenic!= null) {
                                order.setScenicName(scenic.getName());
                            }
                            String userId = order.getUserId();
                            User user = userMapper.selectById(userId);
                            if (user!= null) {
                                order.setUserName(user.getUsername());
                            }
                        }
                        return new Result(200, "查询成功", orders);
                    } else {
                        return new Result(500, "查询失败，未找到订单");
                    }
                }
            }
            return new Result(400, "无效令牌");
        } catch (Exception e) {
            return new Result(500, "内部错误：" + e.getMessage());
        }
    }

    @Override
    public Result insertOrder(OrderInfo orderInfo) {
//        验证当前用户，获取其id
        String token= orderInfo.getUserId();
        if (JwtUtils.verifyToken(token)) {
            String tokenId = JwtUtils.getAudience(token);
            orderInfo.setUserId(tokenId); // 设置新的用户 ID
            int ret=orderInfoMapper.insert(orderInfo);
            if (ret>0){
                return new Result(200, "预约成功");
            }else{
                return new Result(500, "预约失败");
            }
        }
        return new Result(400, "无效令牌");
    }

    @Override
    public Result getRankingMonth() {
        // 获取当前月份
        Calendar calendar = Calendar.getInstance();
        int currentMonth = calendar.get(Calendar.MONTH) + 1;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");

        // 从数据库获取订单信息列表
        List<OrderInfo> orderData = orderInfoMapper.selectList(null);

        // 用于存储景区热度的 Map
        Map<Long, Ranking> mapData = new HashMap<>();

        // 遍历订单信息列表，统计每个景区的热度（只统计当前月份的数据）
        for (OrderInfo order : orderData) {
            try {
                Date orderTime = sdf.parse(order.getOrderTime().substring(0, 7));
                calendar.setTime(orderTime);
                int orderMonth = calendar.get(Calendar.MONTH) + 1;
                if (orderMonth == currentMonth) {
                    Long scenicId = Long.parseLong(order.getScenicId());
                    Ranking ranking = mapData.get(scenicId);
                    if (ranking == null) {
                        ranking = new Ranking();
                        ranking.setScenicId(scenicId);
                        // 根据 scenicId 获取景区名称并设置
                        Scenic scenic = scenicMapper.selectById(scenicId);

                        if (scenic!= null) {
                            ranking.setScenicName(scenic.getName());
                        }
                        ranking.setCount(1);
                    } else {
                        ranking.setCount(ranking.getCount() + 1);
                    }
                    mapData.put(scenicId, ranking);
                }
            } catch (Exception e) {
                // 处理日期解析异常（可根据实际情况进行更完善的处理）
                e.printStackTrace();
            }
        }

        return new Result(200, "查询成功", mapData.values());
    }

    @Override
    public Result getRankingYear() {
        // 获取当前年份
        Calendar calendar = Calendar.getInstance();
        int currentYear = calendar.get(Calendar.YEAR);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy");

        // 从数据库获取订单信息列表
        List<OrderInfo> orderData = orderInfoMapper.selectList(null);

        // 用于存储景区热度的 Map
        Map<Long, Ranking> mapData = new HashMap<>();

        // 遍历订单信息列表，统计每个景区的热度（只统计当前年份的数据）
        for (OrderInfo order : orderData) {
            try {
                Date orderTime = sdf.parse(order.getOrderTime().substring(0, 4));
                calendar.setTime(orderTime);
                int orderYear = calendar.get(Calendar.YEAR);
                if (orderYear == currentYear) {
                    Long scenicId = Long.parseLong(order.getScenicId());
                    Ranking ranking = mapData.get(scenicId);
                    if (ranking == null) {
                        ranking = new Ranking();
                        ranking.setScenicId(scenicId);
                        // 根据 scenicId 获取景区名称并设置
                        Scenic scenic = scenicMapper.selectById(scenicId);
                        if (scenic!= null) {
                            ranking.setScenicName(scenic.getName());
                        }
                        ranking.setCount(1);
                    } else {
                        ranking.setCount(ranking.getCount() + 1);
                    }
                    mapData.put(scenicId, ranking);
                }
            } catch (Exception e) {
                // 处理日期解析异常（可根据实际情况进行更完善的处理）
                e.printStackTrace();
            }
        }

        return new Result(200, "查询成功", mapData.values());
    }

    @Override
    public PageItem<OrderInfo> getOrderInfoByPage(String pageNum, String pageSize, OrderInfo query) {

        int num = Integer.parseInt(pageNum);
        int size = Integer.parseInt(pageSize);
        Page<OrderInfo> page = new Page<>(num, size);
        LambdaQueryWrapper<OrderInfo> lqw = new LambdaQueryWrapper<>();

        lqw.like(query.getScenicId() != null && query.getScenicId() != "", OrderInfo::getScenicId, query.getScenicId());

        IPage<OrderInfo> orderInfoIPage = orderInfoMapper.selectPage(page,lqw);


//        根据景点和用户id获取名字
        for (OrderInfo orderInfo : orderInfoIPage.getRecords()) {
            String scenicId = orderInfo.getScenicId();
            if (scenicId!= null) {
                Scenic scenic = scenicMapper.selectById(scenicId);
                if (scenic!= null) {
                    orderInfo.setScenicName(scenic.getName());
                }
            }
            String userId = orderInfo.getUserId();
            if (userId!= null) {
                User user = userMapper.selectById(userId);
                if (user!= null) {
                    orderInfo.setUserName(user.getUsername());
                }
            }
        }
        return  new PageItem<OrderInfo>(orderInfoIPage.getRecords(), orderInfoIPage.getTotal());
    }

    @Override
    public Result deleteOrderById(OrderInfo orderInfo) {
        String id = orderInfo.getId();
        OrderInfo data= orderInfoMapper.selectById(id);
        if (data == null) {
            return new Result(500, "订单不存在");
        }
        try {
            int ret = orderInfoMapper.deleteById(id);
            if (ret > 0) {
                return new Result(200, "删除成功");
            } else {
                return new Result(500, "删除失败");
            }
        }catch (Exception e) {
            return new Result(500, "内部错误："+e.getMessage());
        }
    }

    @Override
    public Object getScenicName() {

        List<Scenic> scenicList =scenicMapper.selectList(null);

        // 创建一个新列表，用来存放封装后的景区 id 和名称
        List<Map<String, Object>> resultList = new ArrayList<>();
        // 遍历所有的景区信息
        for (Scenic scenic : scenicList) {
            // 创建一个新的 Map，用来存放一个景区的 id 和名称
            Map<String, Object> map = new HashMap<>();
            // 将景区的 id 放入 Map
            map.put("id", scenic.getId());
            // 将景区的名称放入 Map
            map.put("name", scenic.getName());
            // 将这个封装好的 Map 放入结果列表中
            resultList.add(map);
        }
        return resultList;
    }


    //    返回景点可以预约的时间段
    @Override
    public Result getScenicTime(String scenicId){
    Scenic obj= scenicMapper.selectById(scenicId);
    if (obj!=null){
        Time startTime=obj.getStartTime();
        Time endTime=obj.getEndTime();
        List<Map<String, Object>> orderTime=getTimeSlots(startTime,endTime);
        return new Result(200,"查询预约时间成功",orderTime);
    }

        return new Result(500,"查询失败",null);

    }

    @Override
    public Result saveQRCode(String content) {
        try {
            // 调用 qrCodeConfig 对象的 saveQRCodeImageToTempFile 方法，
            String qrCodeUrl = qrCodeConfig.saveQRCodeImageToTempFile(content);
            return new Result(200,"订单二维码生成成功",qrCodeUrl);
        } catch (IOException | WriterException e) {
            return new Result(500,"错误",e);
        }
    }

    @Override
    public Result selectOrderByOrderId(String Id) {
        OrderInfo data=orderInfoMapper.selectById(Id);
        if (data!=null){
            return new Result(200,"查询成功",data);
        }
        return new Result(500,"查询失败",null);

    }

    // 封装的获取时间段的方法，接收 Time 类型的开始和结束时间
    private List<Map<String, Object>> getTimeSlots(Time startTime, Time endTime) {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDateTime now = LocalDateTime.parse(TimeConfig.getCurrentTime(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        LocalDate today = now.toLocalDate();
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        for (int dayOffset = 0; dayOffset < 3; dayOffset++) {
            LocalDate date = today.plusDays(dayOffset);
            String dateDesc = switch (dayOffset) {
                case 0 -> "今天";
                case 1 -> "明天";
                case 2 -> "后天";
                default -> date.toString();
            };

//            构建当天的开始时间（日期+传入的开始时间）
            LocalDateTime startDateTime = LocalDateTime.of(date, startTime.toLocalTime());
            LocalDateTime endDateTime = LocalDateTime.of(date, endTime.toLocalTime());

            List<Map<String, Object>> orderSlots = new ArrayList<>();
            for (LocalDateTime slotStart = startDateTime; slotStart.isBefore(endDateTime); slotStart = slotStart.plusHours(2)) {
//                构建可预约时间，每两个小时划分
                LocalDateTime slotEnd = slotStart.plusHours(2).isAfter(endDateTime) ? endDateTime : slotStart.plusHours(2);
//                格式化输出
                String orderTime = slotStart.format(dateTimeFormatter) + " - " + slotEnd.format(timeFormatter);
//               判断isPast
                boolean isPast = slotStart.isBefore(now);
                orderSlots.add(Map.of("orderTime", orderTime, "isPast", isPast));
            }

            result.add(Map.of(
                    "date", dateDesc,
                    "order", orderSlots
            ));
        }

        return result;
    }


}
