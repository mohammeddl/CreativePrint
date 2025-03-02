package com.creativePrint.task;

import com.creativePrint.model.User;
import com.creativePrint.repository.UserRepository;
import com.creativePrint.service.EmailMarketingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailMarketingTasks {
    private final EmailMarketingService emailMarketingService;
    private final UserRepository userRepository;
    
    // Send weekly new product emails every Monday at 10:00 AM
    @Scheduled(cron = "0 0 10 * * MON")
    public void sendWeeklyNewProductEmails() {
        log.info("Starting weekly new product email campaign");
        
        List<User> activeUsers = userRepository.findByActive(true);
        for (User user : activeUsers) {
            emailMarketingService.sendNewProductsEmail(user);
        }
        
        log.info("Completed sending {} new product emails", activeUsers.size());
    }
    
    // Check for abandoned carts hourly
    @Scheduled(fixedRate = 3600000) // 1 hour in milliseconds
    public void sendAbandonedCartEmails() {
        log.info("Checking for abandoned carts");
        
        // Here you would implement logic to find abandoned carts
        // This is a simplified example that assumes you have a method to retrieve them
        // findAbandonedCarts(hours, not reminded)
        // Map<User, Long> abandonedCarts = cartService.findAbandonedCarts(24, false);
        
        // for (Map.Entry<User, Long> entry : abandonedCarts.entrySet()) {
        //     emailMarketingService.sendAbandonedCartEmail(entry.getKey(), entry.getValue());
        // }
        
        log.info("Completed abandoned cart email check");
    }
}