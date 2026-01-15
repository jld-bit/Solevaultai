import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Alert, StyleSheet } from 'react-native';
import { Sneaker } from '../types';

interface CollectionViewProps {
  sneakers: Sneaker[];
  onDelete: (id: string) => void;
  onAddFromSearch: (term: string) => void;
  onEdit: (sneaker: Sneaker) => void;
}

type SortOption = 'newest' | 'oldest' | 'price_high' | 'price_low';

const CollectionView: React.FC<CollectionViewProps> = ({ sneakers, onDelete, onAddFromSearch, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const filteredSneakers = useMemo(() => {
    let result = sneakers;

    // Filter
    const term = searchTerm.toLowerCase().trim();
    if (term) {
        result = result.filter(s => {
            const fullSearchString = `${s.brand} ${s.model} ${s.colorway}`.toLowerCase();
            return fullSearchString.includes(term);
        });
    }

    // Sort
    return [...result].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
            case 'oldest':
                return new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
            case 'price_high':
                return (b.price || 0) - (a.price || 0);
            case 'price_low':
                return (a.price || 0) - (b.price || 0);
            default:
                return 0;
        }
    });

  }, [sneakers, searchTerm, sortBy]);

  const confirmDelete = (id: string) => {
    Alert.alert(
      "Delete Sneaker",
      "Are you sure you want to remove this pair?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => onDelete(id), style: "destructive" }
      ]
    );
  };

  const renderSneakerItem = ({ item }: { item: Sneaker }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onEdit(item)}
      onLongPress={() => confirmDelete(item.id)}
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderImage}>
             <Text style={{ fontSize: 32 }}>👟</Text>
          </View>
        )}
        <View style={styles.brandBadge}>
          <Text style={styles.brandText}>{item.brand}</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.modelText} numberOfLines={1}>{item.model}</Text>
        <Text style={styles.colorText} numberOfLines={1}>{item.colorway}</Text>
        
        <View style={styles.cardFooter}>
          <Text style={styles.priceText}>
            {item.price ? `$${item.price}` : '-'}
          </Text>
          <View style={styles.sizeBadge}>
            <Text style={styles.sizeText}>US {item.size}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Cycle sort options on tap
  const toggleSort = () => {
    const options: SortOption[] = ['newest', 'oldest', 'price_high', 'price_low'];
    const nextIndex = (options.indexOf(sortBy) + 1) % options.length;
    setSortBy(options[nextIndex]);
  };

  const getSortLabel = () => {
    switch(sortBy) {
        case 'newest': return 'Newest';
        case 'oldest': return 'Oldest';
        case 'price_high': return '$$$ High';
        case 'price_low': return '$$$ Low';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Kicks</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{filteredSneakers.length} Pairs</Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#999"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={styles.sortButton} onPress={toggleSort}>
            <Text style={styles.sortButtonText}>{getSortLabel()}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredSneakers}
        renderItem={renderSneakerItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.listRow}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No kicks found</Text>
            {searchTerm ? (
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.emptyText}>Couldn't find "{searchTerm}"</Text>
                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => onAddFromSearch(searchTerm)}
                    >
                        <Text style={styles.addButtonText}>Add "{searchTerm}"</Text>
                    </TouchableOpacity>
                </View>
            ) : (
               <Text style={styles.emptyText}>Your inventory is empty.</Text>
            )}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  countBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  searchRow: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  sortButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  listContainer: {
    paddingBottom: 20,
  },
  listRow: {
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    maxWidth: '48%', // Ensure 2 columns
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  brandText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000',
    textTransform: 'uppercase',
  },
  cardContent: {
    gap: 2,
  },
  modelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  colorText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 6,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  sizeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sizeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
  }
});

export default CollectionView;
