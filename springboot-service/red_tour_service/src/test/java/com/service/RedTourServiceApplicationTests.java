package com.service;

import com.service.utils.JwtUtils;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class RedTourServiceApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void getTokenTest(){
		String id = "1001";
		String userName = "笑嘻嘻";
		String Token=JwtUtils.createToken(id);
		System.out.println("Token: " + Token);
		System.out.println("验证Token"+JwtUtils.verifyToken(Token));
	}

}
