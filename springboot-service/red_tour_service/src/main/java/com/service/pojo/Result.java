package com.service.pojo;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Result {
    Integer status;  // 200
    String message;
    Object data;

    public Result(Integer status, String message) {
        this.status = status;
        this.message = message;
        this.data = null;
    }
}
