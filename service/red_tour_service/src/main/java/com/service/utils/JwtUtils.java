package com.service.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

import java.util.Calendar;
import java.util.Date;

public class JwtUtils {

    /**
     签发对象：这个用户的id
     签发时间：现在
     有效时间：30分钟
     载荷内容：暂时设计为：这个人的名字，这个人的昵称
     加密密钥：这个人的id加上一串字符串
     */
    public static String createToken(String id) {

        Calendar nowTime = Calendar.getInstance();
        nowTime.add(Calendar.DAY_OF_WEEK,7);
        Date expiresDate = nowTime.getTime();

        return JWT.create().withAudience(id)   //签发对象
                .withIssuedAt(new Date())    //发行时间
                .withExpiresAt(expiresDate)  //有效时间
//                .withClaim("userName", userName)    //载荷，随便写几个都可以
                .sign(Algorithm.HMAC256(id+"hi-jwt-good"));   //加密
    }

    /**
     * 检验合法性，其中secret参数就应该传入的是用户的id
     * @param token
     */
    public static boolean verifyToken(String token)  {
        String  secret = getAudience(token);
        DecodedJWT jwt = null;
        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret+"hi-jwt-good")).build();
            jwt = verifier.verify(token);
            return true;
        } catch (Exception e) {
            //效验失败
            //这里抛出的异常是我自定义的一个异常，你也可以写成别的
            return false;
        }
    }

    /**
     * 获取签发对象
     */
    public static String getAudience(String token) {
        String audience = null;
        try {
            audience = JWT.decode(token).getAudience().get(0);
        } catch (JWTDecodeException j) {
            //这里是token解析失败
            return null;
        }
        return audience;
    }


    /**
     * 通过载荷名字获取载荷的值
     */
    public static Claim getClaimByName(String token, String name){
        return JWT.decode(token).getClaim(name);
    }
}

