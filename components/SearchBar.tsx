
import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  debounceMs?: number;
}

export default function SearchBar({ 
  placeholder = 'Rechercher...', 
  onSearch, 
  onClear,
  debounceMs = 300 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const handleTextChange = useCallback((text: string) => {
    setQuery(text);
    
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Set new timer
    const timer = setTimeout(() => {
      console.log('Search query:', text);
      onSearch(text);
    }, debounceMs);
    
    setDebounceTimer(timer);
  }, [onSearch, debounceMs, debounceTimer]);

  const handleClear = useCallback(() => {
    console.log('Clearing search');
    setQuery('');
    onSearch('');
    onClear?.();
    
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  }, [onSearch, onClear, debounceTimer]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color={colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          returnKeyType="search"
          onSubmitEditing={() => onSearch(query)}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Icon name="close-circle" size={20} color={colors.textLight} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 4,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
});
