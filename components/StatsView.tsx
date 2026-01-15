import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Sneaker } from '../types';

interface StatsViewProps {
  sneakers: Sneaker[];
}

const StatsView: React.FC<StatsViewProps> = ({ sneakers }) => {
  const totalValue = sneakers.reduce((sum, s) => sum + (s.price || 0), 0);
  
  const brandData = useMemo(() => {
    const counts: Record<string, number> = {};
    sneakers.forEach(s => {
      const brand = s.brand || 'Other';
      counts[brand] = (counts[brand] || 0) + 1;
    });
    // Sort by count desc
    return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
  }, [sneakers]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Vault Stats</Text>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.blackCard]}>
            <Text style={styles.statLabelLight}>Total Value</Text>
            <Text style={styles.statValueLight}>${totalValue.toLocaleString()}</Text>
        </View>
        <View style={[styles.statCard, styles.grayCard]}>
            <Text style={styles.statLabelDark}>Total Pairs</Text>
            <Text style={styles.statValueDark}>{sneakers.length}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Brand Distribution</Text>
        
        {brandData.length > 0 ? (
            <View style={styles.chartContainer}>
                {brandData.map((item, index) => {
                    const percentage = Math.round((item.value / sneakers.length) * 100);
                    return (
                        <View key={item.name} style={styles.barRow}>
                            <View style={styles.barLabelContainer}>
                                <Text style={styles.barLabel}>{item.name}</Text>
                                <Text style={styles.barCount}>{item.value} pairs</Text>
                            </View>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
                            </View>
                        </View>
                    );
                })}
            </View>
        ) : (
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No data available</Text>
            </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    marginTop: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    justifyContent: 'center',
  },
  blackCard: {
    backgroundColor: '#000',
  },
  grayCard: {
    backgroundColor: '#F3F4F6',
  },
  statLabelLight: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValueLight: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  statLabelDark: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValueDark: {
    color: '#000',
    fontSize: 24,
    fontWeight: '700',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  chartContainer: {
    gap: 16,
  },
  barRow: {
    gap: 8,
  },
  barLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  barCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 4,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
  }
});

export default StatsView;
