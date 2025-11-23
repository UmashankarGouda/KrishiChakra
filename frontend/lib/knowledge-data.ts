export interface Article {
  id: string
  title: string
  category: string
  excerpt: string
  content: string
  readTime: string
  tags: string[]
  author: string
  publishedAt: string
  imageUrl: string
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  articleCount: number
}

export const categories: Category[] = [
  {
    id: "crop-rotation",
    name: "Crop Rotation",
    description: "Learn about sustainable crop rotation practices",
    icon: "🔄",
    articleCount: 12,
  },
  {
    id: "soil-health",
    name: "Soil Health",
    description: "Maintain and improve your soil quality",
    icon: "🌱",
    articleCount: 8,
  },
  {
    id: "pest-management",
    name: "Pest Management",
    description: "Natural and effective pest control methods",
    icon: "🐛",
    articleCount: 15,
  },
  {
    id: "seasonal-farming",
    name: "Seasonal Farming",
    description: "Season-specific farming techniques",
    icon: "🌾",
    articleCount: 10,
  },
  {
    id: "organic-farming",
    name: "Organic Farming",
    description: "Sustainable organic farming practices",
    icon: "🌿",
    articleCount: 7,
  },
  {
    id: "water-management",
    name: "Water Management",
    description: "Efficient irrigation and water conservation",
    icon: "💧",
    articleCount: 9,
  },
]

