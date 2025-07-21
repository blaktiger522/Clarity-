import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Copy, Check } from 'lucide-react-native';
import colors from '../Constants/Colors';
import * as Clipboard from 'expo-clipboard';
import { Platform } from 'react-native';

interface ResultCardProps {
  text: string;
  timestamp: string;
  imageUri?: string;
}

const ResultCard = ({ text, timestamp, imageUri }: ResultCardProps) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    if (Platform.OS !== 'web') {
      await Clipboard.setStringAsync(text);
    } else {
      navigator.clipboard.writeText(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.timestamp}>{timestamp}</Text>
          <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
            {copied ? (
              <Check size={18} color={colors.success} />
            ) : (
              <Copy size={18} color={colors.darkGray} />
            )}
          </TouchableOpacity>
        </View>
        
        {imageUri && (
          <Text style={styles.sectionTitle}>Transcription</Text>
        )}
        
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    backgroundColor: colors.background,
    padding: 0,
  },
  image: {
    width: '100%',
    height: 280,
    resizeMode: 'contain',
    backgroundColor: colors.white,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timestamp: {
    color: colors.darkGray,
    fontSize: 12,
    fontWeight: '500',
  },
  copyButton: {
    padding: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
});

export default ResultCard;
