package com.creativePrint.repository;

import com.creativePrint.model.EmailTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, Long> {
    EmailTemplate findByTemplateName(String templateName);

    // Additional queries if needed:
    EmailTemplate findByTemplateNameAndActive(String templateName, boolean active);

    boolean existsByTemplateName(String templateName);
}