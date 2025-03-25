
export const calculateCommission = (price: number, category: string) => {
    let threshold = 0;
    const commissionRate = 0.7; // 70% commission rate
    
    // Set threshold based on category
    if (category.toLowerCase().includes("shirt") || category.toLowerCase().includes("t-shirt")) {
      threshold = 14;
    } else if (category.toLowerCase().includes("hat") || category.toLowerCase().includes("cap")) {
      threshold = 8;
    } else if (category.toLowerCase().includes("mug")) {
      threshold = 7;
    }
    
    // Calculate commission for amount above threshold
    const commissionableAmount = Math.max(0, price - threshold);
    const commission = commissionableAmount * commissionRate;
    
    return {
      commission,
      threshold,
      commissionRate,
      basePrice: price,
      commissionableAmount
    };
  };

  export const formatCurrency = (amount: number): string => {
    return amount.toFixed(2);
  };
  
  export const getCategoryThreshold = (category: string): number => {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes("shirt")) {
      return 14;
    } else if (categoryLower.includes("hat") || categoryLower.includes("cap")) {
      return 8;
    } else if (categoryLower.includes("mug")) {
      return 7;
    }
    
    return 0; 
  };
  
 
  export const getRecommendedPriceRange = (category: string): {min: number, max: number} => {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes("shirt")) {
      return { min: 19.99, max: 29.99 };
    } else if (categoryLower.includes("hat") || categoryLower.includes("cap")) {
      return { min: 14.99, max: 24.99 };
    } else if (categoryLower.includes("mug")) {
      return { min: 12.99, max: 19.99 };
    }
    
    return { min: 9.99, max: 29.99 }; // Default range
  };