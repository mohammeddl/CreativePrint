package com.creativePrint.task;

import com.creativePrint.model.User;
import com.creativePrint.repository.UserRepository;
import com.creativePrint.service.EmailMarketingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.awt.print.Pageable;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailMarketingTasks {
    private final EmailMarketingService emailMarketingService;
    private final UserRepository userRepository;
    
    @Scheduled(cron = "0 0 10 * * MON")
    public void sendWeeklyNewProductEmails() {
        log.info("Starting weekly new product email campaign");


        Pageable pageable = (Pageable) PageRequest.of(0, 100); 
        List<User> activeUsers = userRepository.findByActive(true, (org.springframework.data.domain.Pageable) pageable).getContent();

        for (User user : activeUsers) {
            emailMarketingService.sendNewProductsEmail(user);
        }
        
        log.info("Completed sending {} new product emails", activeUsers.size());
    }
    

    @Scheduled(fixedRate = 3600000)
    public void sendAbandonedCartEmails() {
        log.info("Checking for abandoned carts");
        
        
        log.info("Completed abandoned cart email check");
    }
}