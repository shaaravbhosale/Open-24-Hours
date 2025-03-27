package com.open24hours.app;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EntityScan("com.open24hours.*, com.open24hours.app.*")
@SpringBootApplication(
        scanBasePackages = "com.open24hours"
)

@EnableConfigurationProperties
public class Open24App {
    public static void main(final String[] args) {
        new SpringApplicationBuilder(Open24App.class)
                .build()
                .run(args);

    }

}