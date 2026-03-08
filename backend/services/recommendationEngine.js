class RecommendationEngine {
  async generate({ soil, crop, fertilizers, farmSize, weatherData }) {
    // Calculate nutrient gaps
    const nutrientGaps = this.calculateNutrientGaps(soil, crop);
    
    // Find suitable fertilizers
    const suitableFertilizers = this.findSuitableFertilizers(fertilizers, crop, soil);
    
    // Calculate optimal combinations
    const recommendations = this.calculateOptimalFertilizerCombination(
      suitableFertilizers,
      nutrientGaps,
      farmSize,
      soil,
      crop
    );
    
    // Calculate costs
    const totalCost = recommendations.reduce((sum, rec) => sum + rec.cost, 0);
    
    // Calculate expected yield
    const expectedYield = this.estimateYield(crop, soil, recommendations);
    
    // Calculate revenue and profit
    const estimatedRevenue = expectedYield.value * (crop.marketPrice?.value || 0);
    const profitEstimate = estimatedRevenue - totalCost;
    
    // Calculate sustainability metrics
    const sustainabilityMetrics = this.calculateSustainabilityMetrics(
      recommendations,
      nutrientGaps,
      soil
    );
    
    // Generate weather considerations
    const weatherConsiderations = this.generateWeatherConsiderations(weatherData);
    
    return {
      recommendations,
      totalCost,
      expectedYield,
      estimatedRevenue,
      profitEstimate,
      sustainabilityMetrics,
      weatherConsiderations,
      notes: this.generateNotes(soil, crop, recommendations)
    };
  }
  
  calculateNutrientGaps(soil, crop) {
    const requirements = crop.nutrientRequirements;
    
    // Convert soil values to comparable units (simplified)
    const soilN = soil.nitrogen || 0;
    const soilP = soil.phosphorus || 0;
    const soilK = soil.potassium || 0;
    
    // Calculate gaps (kg per acre)
    const gaps = {
      nitrogen: Math.max(0, (requirements?.nitrogen || 100) - soilN * 2),
      phosphorus: Math.max(0, (requirements?.phosphorus || 50) - soilP * 2),
      potassium: Math.max(0, (requirements?.potassium || 80) - soilK * 1.5)
    };
    
    // Adjust based on pH
    if (soil.phLevel < 5.5 || soil.phLevel > 7.5) {
      gaps.nitrogen *= 1.2;
      gaps.phosphorus *= 1.3;
    }
    
    // Adjust based on organic matter
    if (soil.organicMatter < 2) {
      gaps.nitrogen *= 1.1;
    }
    
    return gaps;
  }
  
  findSuitableFertilizers(fertilizers, crop, soil) {
    return fertilizers.filter(fert => {
      // Check if fertilizer nutrients match crop needs
      const hasRequiredNutrients = 
        (fert.nutrientContent?.nitrogen > 0 && crop.nutrientRequirements?.nitrogen > 0) ||
        (fert.nutrientContent?.phosphorus > 0 && crop.nutrientRequirements?.phosphorus > 0) ||
        (fert.nutrientContent?.potassium > 0 && crop.nutrientRequirements?.potassium > 0);
      
      // Check soil pH compatibility
      const phCompatible = this.checkPhCompatibility(fert, soil.phLevel);
      
      return hasRequiredNutrients && phCompatible;
    });
  }
  
  checkPhCompatibility(fertilizer, soilPh) {
    // Some fertilizers work better in certain pH ranges
    if (fertilizer.type === 'organic') {
      return true; // Organic fertilizers work across pH ranges
    }
    
    if (soilPh < 5.5) {
      // Acidic soils - avoid acidifying fertilizers
      return fertilizer.category !== 'straight' || fertilizer.nutrientContent?.nitrogen < 30;
    }
    
    return true;
  }
  
  calculateOptimalFertilizerCombination(fertilizers, nutrientGaps, farmSize, soil, crop) {
    const recommendations = [];
    const remainingGaps = { ...nutrientGaps };
    
    // Priority order: fix P and K deficiencies first, then N
    const nutrientPriority = ['phosphorus', 'potassium', 'nitrogen'];
    
    for (const nutrient of nutrientPriority) {
      if (remainingGaps[nutrient] <= 0) continue;
      
      // Find best fertilizer for this nutrient
      const bestFertilizer = this.findBestFertilizerForNutrient(
        fertilizers,
        nutrient,
        remainingGaps[nutrient],
        soil,
        crop
      );
      
      if (bestFertilizer) {
        const nutrientContent = bestFertilizer.nutrientContent?.[nutrient] || 0;
        const quantity = this.calculateFertilizerQuantity(
          bestFertilizer,
          nutrient,
          remainingGaps[nutrient],
          farmSize
        );
        
        const cost = quantity * (bestFertilizer.price?.value || 0);
        
        recommendations.push({
          fertilizer: bestFertilizer._id,
          quantity: Math.round(quantity * 100) / 100,
          unit: bestFertilizer.price?.unit || 'kg/acre',
          applicationTiming: this.determineApplicationTiming(bestFertilizer, crop),
          applicationMethod: this.determineApplicationMethod(bestFertilizer, soil),
          cost: Math.round(cost * 100) / 100
        });
        
        // Update remaining gaps - only subtract the nutrient this fertilizer provides
        remainingGaps[nutrient] = Math.max(0, remainingGaps[nutrient] - (quantity * nutrientContent / 100));
      }
    }
    
    // Fill remaining N gap if any
    if (remainingGaps.nitrogen > 0) {
      const nitrogenFertilizer = this.findBestNitrogenSource(fertilizers, soil);
      if (nitrogenFertilizer) {
        const nContent = nitrogenFertilizer.nutrientContent?.nitrogen || 0;
        const quantity = (remainingGaps.nitrogen / (nContent / 100)) * farmSize;
        const cost = quantity * (nitrogenFertilizer.price?.value || 0);
        
        recommendations.push({
          fertilizer: nitrogenFertilizer._id,
          quantity: Math.round(quantity * 100) / 100,
          unit: nitrogenFertilizer.price?.unit || 'kg/acre',
          applicationTiming: 'split application: 50% at planting, 50% at tillering',
          applicationMethod: 'side-dress',
          cost: Math.round(cost * 100) / 100
        });
      }
    }
    
    return recommendations;
  }
  
  findBestFertilizerForNutrient(fertilizers, nutrient, gap, soil, crop) {
    const scored = fertilizers.map(fert => {
      let score = 0;
      const nutrientContent = fert.nutrientContent?.[nutrient] || 0;
      
      // Higher nutrient content = better
      score += nutrientContent * 2;
      
      // Sustainability bonus
      score += (fert.sustainabilityScore || 50) * 0.5;
      
      // Organic bonus for long-term soil health
      if (fert.organicCertified) score += 20;
      
      // Price efficiency (lower price per unit nutrient = better)
      const pricePerNutrient = (fert.price?.value || 100) / (nutrientContent + 1);
      score -= pricePerNutrient * 0.5;
      
      // Soil health impact
      if (fert.environmentalImpact?.soilHealthImpact === 'positive') score += 15;
      
      return { fertilizer: fert, score };
    });
    
    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.fertilizer;
  }
  
  findBestNitrogenSource(fertilizers, soil) {
    // Prefer slow-release or organic N sources for sustainable farming
    const preferredTypes = ['organic', 'slow-release', 'controlled-release'];
    
    for (const type of preferredTypes) {
      const found = fertilizers.find(f => 
        f.type === type && f.nutrientContent?.nitrogen > 0
      );
      if (found) return found;
    }
    
    // Fallback to any N fertilizer
    return fertilizers.find(f => f.nutrientContent?.nitrogen > 0);
  }
  
  calculateFertilizerQuantity(fertilizer, targetNutrient, nutrientGap, farmSize) {
    const nutrientContent = fertilizer.nutrientContent?.[targetNutrient] || 0;
    if (nutrientContent === 0) return 0;
    
    // Quantity = (nutrient gap / nutrient percentage) * farm size
    return (nutrientGap / (nutrientContent / 100)) * farmSize;
  }
  
  determineApplicationTiming(fertilizer, crop) {
    if (fertilizer.releaseRate === 'slow') {
      return 'apply 2-3 weeks before planting';
    }
    if (fertilizer.type === 'organic') {
      return 'apply 2-4 weeks before planting to allow decomposition';
    }
    return 'apply at planting time';
  }
  
  determineApplicationMethod(fertilizer, soil) {
    if (fertilizer.form === 'liquid') {
      return 'fertigation';
    }
    if (soil.soilTexture === 'sandy') {
      return 'banding'; // Reduce leaching in sandy soils
    }
    return 'broadcast';
  }
  
  estimateYield(crop, soil, recommendations) {
    // Base yield
    let baseYield = crop.expectedYield?.value || 1000;
    
    // Soil health factor
    let soilFactor = 1.0;
    if (soil.phLevel >= 6.0 && soil.phLevel <= 7.0) soilFactor += 0.1;
    if (soil.organicMatter >= 3) soilFactor += 0.1;
    if (soil.nitrogen >= 30 && soil.phosphorus >= 25 && soil.potassium >= 150) {
      soilFactor += 0.1;
    }
    
    // Fertilizer factor
    const fertFactor = 1 + (recommendations.length * 0.05);
    
    const estimatedYield = baseYield * soilFactor * fertFactor;
    
    return {
      value: Math.round(estimatedYield * 100) / 100,
      unit: crop.expectedYield?.unit || 'kg/acre'
    };
  }
  
  calculateSustainabilityMetrics(recommendations, nutrientGaps, soil) {
    // Calculate nutrient use efficiencies
    const totalNApplied = this.calculateTotalNutrientApplied(recommendations, 'nitrogen');
    const totalPApplied = this.calculateTotalNutrientApplied(recommendations, 'phosphorus');
    const totalKApplied = this.calculateTotalNutrientApplied(recommendations, 'potassium');
    
    const nitrogenEfficiency = nutrientGaps.nitrogen > 0 
      ? Math.min(100, (nutrientGaps.nitrogen / totalNApplied) * 100)
      : 100;
    
    const phosphorusEfficiency = nutrientGaps.phosphorus > 0
      ? Math.min(100, (nutrientGaps.phosphorus / totalPApplied) * 100)
      : 100;
    
    const potassiumEfficiency = nutrientGaps.potassium > 0
      ? Math.min(100, (nutrientGaps.potassium / totalKApplied) * 100)
      : 100;
    
    // Carbon footprint reduction (organic fertilizers reduce footprint)
    let organicPercentage = 0;
    recommendations.forEach(rec => {
      // This would need the populated fertilizer data
      // For now, assume a default value
    });
    
    const carbonReduction = organicPercentage * 0.2;
    
    // Soil health score
    const soilHealthScore = this.calculateSoilHealthScore(soil, recommendations);
    
    // Overall sustainability score
    const overallScore = (
      nitrogenEfficiency * 0.3 +
      phosphorusEfficiency * 0.25 +
      potassiumEfficiency * 0.25 +
      soilHealthScore * 0.2
    );
    
    return {
      nitrogenUseEfficiency: Math.round(nitrogenEfficiency * 10) / 10,
      phosphorusUseEfficiency: Math.round(phosphorusEfficiency * 10) / 10,
      potassiumUseEfficiency: Math.round(potassiumEfficiency * 10) / 10,
      carbonFootprintReduction: Math.round(carbonReduction * 100) / 100,
      soilHealthScore: Math.round(soilHealthScore * 10) / 10,
      waterQualityImpact: totalNApplied > 150 ? 'medium' : 'low',
      overallSustainabilityScore: Math.round(overallScore * 10) / 10
    };
  }
  
  calculateTotalNutrientApplied(recommendations, nutrient) {
    // Simplified calculation - in production, would use actual fertilizer data
    return recommendations.reduce((sum, rec) => {
      const estimatedContent = nutrient === 'nitrogen' ? 20 : 
                               nutrient === 'phosphorus' ? 10 : 15;
      return sum + (rec.quantity * estimatedContent / 100);
    }, 0);
  }
  
  calculateSoilHealthScore(soil, recommendations) {
    let score = 70; // Base score
    
    if (soil.phLevel >= 6.0 && soil.phLevel <= 7.0) score += 10;
    if (soil.organicMatter >= 3) score += 10;
    if (soil.organicMatter >= 5) score += 5;
    
    // Bonus for organic fertilizers
    const organicCount = recommendations.filter(r => r.organicCertified).length;
    score += organicCount * 2;
    
    return Math.min(100, score);
  }
  
  generateWeatherConsiderations(weatherData) {
    if (!weatherData) {
      return {
        rainfallForecast: 'No data available',
        temperatureRange: 'Unknown',
        applicationTiming: 'Apply during dry weather'
      };
    }
    
    return {
      rainfallForecast: `${weatherData.rainfall || 0}mm expected in next 24h`,
      temperatureRange: `${weatherData.temperature - 3}°C - ${weatherData.temperature + 3}°C`,
      applicationTiming: weatherData.rainfall > 5 
        ? 'Delay application until after rainfall'
        : 'Good conditions for application'
    };
  }
  
  generateNotes(soil, crop, recommendations) {
    const notes = [];
    
    if (soil.phLevel < 5.5) {
      notes.push('Consider liming to raise soil pH for better nutrient availability.');
    }
    
    if (soil.organicMatter < 2) {
      notes.push('Add organic matter to improve soil structure and water retention.');
    }
    
    if (recommendations.some(r => r.quantity > 200)) {
      notes.push('High fertilizer rates detected. Consider split application to prevent leaching.');
    }
    
    notes.push(`Optimal growing conditions for ${crop.name} include regular soil moisture monitoring.`);
    
    return notes.join(' ');
  }
}

module.exports = new RecommendationEngine();
