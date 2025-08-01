import { ProductCard } from "@/components/ui/ProductCard";
import { Colors } from "@/constants/colors";
import { useWishlist } from "@/hooks/wishlist-store";
import { useSearchProducts } from "@/hooks/product-store";
import { Product } from "@/types";
import { useRouter } from "expo-router";
import { Search as SearchIcon, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { categories } from "@/mocks/data";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: searchResults, isLoading } = useSearchProducts(searchQuery);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleCategoryPress = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
      router.push(`/category/${categoryId}` as any);
    }
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}` as any);
  };

  const handleToggleFavorite = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const filteredResults = searchResults
    ? selectedCategory
      ? searchResults.filter(
          (product) => product.category === getCategoryName(selectedCategory)
        )
      : searchResults
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={20} color={Colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={16} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.id && styles.selectedCategoryButton,
              ]}
              onPress={() => handleCategoryPress(item.id)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === item.id && styles.selectedCategoryButtonText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : searchQuery.length > 0 ? (
        filteredResults.length > 0 ? (
          <FlatList
            data={filteredResults.map(product => ({
              ...product,
              isFavorite: isInWishlist(product.id),
            }))}
            numColumns={2}
            renderItem={({ item }) => (
              <View style={styles.productCardContainer}>
                <ProductCard
                  product={item}
                  onPress={handleProductPress}
                  onToggleFavorite={handleToggleFavorite}
                />
              </View>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.productsList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>
              Try a different search term or browse categories
            </Text>
          </View>
        )
      ) : (
        <View style={styles.initialContainer}>
          <SearchIcon size={64} color={Colors.textLight} style={styles.initialIcon} />
          <Text style={styles.initialText}>Search for products</Text>
          <Text style={styles.initialSubtext}>
            Enter a product name, brand, or category
          </Text>
        </View>
      )}
    </View>
  );
}

// Helper function to get category name from ID
const getCategoryName = (categoryId: string): string => {
  const category = categories.find((c) => c.id === categoryId);
  return category ? category.name : "";
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: Colors.primary,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: Colors.text,
  },
  clearButton: {
    padding: 8,
  },
  categoriesContainer: {
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoriesList: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: Colors.background,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedCategoryButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productsList: {
    padding: 8,
  },
  productCardContainer: {
    flex: 1,
    padding: 8,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: "center",
  },
  initialContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  initialIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  initialText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  initialSubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: "center",
  },
});