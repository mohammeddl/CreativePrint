package com.creativePrint.service.impl;

import com.creativePrint.model.EmailTemplate;
import com.creativePrint.model.Order;
import com.creativePrint.model.Product;
import com.creativePrint.model.User;
import com.creativePrint.repository.EmailTemplateRepository;
import com.creativePrint.repository.ProductRepository;
import com.creativePrint.service.EmailMarketingService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailMarketingServiceImpl implements EmailMarketingService {
    private final JavaMailSender mailSender;
    private final EmailTemplateRepository templateRepository;
    private final ProductRepository productRepository;
    
    @Override
    public void sendWelcomeEmail(User user) {
        // Load template from database
        EmailTemplate template = templateRepository.findByTemplateName("welcome");
        
        // Replace placeholders
        String htmlContent = template.getHtmlContent()
                .replace("{{firstName}}", user.getFirstName())
                .replace("{{lastName}}", user.getLastName());
        
        try {
            // Send email
            sendHtmlEmail(
                user.getEmail(),
                template.getSubject(),
                htmlContent
            );
            log.info("Welcome email sent to {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send welcome email", e);
        }
    }
    
    @Override
    public void sendAbandonedCartEmail(User user, Long cartId) {
        // Load template
        EmailTemplate template = templateRepository.findByTemplateName("abandoned_cart");
        
        // Get cart items - simplified example
        String cartRecoveryLink = "http://yourdomain.com/cart/" + cartId;
        
        // Replace placeholders
        String htmlContent = template.getHtmlContent()
                .replace("{{firstName}}", user.getFirstName())
                .replace("{{recoveryLink}}", cartRecoveryLink);
        
        try {
            // Send email
            sendHtmlEmail(
                user.getEmail(),
                template.getSubject(),
                htmlContent
            );
            log.info("Abandoned cart email sent to {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send abandoned cart email", e);
        }
    }
    
    @Override
    public void sendNewProductsEmail(User user) {
        // Load template
        EmailTemplate template = templateRepository.findByTemplateName("new_products");
        
        // Get latest products - simplified example
        List<Product> newProducts = productRepository.findTop5ByOrderByCreatedAtDesc();
        
        // Build product HTML
        StringBuilder productsHtml = new StringBuilder();
        for (Product product : newProducts) {
            productsHtml.append("<div class='product'>");
            productsHtml.append("<h3>").append(product.getName()).append("</h3>");
            productsHtml.append("<p>").append(product.getDescription()).append("</p>");
            productsHtml.append("<p>$").append(product.getBasePrice()).append("</p>");
            productsHtml.append("<a href='http://yourdomain.com/products/").append(product.getId()).append("'>View Details</a>");
            productsHtml.append("</div>");
        }
        
        // Replace placeholders
        String htmlContent = template.getHtmlContent()
                .replace("{{firstName}}", user.getFirstName())
                .replace("{{products}}", productsHtml.toString());
        
        try {
            // Send email
            sendHtmlEmail(
                user.getEmail(),
                template.getSubject(),
                htmlContent
            );
            log.info("New products email sent to {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send new products email", e);
        }
    }
    
    // Helper method to send HTML emails
    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        
        mailSender.send(message);
    }
}