export const articles: Article[] = [
  {
    id: "1",
    title: "The Complete Guide to Crop Rotation for Indian Farmers",
    category: "crop-rotation",
    excerpt:
      "Learn how proper crop rotation can increase your yield by 30% while maintaining soil health and reducing pest problems.",
    content: `Crop rotation is one of the most effective sustainable farming practices that has been used for centuries. In this comprehensive guide, we'll explore how Indian farmers can implement effective crop rotation strategies.

## What is Crop Rotation?

Crop rotation involves growing different types of crops in the same area across different seasons or years. This practice helps maintain soil fertility, reduce pest and disease pressure, and improve overall farm productivity.

## Benefits of Crop Rotation

1. **Improved Soil Health**: Different crops have varying nutrient requirements and contributions
2. **Pest and Disease Control**: Breaking pest cycles naturally
3. **Increased Yields**: Better soil structure and nutrient availability
4. **Reduced Input Costs**: Less need for fertilizers and pesticides

## Common Rotation Patterns in India

### Rice-Wheat Rotation
- **Kharif Season**: Rice (June-October)
- **Rabi Season**: Wheat (November-April)
- **Summer**: Legumes or fallow

### Cotton-Based Rotations
- **Year 1**: Cotton
- **Year 2**: Sorghum or Pearl Millet
- **Year 3**: Legumes (Chickpea/Pigeon Pea)

## Implementation Tips

1. Start with simple 2-3 crop rotations
2. Include at least one legume crop
3. Consider market demand and prices
4. Plan for water availability
5. Keep detailed records

Remember, successful crop rotation requires planning and patience, but the long-term benefits make it worthwhile for sustainable farming.`,
    readTime: "8 min read",
    tags: ["crop-rotation", "sustainable-farming", "soil-health"],
    author: "Dr. Rajesh Kumar",
    publishedAt: "2024-01-15",
    imageUrl: "/crop-rotation-fields.jpg",
  },
  {
    id: "2",
    title: "Natural Pest Control Methods That Actually Work",
    category: "pest-management",
    excerpt: "Discover effective organic pest control techniques that protect your crops without harmful chemicals.",
    content: `Pest management is crucial for successful farming, but it doesn't have to rely on harmful chemicals. Here are proven natural methods that work effectively.

## Integrated Pest Management (IPM)

IPM combines multiple strategies to control pests while minimizing environmental impact:

### Biological Control
- **Beneficial insects**: Ladybugs, lacewings, parasitic wasps
- **Predatory birds**: Encourage birds that eat harmful insects
- **Companion planting**: Marigolds, basil, and neem trees

### Cultural Practices
- **Crop rotation**: Breaks pest life cycles
- **Proper spacing**: Improves air circulation
- **Timely planting**: Avoid peak pest seasons
- **Field sanitation**: Remove crop residues

### Natural Pesticides
- **Neem oil**: Effective against aphids and caterpillars
- **Soap spray**: Controls soft-bodied insects
- **Garlic-chili spray**: Deters many pests
- **Diatomaceous earth**: Controls crawling insects

## Monitoring and Prevention

Regular field monitoring is key to early pest detection:
- Check plants weekly
- Use yellow sticky traps
- Monitor weather conditions
- Keep detailed records

## Success Stories

Many farmers have successfully reduced pesticide use by 70% while maintaining yields through these natural methods.`,
    readTime: "6 min read",
    tags: ["pest-management", "organic-farming", "natural-methods"],
    author: "Dr. Priya Sharma",
    publishedAt: "2024-01-10",
    imageUrl: "/natural-pest-control-farming.jpg",
  },
  {
    id: "3",
    title: "Soil Testing: Your First Step to Better Yields",
    category: "soil-health",
    excerpt: "Understanding your soil composition is crucial for optimal crop selection and fertilizer application.",
    content: `Soil testing is the foundation of successful farming. It provides crucial information about your soil's health and helps you make informed decisions about crop selection and nutrient management.

## Why Soil Testing Matters

- **Nutrient Management**: Know exactly what your soil needs
- **pH Optimization**: Ensure optimal nutrient uptake
- **Cost Savings**: Avoid over-fertilization
- **Environmental Protection**: Prevent nutrient runoff

## Key Parameters to Test

### Essential Nutrients
- **Nitrogen (N)**: For leaf growth and protein synthesis
- **Phosphorus (P)**: For root development and flowering
- **Potassium (K)**: For disease resistance and fruit quality

### Secondary Nutrients
- **Calcium (Ca)**: For cell wall strength
- **Magnesium (Mg)**: For chlorophyll production
- **Sulfur (S)**: For protein synthesis

### Micronutrients
- Iron, Zinc, Manganese, Boron, Copper, Molybdenum

## When to Test

- **Before planting season**: Plan nutrient applications
- **After harvest**: Assess nutrient depletion
- **Every 2-3 years**: Monitor long-term trends
- **When problems arise**: Diagnose issues

## How to Collect Samples

1. Divide field into uniform areas
2. Collect samples from 6-8 inches depth
3. Mix samples thoroughly
4. Use clean tools and containers
5. Label samples clearly

## Interpreting Results

Work with agricultural experts to understand your soil test results and develop appropriate management strategies.`,
    readTime: "7 min read",
    tags: ["soil-health", "testing", "nutrients"],
    author: "Dr. Amit Patel",
    publishedAt: "2024-01-05",
    imageUrl: "/soil-testing-agriculture.jpg",
  },
  {
    id: "4",
    title: "Water-Smart Farming: Drip Irrigation Basics",
    category: "water-management",
    excerpt: "Learn how drip irrigation can reduce water usage by 50% while increasing crop yields.",
    content: `Water scarcity is a growing concern for farmers worldwide. Drip irrigation offers an efficient solution that conserves water while improving crop productivity.

## What is Drip Irrigation?

Drip irrigation delivers water directly to plant roots through a network of tubes, pipes, and emitters. This targeted approach minimizes water waste and maximizes efficiency.

## Benefits of Drip Irrigation

### Water Conservation
- **50-70% less water** compared to flood irrigation
- **Reduced evaporation** and runoff
- **Precise water application** where needed

### Improved Yields
- **Consistent moisture levels** reduce plant stress
- **Better nutrient uptake** through fertigation
- **Reduced weed growth** between crop rows

### Cost Benefits
- **Lower labor costs** for irrigation
- **Reduced fertilizer needs** through efficient application
- **Higher crop quality** and market value

## System Components

### Main Components
- **Water source**: Well, tank, or canal
- **Filtration system**: Prevents clogging
- **Pressure regulation**: Maintains optimal pressure
- **Distribution network**: Main and sub-main lines
- **Emitters**: Deliver water to plants

### Types of Emitters
- **Drippers**: For individual plants
- **Micro-sprinklers**: For larger coverage
- **Soaker hoses**: For row crops

## Installation Tips

1. **Plan the layout** carefully
2. **Install proper filtration**
3. **Use pressure compensating emitters**
4. **Include flush valves** for maintenance
5. **Monitor system regularly**

## Maintenance

- Clean filters regularly
- Check for clogged emitters
- Inspect for leaks
- Flush lines periodically

With proper installation and maintenance, drip irrigation systems can last 10-15 years and provide excellent returns on investment.`,
    readTime: "9 min read",
    tags: ["water-management", "irrigation", "efficiency"],
    author: "Eng. Suresh Reddy",
    publishedAt: "2023-12-28",
    imageUrl: "/drip-irrigation.png",
  },
  {
    id: "5",
    title: "Organic Fertilizers: Nature's Way to Feed Your Crops",
    category: "organic-farming",
    excerpt:
      "Discover how organic fertilizers can improve soil health while providing essential nutrients to your crops.",
    content: `Organic fertilizers offer a sustainable approach to crop nutrition that builds soil health over time while providing essential nutrients for plant growth.

## Types of Organic Fertilizers

### Animal-Based Fertilizers
- **Cow manure**: Rich in nitrogen and organic matter
- **Poultry manure**: High in nitrogen and phosphorus
- **Fish emulsion**: Quick-release nitrogen source
- **Bone meal**: Slow-release phosphorus

### Plant-Based Fertilizers
- **Compost**: Balanced nutrients and soil conditioning
- **Green manure**: Living mulch and nitrogen fixation
- **Seaweed extract**: Micronutrients and growth hormones
- **Wood ash**: Potassium and pH adjustment

### Microbial Fertilizers
- **Rhizobium**: Nitrogen fixation for legumes
- **Mycorrhizal fungi**: Improved nutrient uptake
- **Azotobacter**: Free-living nitrogen fixers
- **Phosphate solubilizing bacteria**: Enhanced phosphorus availability

## Benefits Over Chemical Fertilizers

### Soil Health
- **Improved soil structure** and water retention
- **Enhanced microbial activity**
- **Increased organic matter** content
- **Better nutrient cycling**

### Environmental Benefits
- **Reduced groundwater contamination**
- **Lower carbon footprint**
- **Biodiversity conservation**
- **Sustainable farming practices**

## Application Guidelines

### Timing
- **Pre-planting**: Incorporate into soil 2-4 weeks before planting
- **Side-dressing**: Apply during growing season
- **Post-harvest**: Build soil for next season

### Rates
- **Compost**: 2-4 tons per hectare
- **Cow manure**: 10-15 tons per hectare
- **Poultry manure**: 2-3 tons per hectare

## Making Your Own Compost

1. **Collect materials**: Green (nitrogen) and brown (carbon) materials
2. **Layer materials**: Alternate green and brown layers
3. **Maintain moisture**: Keep pile moist but not waterlogged
4. **Turn regularly**: Every 2-3 weeks for faster decomposition
5. **Monitor temperature**: Should reach 140-160°F for pathogen control

Quality compost is ready in 3-6 months and provides excellent soil conditioning along with balanced nutrition.`,
    readTime: "10 min read",
    tags: ["organic-farming", "fertilizers", "soil-health"],
    author: "Dr. Meera Joshi",
    publishedAt: "2023-12-20",
    imageUrl: "/organic-fertilizer-compost.jpg",
  },
  {
    id: "6",
    title: "Seasonal Farming Calendar for North India",
    category: "seasonal-farming",
    excerpt:
      "A comprehensive guide to what crops to plant and when for maximum productivity in North Indian conditions.",
    content: `Timing is everything in agriculture. This seasonal calendar helps North Indian farmers plan their cropping activities for optimal results.

## Kharif Season (June - October)

### Main Crops
- **Rice**: Transplant in June-July, harvest in October
- **Cotton**: Sow in May-June, harvest in October-December
- **Sugarcane**: Plant in February-March, harvest next year
- **Maize**: Sow in June-July, harvest in September-October

### Vegetables
- **Okra**: Sow in June-July
- **Bottle gourd**: Sow in June-July
- **Ridge gourd**: Sow in June-July
- **Cucumber**: Sow in June-July

### Management Tips
- **Monsoon preparation**: Ensure proper drainage
- **Pest monitoring**: High humidity increases pest pressure
- **Weed control**: Critical during early growth stages

## Rabi Season (November - April)

### Main Crops
- **Wheat**: Sow in November-December, harvest in April-May
- **Barley**: Sow in November-December, harvest in April
- **Chickpea**: Sow in October-November, harvest in March-April
- **Mustard**: Sow in October-November, harvest in March-April

### Vegetables
- **Potato**: Plant in October-November
- **Onion**: Transplant in December-January
- **Cabbage**: Transplant in November-December
- **Cauliflower**: Transplant in November-December

### Management Tips
- **Irrigation planning**: Limited rainfall requires careful water management
- **Frost protection**: Cover sensitive crops during cold spells
- **Nutrient management**: Apply fertilizers based on soil tests

## Zaid Season (April - June)

### Main Crops
- **Fodder crops**: Sorghum, pearl millet
- **Watermelon**: Sow in February-March
- **Muskmelon**: Sow in February-March
- **Cucumber**: Sow in February-March

### Management Tips
- **Heat stress management**: Provide shade and adequate water
- **Water conservation**: Use mulching and efficient irrigation
- **Market planning**: Limited competition but high input costs

## Year-Round Planning

### Crop Rotation Examples
1. **Rice → Wheat → Fallow**
2. **Cotton → Wheat → Summer fodder**
3. **Maize → Chickpea → Watermelon**

### Record Keeping
- Track planting and harvest dates
- Monitor weather patterns
- Record input costs and yields
- Plan for next season based on results

Success in seasonal farming requires careful planning, timely execution, and continuous learning from each season's experiences.`,
    readTime: "12 min read",
    tags: ["seasonal-farming", "planning", "north-india"],
    author: "Dr. Vikram Singh",
    publishedAt: "2023-12-15",
    imageUrl: "/seasonal-farming-calendar.jpg",
  },
]

export function searchArticles(query: string): Article[] {
  if (!query.trim()) return articles

  const searchTerm = query.toLowerCase()
  return articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
      article.category.toLowerCase().includes(searchTerm),
  )
}

export function getArticlesByCategory(categoryId: string): Article[] {
  return articles.filter((article) => article.category === categoryId)
}

export function getArticleById(id: string): Article | undefined {
  return articles.find((article) => article.id === id)
}
