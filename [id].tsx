mport { ProductCard } from "@/components/ui/ProductCard";
import { Colors } from "@/constants/colors";
import { useProductsByCategory } from "@/hooks/product-store";
import { useWishlist } from "@/hooks/wishlist-store";
import { Product } from "@/types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Filter } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { categories } from "@/mocks/data";

type SortOption = "price-asc" | "price-desc" | "rating" | "newest";

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: products, isLoading } = useProductsByCategory(id);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  const category = categories.find((c) => c.id === id);

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleToggleFavorite = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleSortPress = () => {
    setShowSortOptions(!showSortOptions);
  };

  const handleSortOptionPress = (option: SortOption) => {
    setSortOption(option);
    setShowSortOptions(false);
  };

  const getSortedProducts = () => {
    if (!products) return [];

    const productsWithFavorites = products.map((product) => ({
      ...product,
      isFavorite: isInWishlist(product.id),
    }));

    switch (sortOption) {
      case "price-asc":
        return [...productsWithFavorites].sort(
          (a, b) => 
            a.price * (1 - a.discountPercentage / 100) - 
            b.price * (1 - b.discountPercentage / 100)
        );
      case "price-desc":
        return [...productsWithFavorites].sort(
          (a, b) => 
            b.price * (1 - b.discountPercentage / 100) - 
            a.price * (1 - a.discountPercentage / 100)
        );
      case "rating":
        return [...productsWithFavorites].sort((a, b) => b.rating - a.rating);
      case "newest":
      default:
        return productsWithFavorites;
    }
  };

  const sortedProducts = getSortedProducts();

  return (
    <>
      <Stack.Screen
        options={{
          title: category?.name || "Category",
          headerRight: () => (
            <TouchableOpacity
              style={styles.filterButton}
              onPress={handleSortPress}
            >
              <Filter size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        {showSortOptions && (
          <View style={styles.sortOptionsContainer}>
            <TouchableOpacity
              style={[
                styles.sortOption,
                sortOption === "newest" && styles.selectedSortOption,
              ]}
              onPress={() => handleSortOptionPress("newest")}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortOption === "newest" && styles.selectedSortOptionText,
                ]}
              >
                Newest
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortOption,
                sortOption === "price-asc" && styles.selectedSortOption,
              ]}
              onPress={() => handleSortOptionPress("price-asc")}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortOption === "price-asc" && styles.selectedSortOptionText,
                ]}
              >
                Price: Low to High
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortOption,
                sortOption === "price-desc" && styles.selectedSortOption,
              ]}
              onPress={() => handleSortOptionPress("price-desc")}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortOption === "price-desc" && styles.selectedSortOptionText,
                ]}
              >
                Price: High to Low
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortOption,
                sortOption === "rating" && styles.selectedSortOption,
              ]}
              onPress={() => handleSortOptionPress("rating")}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortOption === "rating" && styles.selectedSortOptionText,
                ]}
              >
                Top Rated
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : sortedProducts.length > 0 ? (
          <FlatList
            data={sortedProducts}
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
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterButton: {
    padding: 8,
    marginRight: 8,
  },
  sortOptionsContainer: {
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    padding: 12,
  },
  sortOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedSortOption: {
    backgroundColor: Colors.primary + "20",
  },
  sortOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedSortOptionText: {
    color: Colors.primary,
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
    fontSize: 16,
    color: Colors.textLight,
  },
});