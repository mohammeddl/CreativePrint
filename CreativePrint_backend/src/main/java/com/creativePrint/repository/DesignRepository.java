package com.creativePrint.repository;
import com.creativePrint.model.Design;
import com.creativePrint.model.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;
import java.util.List;
import java.util.Set;

public interface DesignRepository extends JpaRepository<Design, Long> {
    Set<Design> findByIdIn(Collection<Long> ids);
    Set<Design> findByCreatorId(Long creatorId);
    Set<Design> findByIdInAndCreator(List<Long> ids, User creator);
    Page<Design> findByCreator(User creator, Pageable pageable);
}