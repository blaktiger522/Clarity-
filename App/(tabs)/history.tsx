import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, Trash2, FileText } from 'lucide-react-native';
import colors from '../../Constants/Colors';
import ResultCard from '../../Components/Resultcard';
import EmptyState from '../../Components/Emptystate';
import { useHistoryStore, type HistoryItem } from '../../Store/HistoryStore';

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { history, clearHistory } = useHistoryStore();

  const filteredHistory = history.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all history items? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearHistory,
        },
      ]
    );
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <ResultCard
      text={item.text}
      timestamp={item.timestamp}
      imageUri={item.imageUri}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>History</Text>
        {history.length > 0 && (
          <TouchableOpacity
            onPress={handleClearHistory}
            style={styles.clearButton}
          >
            <Trash2 size={20} color={colors.danger} />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.subtitle}>
        {history.length} {history.length === 1 ? 'item' : 'items'} processed
      </Text>

      {history.length > 0 && (
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.darkGray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transcriptions..."
            placeholderTextColor={colors.darkGray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => {
    if (searchQuery.length > 0 && filteredHistory.length === 0) {
      return (
        <EmptyState
          icon={<Search size={48} color={colors.darkGray} />}
          title="No results found"
          description={`No transcriptions match "${searchQuery}"`}
        />
      );
    }

    if (history.length === 0) {
      return (
        <EmptyState
          icon={<FileText size={48} color={colors.darkGray} />}
          title="No history yet"
          description="Your transcribed text will appear here after you process images"
        />
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <FlatList
        data={filteredHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          filteredHistory.length === 0 && styles.emptyContent
        ]}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    gap: 4,
  },
  clearButtonText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 16,
    color: colors.darkGray,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  separator: {
    height: 16,
  },
});
