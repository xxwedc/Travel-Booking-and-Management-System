package com.service.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class TimeConfig {
//    获取当前时间并封装为 yyyy-mm-dd HH:mm
    public static String getCurrentTime() {
        java.util.Date date = new java.util.Date();
        java.text.SimpleDateFormat dateFormat = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm");
        return dateFormat.format(date);
    }



}
