import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ToastAndroid,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
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

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(prompt);
    setCopied(true);

    if (Platform.OS === 'android') {
      ToastAndroid.show('Copied!', ToastAndroid.SHORT);
    }

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Design</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.imageWrapper}>
        <Image
          source={require('../assets/mock.jpg')}
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
            <Text style={styles.copyText}>{copied ? ' Copied' : ' Copy'}</Text>
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
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  image: {
    width: 320,
    height: 320,
    borderRadius: 24,
    backgroundColor: '#fff',
  },
  promptCard: {
    backgroundColor: '#2f2f3b',
    borderRadius: 20,
    padding: 16,
    opacity: 0.8,
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
