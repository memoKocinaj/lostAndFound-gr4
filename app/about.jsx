
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../components/NavBar";

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>About Find Lost Things</Text>
          <Text style={styles.tagline}>
            Reuniting people with their lost belongings
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.description}>
            Find Lost Things is an innovative academic project developed by 5
            dedicated Computer Engineering students from FIEK (Faculty of
            Electrical and Computer Engineering). As part of our university
            coursework, we created this comprehensive lost-and-found application
            to address the common problem of misplaced belongings in our
            community.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>• Report lost items</Text>
            <Text style={styles.featureItem}>• Browse found items</Text>
            <Text style={styles.featureItem}>• User profiles</Text>
            <Text style={styles.featureItem}>• Easy navigation</Text>
            <Text style={styles.featureItem}>• Category organization</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>• Education</Text>
            <Text style={styles.featureItem}>• Cars</Text>
            <Text style={styles.featureItem}>• Personal Things</Text>
            <Text style={styles.featureItem}>• Animals</Text>
            <Text style={styles.featureItem}>• People</Text>
            <Text style={styles.featureItem}>• Women Clothing</Text>
            <Text style={styles.featureItem}>• Accessories</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.description}>
            Have questions or suggestions? We'd love to hear from you!
          </Text>
          <Text style={styles.contactInfo}>Email: AlbinKurti@refind.com</Text>
          <Text style={styles.contactInfo}>Phone: (383) 49-827371</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 0.0.1</Text>
          <Text style={styles.footerText}>
            © 2025 Find Lost Things App. All rights reserved.
          </Text>
        </View>
      </ScrollView>
      <NavBar />

    </SafeAreaView>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    fontSize: 16,
    color: "#666",
    marginBottom: 6,
    lineHeight: 22,
  },
  contactInfo: {
    fontSize: 16,
    color: "#4A90E2",
    marginTop: 8,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
    padding: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 4,
  },
});
