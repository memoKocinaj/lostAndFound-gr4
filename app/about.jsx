
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