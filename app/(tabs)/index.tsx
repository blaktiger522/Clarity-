import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Camera, Upload, Zap, FileText, Clock } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '@/constants/colors';
import FeatureCard from '@/components/FeatureCard';
import ResultCard from '@/components/ResultCard';
import { useHistoryStore } from '@/store/historyStore';
import { recognizeText, mockRecognizeText } from '@/utils/aiUtils';

export default function HomeScreen() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string>('');
  const [currentImageUri, setCurrentImageUri] = useState<string>('');
  const addItem = useHistoryStore((state) => state.addItem);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to use this feature.');
        return false;
      }
    }
    return true;
  };

  const processImage = async (imageUri: string) => {
    setIsProcessing(true);
    setCurrentImageUri(imageUri);
    
    try {
      let extractedText: string;
      
      if (Platform.OS === 'web') {
        // Use mock data for web preview
        extractedText = await mockRecognizeText();
      } else {
        // Convert image to base64 for real device
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        
        extractedText = await recognizeText(base64.split(',')[1]);
      }
      
      setResult(extractedText);
      addItem(extractedText, imageUri);
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      await processImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Camera not available', 'Camera is not available in web preview. Please use "Upload Image" instead.');
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to use this feature.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      await processImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Handwrite AI Cloner</Text>
          <Text style={styles.subtitle}>
            Extract text from images using AI-powered OCR
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={takePhoto}
            disabled={isProcessing}
          >
            <Camera color={colors.white} size={24} />
            <Text style={styles.primaryButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={pickImage}
            disabled={isProcessing}
          >
            <Upload color={colors.primary} size={24} />
            <Text style={styles.secondaryButtonText}>Upload Image</Text>
          </TouchableOpacity>
        </View>

        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.processingText}>Processing image...</Text>
          </View>
        )}

        {result && !isProcessing && (
          <View style={styles.resultContainer}>
            <ResultCard
              text={result}
              timestamp={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              imageUri={currentImageUri}
            />
          </View>
        )}

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Features</Text>
          
          <FeatureCard
            icon={<Zap color={colors.primary} size={24} />}
            title="AI-Powered OCR"
            description="Advanced machine learning algorithms for accurate text recognition"
          />
          
          <FeatureCard
            icon={<FileText color={colors.primary} size={24} />}
            title="Multiple Formats"
            description="Extract text from handwritten notes, printed documents, and more"
          />
          
          <FeatureCard
            icon={<Clock color={colors.primary} size={24} />}
            title="History Tracking"
            description="Keep track of all your transcriptions with automatic history"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.darkGray,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  processingContainer: {
    alignItems: 'center',
    padding: 32,
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.darkGray,
  },
  resultContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  featuresContainer: {
    paddingBottom: 32,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
});