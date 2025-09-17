export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  ingredients?: string[]
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "I101",
    name: "Grilled Chicken",
    description: "Tender grilled chicken with herbs and spices",
    price: 250,
    category: "Main Course",
    image: "/grilled-chicken-with-herbs-and-spices-on-plate.jpg",
    ingredients: ["Chicken breast", "Garlic", "Ginger", "Yogurt", "Cumin", "Coriander", "Turmeric", "Red chili powder"],
  },
  {
    id: "I102",
    name: "Mutton Curry",
    description: "Rich and flavorful mutton curry with traditional spices",
    price: 300,
    category: "Main Course",
    image: "/rich-mutton-curry-with-traditional-spices-in-bowl.jpg",
    ingredients: ["Mutton", "Onions", "Tomatoes", "Garam masala", "Bay leaves", "Cardamom", "Cinnamon", "Coconut milk"],
  },
  {
    id: "I103",
    name: "Fish Fry",
    description: "Crispy fried fish with coastal spices",
    price: 200,
    category: "Main Course",
    image: "/crispy-fried-fish-with-coastal-spices-golden-brown.jpg",
    ingredients: ["Fish", "Turmeric", "Red chili powder", "Coriander", "Curry leaves", "Coconut oil"],
  },
  {
    id: "I201",
    name: "Chicken Kebab",
    description: "Juicy chicken kebabs grilled to perfection",
    price: 150,
    category: "Starters",
    image: "/juicy-grilled-chicken-kebabs-on-skewers-with-veget.jpg",
    ingredients: ["Chicken", "Yogurt", "Ginger-garlic paste", "Red chili powder", "Garam masala", "Lemon juice"],
  },
  {
    id: "I202",
    name: "Paneer Tikka",
    description: "Marinated paneer cubes grilled with vegetables",
    price: 120,
    category: "Starters",
    image: "/marinated-paneer-tikka-cubes-with-colorful-bell-pe.jpg",
    ingredients: ["Paneer", "Bell peppers", "Onions", "Yogurt", "Tandoori masala", "Mint chutney"],
  },
  {
    id: "I301",
    name: "Mango Lassi",
    description: "Refreshing mango yogurt drink",
    price: 80,
    category: "Drinks",
    image: "/refreshing-mango-lassi-drink-in-tall-glass-with-ga.jpg",
    ingredients: ["Mango pulp", "Yogurt", "Sugar", "Cardamom", "Ice"],
  },
  {
    id: "I302",
    name: "Fresh Lime Soda",
    description: "Zesty lime soda with mint",
    price: 60,
    category: "Drinks",
    image: "/fresh-lime-soda-with-mint-leaves-in-glass-with-ice.jpg",
    ingredients: ["Fresh lime juice", "Soda water", "Mint leaves", "Salt", "Sugar", "Ice"],
  },
]

export const CATEGORIES = ["Starters", "Main Course", "Drinks"]
