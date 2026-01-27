# Quick Reference - Firebase Integration

## Service Files

### Import Examples

```typescript
// In Home.tsx
import { fetchPrankCategories } from '../services/PrankCategoryService';

// In SelectPrank.tsx
import { fetchPranksByCategory, fetchAllPranks } from '../services/PrankService';

// In SelectBox.tsx
import { fetchAllBoxes } from '../services/BoxService';

// In SelectWrap.tsx
import { fetchAllWraps } from '../services/WrapService';
```

## Usage Patterns

### Fetching Prank Categories
```typescript
const categories = await fetchPrankCategories();
// Returns: Array<{ id, title, count, imageUrl }>
```

### Fetching Pranks by Category
```typescript
const pranks = await fetchPranksByCategory('Fun Pranks');
// Returns: Array<{ id, name, price, image }>
```

### Fetching All Boxes/Wraps
```typescript
const boxes = await fetchAllBoxes();
const wraps = await fetchAllWraps();
// Returns: Array<{ id, name, price, image }>
```

## Data Mappings

### Prank Category → UI
| Firebase Field | UI Property | Notes |
|---|---|---|
| prankCategoryName | title | Display name |
| prankCategoryImage | imageUrl | Background image URL |
| totalPranks.length | count | Number of pranks |

### Prank → UI
| Firebase Field | UI Property | Notes |
|---|---|---|
| prankTitle | name | Product name |
| coverImage | image | Displayed on card |
| price | price | Shown as ₹ prefix |
| prankCategory | category | For filtering |

### Box/Wrap → UI
| Firebase Field | UI Property | Notes |
|---|---|---|
| boxTitle/wrapTitle | name | Product name |
| boxImage/wrapImage | image | Displayed on card |
| price | price | null = FREE |

## Filtering Logic

### By Category
```typescript
// SelectPrank.tsx
const pranks = await fetchPranksByCategory(categoryParam);
// Filters: prankCategory === categoryName
```

### By Price (Cheapest)
```typescript
.sort((a, b) => parseInt(a.price) - parseInt(b.price))
```

## State Management Pattern

```typescript
const [items, setItems] = useState<ItemType[]>([]);
const [filteredItems, setFilteredItems] = useState<ItemType[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  loadItems();
}, []);

useEffect(() => {
  filterItems();
}, [items, selectedCategory]);

const loadItems = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await fetchItems();
    setItems(data);
  } catch (err) {
    setError('Failed to load items');
  } finally {
    setLoading(false);
  }
};
```

## Component Props Pattern

```typescript
type CardProps = {
  id: string;
  name: string;
  price: string | null;
  image: string;
  theme: typeof Colors.light;
  isSelected: boolean;
  onPress: () => void;
};
```

## Error Handling

```typescript
{error && !loading && (
  <View style={styles.errorContainer}>
    <Text>{error}</Text>
    <TouchableOpacity onPress={loadItems}>
      <Text>Retry</Text>
    </TouchableOpacity>
  </View>
)}
```

## Navigation with Parameters

```typescript
// In Home.tsx - Pass category
router.push({
  pathname: '/select-prank',
  params: { category: categoryTitle },
});

// In SelectPrank.tsx - Receive category
const params = useLocalSearchParams();
const categoryParam = params.category as string;
```

## Firebase Queries

All queries use simple `getDocs()` with optional `where()` filtering:

```typescript
// Fetch all
const snapshot = await getDocs(collection(db, 'pranks'));

// Fetch by category
const q = query(collection(db, 'pranks'), 
  where('prankCategory', '==', categoryName)
);
const snapshot = await getDocs(q);
```

## Loading States

All pages implement three states:
1. **Loading** - ActivityIndicator with message
2. **Error** - Error message with retry button
3. **Empty** - "No items found" message

## Performance Tips

1. Fetch data once in useEffect
2. Filter data locally when possible
3. Use memoization for expensive renders
4. Avoid fetching in loops
5. Cache category data if frequently accessed

## Troubleshooting

### Categories not showing
- Check Firebase collection: 'prank-category'
- Verify document structure has `prankCategoryName` and `totalPranks`

### Pranks not filtering by category
- Ensure `prankCategory` field matches exactly with category name
- Check case sensitivity

### Boxes/Wraps not displaying
- Verify collection names: 'boxes', 'wraps'
- Check image URLs are valid

### Empty states appearing
- Check Firestore data exists
- Verify network connection
- Check collection names in code match Firebase
