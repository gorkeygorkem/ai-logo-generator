import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

const stylesList = [
  { id: 'no-style', label: 'No Style', icon: 'filter-none' },
  { id: 'monogram', label: 'Monogram', icon: 'text-fields' },
  { id: 'abstract', label: 'Abstract', icon: 'blur-on' },
  { id: 'mascot', label: 'Mascot', icon: 'sports-esports' },
];

export default function InputScreen({ navigation }) {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('no-style');
  const [status, setStatus] = useState('idle'); // idle | processing | done
  const [timerId, setTimerId] = useState(null);
  const [docId, setDocId] = useState(null);

  useEffect(() => {
    if (!docId) return;

    const unsub = onSnapshot(doc(db, 'generations', docId), (docSnap) => {
      const data = docSnap.data();
      if (data?.status === 'done') {
        setStatus('done');
      }
    });

    return () => unsub(); // destroy listener on unmount
  }, [docId]);

  const handleCreate = async () => {
    setStatus('processing');
    console.log('📤 Attempting to write to Firestore...');

    try {
      if (prompt.length > 0) {
        const res = await addDoc(collection(db, 'generations'), {
          prompt,
          style: selectedStyle,
          createdAt: serverTimestamp(),
          status: 'processing', // trigger prompt processing
        });
        console.log('Prompt saved:', res.id);
        setDocId(res.id);
      } else {
        console.log('Empty prompt — skipping');
      }
    } catch (error) {
      console.error('Firestore error:', error);
    }
  };

  const handleChipPress = () => {
    if (status === 'done') {
      navigation.navigate('Output', {
        prompt,
        style: selectedStyle,
      });

      // Reset (optional)
      setStatus('idle');
      setPrompt('');
      setSelectedStyle('no-style');
    }
  };

  useEffect(() => {
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [timerId]);

  const renderStatusChip = () => {
    if (status === 'idle') return null;

    const isProcessing = status === 'processing';

    return (
      <TouchableOpacity
        onPress={handleChipPress}
        disabled={isProcessing}
        activeOpacity={isProcessing ? 1 : 0.7}>
        <View style={styles.chipContainer}>
          <View style={styles.chipIcon}>
            {isProcessing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="checkmark-circle" size={18} color="#81c784" />
            )}
          </View>
          <View style={styles.chipTextContainer}>
            <Text style={styles.chipMain}>
              {isProcessing ? 'Creating Your Design…' : 'Your Design is Ready!'}
            </Text>
            <Text style={styles.chipSub}>
              {isProcessing ? 'Ready in 2 seconds' : 'Tap to see it.'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}>
      <Text style={styles.screenHeader}>AI Logo</Text>

      <View style={styles.header}>{renderStatusChip()}</View>

      <View style={styles.promptHeader}>
        <Text style={styles.labelfirst}>Enter Your Prompt</Text>
        <TouchableOpacity style={styles.surpriseBtn}>
          <Ionicons name="sparkles-outline" size={16} color="#fff" />
          <Text style={styles.surpriseText}> Surprise me</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.promptRow}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            multiline
            maxLength={500}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="A blue lion logo reading 'HEXA' in bold letters"
            placeholderTextColor="#ccc"
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{prompt.length}/500</Text>
        </View>
      </View>

      <Text style={styles.label}>Logo Styles</Text>
      <FlatList
        data={stylesList}
        keyExtractor={(item) => item.id}
        horizontal
        contentContainerStyle={styles.styleContainer}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSelected = selectedStyle === item.id;
          return (
            <TouchableOpacity
              style={[styles.styleCard, isSelected && styles.selectedStyleCard]}
              onPress={() => setSelectedStyle(item.id)}>
              <MaterialIcons
                name={item.icon}
                size={28}
                color={isSelected ? '#fff' : '#999'}
              />
              <Text
                style={[
                  styles.styleText,
                  isSelected && styles.selectedStyleText,
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreate}
        disabled={status === 'processing'}>
        <LinearGradient
          colors={['#4a00e0', '#8e2de2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonGradient}>
          <Text style={styles.buttonText}>Create ✨</Text>
        </LinearGradient>
      </TouchableOpacity>
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
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  labelfirst: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  textInput: {
    marginTop: 5,
    backgroundColor: '#1e1e2f',
    color: '#fff',
    borderRadius: 16,
    padding: 16,
    minHeight: 175,
    fontSize: 15,
    flex: 1,
    textAlignVertical: 'top',
  },
  promptRow: {
    marginBottom: 20,
  },
  surpriseBtn: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  surpriseText: {
    color: '#aaa',
    fontSize: 14,
  },
  styleContainer: {
    gap: 6,
  },
  styleCard: {
    width: 90,
    height: 90,
    backgroundColor: '#1e1e2f',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedStyleCard: {
    backgroundColor: '#4a00e0',
  },
  styleText: {
    marginTop: 8,
    color: '#aaa',
    fontSize: 12,
  },
  selectedStyleText: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    overflow: 'hidden',
    borderRadius: 50,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  chipDone: {
    backgroundColor: '#2e7d32',
  },
  chipText: {
    color: '#fff',
    fontSize: 14,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    backgroundColor: '#2f2f3b',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  chipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chipTextContainer: {
    flex: 1,
  },
  chipMain: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  chipSub: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  screenHeader: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputWrapper: {
    minHeight: 175,
  },
  charCount: {
    position: 'absolute',
    bottom: 1,
    left: 16,
    color: '#888',
    fontSize: 12,
  },
});
