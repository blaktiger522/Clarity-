import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImageIcon, Scan, FileText } from 'lucide-react-native';
import colors from '../../Constants/Colors';
import FeatureCard from '../../Components/Featurecard';
import ResultCard from '../../Components/Resultcard';
import { recognizeText, mockRecognizeText } from '../../Utils/aiutils';
import { useHistoryStore } from '../../Store/HistoryStore';

export default function HomeScreen() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<{
    text: string;
    imageUri: string;
    timestamp: string;
  } | null>(null);
  
  const addItem = useHistoryStore((state) => state.addItem);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Sorry, we need camera roll permissions to make this work!'
        );
        return false;
      }
      
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus.status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Sorry, we need camera permissions to make this work!'
        );
        return false;
      }
    }
    return true;
  };

  const processImage = async (imageUri: string) => {
    setIsProcessing(true);
    setCurrentResult(null);
    
    try {
      let extractedText: string;
      
      if (Platform.OS === 'web') {
        // Use mock data for web testing
        extractedText = await mockRecognizeText();
      } else {
        // Convert image to base64 for API
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            const base64Data = result.split(',')[1];
            resolve(base64Data);
          };
          reader.readAsDataURL(blob);
        });
        
        extractedText = await recognizeText(base64);
      }
      
      const timestamp = new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const result = {
        text: extractedText,
        imageUri,
        timestamp,
      };
      
      setCurrentResult(result);
      addItem(extractedText, imageUri);
      
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process the image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const pickImageFromLibrary = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await processImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await processImage(result.assets[0].uri);
    }
  };

  const useMockData = async () => {
    const result = {
      text: await mockRecognizeText(),
      imageUri: '',
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };
    
    setCurrentResult(result);
    addItem(result.text);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Handwrite AI Cloner</Text>
          <Text style={styles.subtitle}>
            Transform handwritten text into digital format using AI
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, styles.cameraButton]}
            onPress={takePhoto}
            disabled={isProcessing}
          >
            <Camera size={24} color={colors.white} />
            <Text style={styles.primaryButtonText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.primaryButton, styles.galleryButton]}
            onPress={pickImageFromLibrary}
            disabled={isProcessing}
          >
            <ImageIcon size={24} color={colors.white} />
            <Text style={styles.primaryButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Demo Button for Web */}
        {Platform.OS === 'web' && (
          <TouchableOpacity 
            style={styles.demoButton}
            onPress={useMockData}
            disabled={isProcessing}
          >
            <FileText size={20} color={colors.primary} />
            <Text style={styles.demoButtonText}>Try Demo</Text>
          </TouchableOpacity>
        )}

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <FeatureCard
            icon={<Scan size={24} color={colors.primary} />}
            title="AI-Powered OCR"
            description="Advanced artificial intelligence extracts text from handwritten documents with high accuracy"
          />
          
          <FeatureCard
            icon={<Camera size={24} color={colors.primary} />}
            title="Camera Integration"
            description="Capture documents directly with your camera or choose from your photo library"
          />
          
          <FeatureCard
            icon={<FileText size={24} color={colors.primary} />}
            title="Text Processing"
            description="Automatically formats and processes extracted text for easy copying and sharing"
          />
        </View>

        {/* Processing Indicator */}
        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.processingText}>
              Analyzing handwriting...
            </Text>
          </View>
        )}

        {/* Current Result */}
        {currentResult && !isProcessing && (
          <View style={styles.resultContainer}>
            <Text style={styles.sectionTitle}>Latest Result</Text>
            <ResultCard
              text={currentResult.text}
              timestamp={currentResult.timestamp}
              imageUri={currentResult.imageUri}
            />
          </View>
        )}
      </ScrollView>
    </View>
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
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.darkGray,
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  cameraButton: {
    backgroundColor: colors.primary,
  },
  galleryButton: {
    backgroundColor: colors.secondary,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  demoButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  featuresContainer: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.darkGray,
    fontWeight: '500',
  },
  resultContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
});
