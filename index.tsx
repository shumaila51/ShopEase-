import { Banner } from "@/components/home/Banner";
import { Categories } from "@/components/home/Categories";
import { FlashDeals } from "@/components/home/FlashDeals";
import { ProductSection } from "@/components/home/ProductSection";
import { Colors } from "@/constants/colors";
import { useWishlist } from "@/hooks/wishlist-store";
import { useBanners } from "@/hooks/product-store";
import { Product } from "@/types";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  categories,
  featuredProducts,
  flashDeals,
  newArrivals,
} from "@/mocks/data";

export default function HomeScreen() {
  const { data: banners = [], isLoading, refetch, isRefetching } = useBanners();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  const handleRefresh = async () => {
    await refetch();
  };

  const handleToggleFavorite = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleSeeAllFeatured = () => {
    router.push("/(tabs)/search?filter=featured");
  };

  const handleSeeAllNewArrivals = () => {
    router.push("/(tabs)/search?filter=new");
  };

  const handleSearchPress = () => {
    router.push("/(tabs)/search");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appName}>ShopWave</Text>
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchPress}
        >
          <Search size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <Banner banners={banners} testID="home-banners" />
      
      <Categories categories={categories} testID="home-categories" />
      
      <FlashDeals
        flashDeal={flashDeals}
        onToggleFavorite={handleToggleFavorite}
        testID="home-flash-deals"
      />
      
      <ProductSection
        title="Featured Products"
        products={featuredProducts.map(product => ({
          ...product,
          isFavorite: isInWishlist(product.id),
        }))}
        onToggleFavorite={handleToggleFavorite}
        onSeeAll={handleSeeAllFeatured}
        testID="home-featured-products"
      />
      
      <ProductSection
        title="New Arrivals"
        products={newArrivals.map(product => ({
          ...product,
          isFavorite: isInWishlist(product.id),
        }))}
        onToggleFavorite={handleToggleFavorite}
        onSeeAll={handleSeeAllNewArrivals}
        testID="home-new-arrivals"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});