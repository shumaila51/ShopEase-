import { Button } from "@/components/ui/Button";
import { Colors } from "@/constants/colors";
import { useRouter } from "expo-router";
import { CheckCircle, ShoppingBag } from "lucide-react-native";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function OrderSuccessScreen() {
  const router = useRouter();

  useEffect(() => {
    // Trigger success haptic feedback on native platforms
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const handleContinueShopping = () => {
    router.push("/");
  };

  const handleViewOrders = () => {
    router.push("/profile/orders");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle size={80} color={Colors.success} />
        </View>
        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.message}>
          Your order has been placed successfully. You will receive a confirmation
          email shortly.
        </Text>
        <View style={styles.orderInfo}>
          <Text style={styles.orderInfoText}>
            Order #: {Math.floor(Math.random() * 1000000).toString().padStart(6, "0")}
          </Text>
          <Text style={styles.orderInfoText}>
            Date: {new Date().toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="View My Orders"
          variant="outline"
          onPress={handleViewOrders}
          icon={<ShoppingBag size={20} color={Colors.primary} />}
          style={styles.viewOrdersButton}
        />
        <Button
          title="Continue Shopping"
          onPress={handleContinueShopping}
          style={styles.continueButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  orderInfo: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderInfoText: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 24,
  },
  viewOrdersButton: {
    marginBottom: 12,
  },
  continueButton: {},
});