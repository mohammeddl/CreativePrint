package com.creativePrint.repository;
import com.creativePrint.model.Design;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;
import java.util.Set;

public interface DesignRepository extends JpaRepository<Design, Long> {
    Set<Design> findByIdIn(Collection<Long> ids);
    Set<Design> findByCreatorId(Long creatorId);
}