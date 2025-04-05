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
  Image,
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
  { id: 'No-style', label: 'No Style', icon: 'do-not-disturb' },
  { id: 'Monogram', label: 'Monogram', icon: 'texture' },
  { id: 'Abstract', label: 'Abstract', icon: 'blur-on' },
  { id: 'Mascot', label: 'Mascot', icon: 'sports-esports' },
];

export default function InputScreen({ navigation }) {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('No-style');
  const [status, setStatus] = useState('idle'); // idle | processing | done
  const [timerId, _] = useState(null);
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
          style:
            stylesList.find((s) => s.id === selectedStyle)?.label || 'No Style',
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

  const surprisePrompts = [
    'A minimalist fox logo with sharp edges in orange',
    'A futuristic AI logo with glowing elements in neon blue',
    'A vintage bakery logo with cursive script and wheat icon',
  ];

  const handleSurprise = () => {
    const random =
      surprisePrompts[Math.floor(Math.random() * surprisePrompts.length)];
    setPrompt(random);
  };

  const handleChipPress = () => {
    if (status === 'done') {
      navigation.navigate('Output', {
        prompt,
        style:
          stylesList.find((s) => s.id === selectedStyle)?.label || 'No Style',
      });

      // Reset (optional)
      setStatus('idle');
      setPrompt('');
      setSelectedStyle('No-style');
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
        <LinearGradient
          colors={
            isProcessing ? ['#1e1e2f', '#1e1e2f'] : ['#4a00e0', '#8e2de2']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.statusChipContainer}>
          <View style={styles.statusLeftFull}>
            {isProcessing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Image
                source={require('../assets/mock.jpg')}
                style={styles.statusFullImage}
              />
            )}
          </View>

          <View style={styles.statusRight}>
            <Text style={styles.chipMain}>
              {isProcessing
                ? 'Creating Your Design...'
                : 'Your Design is Ready!'}
            </Text>
            <Text style={styles.chipSub}>
              {isProcessing ? 'Ready in 1 minute' : 'Tap to see it.'}
            </Text>
          </View>
        </LinearGradient>
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
        <TouchableOpacity onPress={handleSurprise} style={styles.surpriseBtn}>
          <Ionicons name="dice" size={16} color="#fff" />
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
            <View style={styles.styleItem}>
              <TouchableOpacity
                style={[
                  styles.styleCard,
                  isSelected && styles.selectedStyleCard,
                ]}
                onPress={() => setSelectedStyle(item.id)}>
                <MaterialIcons
                  name={item.icon}
                  size={32}
                  color={isSelected ? '#fff' : '#999'}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.styleText,
                  isSelected && styles.selectedStyleText,
                ]}>
                {item.label}
              </Text>
            </View>
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
          <Text style={styles.buttonText}>
            Create <Ionicons name="sparkles-outline" size={16} color="#fff" />
          </Text>
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
  screenHeader: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },

  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  promptRow: {
    marginBottom: 20,
  },
  inputWrapper: {
    minHeight: 175,
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
  charCount: {
    position: 'absolute',
    bottom: 5,
    left: 16,
    color: '#888',
    fontWeight: '400',
    fontSize: 11,
  },

  surpriseBtn: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  surpriseText: {
    color: '#aaa',
    fontSize: 14,
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
  styleContainer: {
    gap: 6,
  },
  styleItem: {
    alignItems: 'center',
    marginRight: 12,
  },
  styleCard: {
    width: 90,
    height: 90,
    backgroundColor: '#1e1e2f',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleText: {
    marginTop: 6,
    color: '#aaa',
    fontSize: 13,
  },
  selectedStyleText: {
    color: '#fff',
    fontWeight: '700',
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
    fontSize: 17,
    fontWeight: '600',
  },

  statusChipContainer: {
    flexDirection: 'row',
    height: 72,
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'stretch',
  },
  statusLeftFull: {
    width: 72,
    height: '100%',
    backgroundColor: '#00000033',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusFullImage: {
    width: 80,
    height: 80,
  },
  statusRight: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  chipMain: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  chipSub: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 2,
  },
});
