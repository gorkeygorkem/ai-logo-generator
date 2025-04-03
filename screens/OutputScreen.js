import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function OutputScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { prompt, style } = route.params || {
    prompt:
      'A professional logo for Harrison & Co. Law Firm, using balanced serif fonts',
    style: 'Monogram',
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    Alert.alert('Copied!', 'Prompt copied to clipboard.');
  };

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Design</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Logo Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/mock.jpg')} // 👈 Replace with your mock image
          resizeMode="contain"
          style={styles.image}
        />
      </View>

      {/* Prompt Card */}
      <View style={styles.promptCard}>
        <View style={styles.promptHeader}>
          <Text style={styles.promptLabel}>Prompt</Text>
          <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
            <Ionicons name="copy-outline" size={16} color="#aaa" />
            <Text style={styles.copyText}> Copy</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.promptText}>{prompt}</Text>
        <View style={styles.styleChip}>
          <Text style={styles.chipText}>{style}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 56,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  imageContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  promptCard: {
    backgroundColor: '#2f2f3b',
    borderRadius: 20,
    padding: 16,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  promptLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyText: {
    color: '#aaa',
    fontSize: 12,
  },
  promptText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  styleChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
  },
});
