import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FileText } from 'lucide-react-native';
import colors from '@/constants/colors';

const EmptyState = () => {
  return (
    <View style={styles.container}>
      <FileText size={48} color={colors.mediumGray} />
      <Text style={styles.title}>No transcriptions yet</Text>
      <Text style={styles.description}>
        Capture or upload an image to get started
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 32,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.darkGray,
    textAlign: 'center',
  },
});

export default EmptyState;
