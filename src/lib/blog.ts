export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string; // Markdown or HTML
    coverImage: string;
    author: string;
    publishedAt: string;
    readingTime: string;
    tags: string[];
}

// Temporary hardcoded data until we build a full CMS backend
export const BLOG_POSTS: BlogPost[] = [
    {
        id: "1",
        slug: "7-benefits-of-assam-tea",
        title: "7 Surprising Health Benefits of Assam Tea",
        excerpt: "Discover why this robust black tea from India is more than just a morning pick-me-up. From heart health to mental alertness, explore the science behind Assam tea.",
        content: `
# 7 Surprising Health Benefits of Assam Tea

Assam tea, named after the region of its production in India, is known for its **rich, malty flavor** and deep amber color. But beyond its delightful taste, it offers a treasure trove of health benefits.

## 1. Rich in Antioxidants
Assam tea is packed with polyphenols, particularly theaflavins and thearubigins, which function as powerful antioxidants in the body.

## 2. Promotes Heart Health
Regular consumption may help reduce the risk of heart attacks and strokes by improving blood vessel function.

## 3. Boosts Mental Alertness
With a moderate caffeine content, it provides a steady energy boost without the jitters often associated with coffee.

## 4. Supports Immune System
The alkylamines found in tea helps boost the immune system's response to infections.

## 5. Aids Digestion
Having a cup of warm Assam tea after a heavy meal can aid in digestion.

## 6. May Reduce Cancer Risk
Some studies suggest the phenolic compounds may inhibit tumor growth, though more research is needed.

## 7. Dental Health
Believe it or not, tea contains fluoride and can help combat cavities (just don't add too much sugar!).

---
*Explore our [Premium Assam Collection](/shop?category=Assam) to experience these benefits yourself.*
        `,
        coverImage: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=1000&auto=format&fit=crop",
        author: "Dr. Aditi Sharma",
        publishedAt: "2024-03-15",
        readingTime: "5 min read",
        tags: ["Assam Tea", "Health", "Wellness"]
    },
    {
        id: "2",
        slug: "how-to-brew-perfect-chai",
        title: "The Art of Brewing the Perfect Masala Chai",
        excerpt: "Stop buying teabags. Learn the authentic Indian method of brewing Masala Chai with whole spices, fresh ginger, and the finest loose leaf tea.",
        content: `
# The Art of Brewing the Perfect Masala Chai

Masala Chai is not just a beverage; it's an emotion in India. Here is how to make it authentically.

## Ingredients
- 1 cup Water
- 1 cup Whole Milk (or oat milk)
- 2 tsp [TeaCom Assam Loose Leaf](/shop)
- 1 inch Fresh Ginger (crushed)
- 2 Cardamom pods (crushed)
- 1 Clove
- Sugar to taste

## Instructions
1. **Boil Water**: In a saucepan, bring water to a boil with the crushed ginger and spices. Let it simmer for 2 mins to extract flavors.
2. **Add Tea**: Add the tea leaves and boil for 1 more minute until the water turns dark red/brown.
3. **Add Milk**: Pour in the milk and bring it to a boil again.
4. **The "Pull"**: Lift the tea with a ladle and pour it back to aerate it. This creates a creamy texture.
5. **Simmer & Strain**: Simmer for 2 minutes on low heat. Strain into cups and serve hot!

Enjoy with biscuits!
        `,
        coverImage: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000&auto=format&fit=crop",
        author: "Ritesh Kumar",
        publishedAt: "2024-03-10",
        readingTime: "4 min read",
        tags: ["Recipes", "Chai", "Culture"]
    }
];

export async function getBlogPosts() {
    return BLOG_POSTS;
}

export async function getBlogPostBySlug(slug: string) {
    return BLOG_POSTS.find(p => p.slug === slug);
}
