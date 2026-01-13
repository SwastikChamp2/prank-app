import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Fonts } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import Button from '../../components/ui/Button';
import ContactSupportDrawer from './ContactSupportDrawer';

interface Transaction {
  id: string;
  service: string;
  location: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Refunded';
  paymentMethod: string;
  transactionId: string;
}

const Transactions: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activeFilter, setActiveFilter] = useState<'All' | 'Completed' | 'Refunded'>('All');
  const [showContactSupport, setShowContactSupport] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleContactSupport = () => {
    setShowContactSupport(true);
  };

  const transactionsData: Transaction[] = [
    {
      id: '1',
      service: 'Waterless Cleaning',
      location: 'Jayanagar, Bangalore',
      date: '5th October, 2025',
      amount: 99,
      status: 'Completed',
      paymentMethod: 'UPI',
      transactionId: '#TXN001'
    },
    {
      id: '2',
      service: 'Helmet Repair',
      location: 'Jayanagar, Bangalore',
      date: '20th October, 2025',
      amount: 199,
      status: 'Completed',
      paymentMethod: 'UPI',
      transactionId: '#TXN002'
    },
    {
      id: '3',
      service: 'Helmet Repair',
      location: 'Jayanagar, Bangalore',
      date: '15th September, 2025',
      amount: 499,
      status: 'Refunded',
      paymentMethod: 'Credit Card',
      transactionId: '#TXN004'
    }
  ];

  const totalSpent = transactionsData.reduce((sum, transaction) => 
    transaction.status === 'Completed' ? sum + transaction.amount : sum, 0
  );

  const completedServices = transactionsData.filter(t => t.status === 'Completed').length;
  const avgPerService = completedServices > 0 ? Math.round(totalSpent / completedServices) : 0;

  const filteredTransactions = activeFilter === 'All' 
    ? transactionsData 
    : transactionsData.filter(t => t.status === activeFilter);

  const FilterButton = ({ title, isActive, onPress }: { 
    title: string; 
    isActive: boolean; 
    onPress: () => void; 
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: isActive ? colors.primary : 'transparent',
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.filterButtonText,
          {
            color: isActive ? '#FFFFFF' : colors.grey1,
            fontFamily: isActive ? Fonts.medium : Fonts.regular,
          }
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionHeader}>
        <View style={styles.transactionInfo}>
          <Text style={[styles.serviceName, { color: colors.text }]}>
            {transaction.service}
          </Text>
          <Text style={[styles.location, { color: colors.grey1 }]}>
            {transaction.location}
          </Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            {
              backgroundColor: transaction.status === 'Completed' 
                ? '#E8F5E8' 
                : '#FFF4E6'
            }
          ]}>
            <Text style={[
              styles.statusText,
              {
                color: transaction.status === 'Completed' 
                  ? '#2E7D32' 
                  : '#F57C00'
              }
            ]}>
              {transaction.status}
            </Text>
          </View>
          
          <Text style={[styles.transactionId, { color: colors.text }]}>
            {transaction.paymentMethod} • {transaction.transactionId}
          </Text>
        </View>
      </View>
      
      <View style={styles.transactionBottom}>
        <Text style={[styles.date, { color: colors.text }]}>
          {transaction.date}
        </Text>
        <Text style={[styles.amount, { color: colors.primary }]}>
          ₹{transaction.amount}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colorScheme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.background}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Transactions</Text>
          <View style={styles.headerRight} />
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Total Spent Card */}
        <View style={[styles.totalCard, { backgroundColor: colors.background }]}>
          <View style={[styles.totalCardTop, { borderColor: colors.primary }]} />
          
          <View style={styles.totalCardContent}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>
              Total Spent
            </Text>
            <Text style={[styles.totalAmount, { color: colors.text }]}>
              ₹{totalSpent}
            </Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="trending-up-outline" size={16} color={colors.primary} />
                <Text style={[styles.statText, { color: colors.primary }]}>
                  Avg ₹{avgPerService} per service
                </Text>
              </View>
              
              <Text style={[styles.servicesCount, { color: '#2E7D32' }]}>
                {completedServices} Services
              </Text>
            </View>
          </View>
        </View>

        {/* Filter Buttons - Original Design */}
        <View style={styles.filtersContainer}>
          <FilterButton
            title="All"
            isActive={activeFilter === 'All'}
            onPress={() => setActiveFilter('All')}
          />
          <FilterButton
            title="Completed"
            isActive={activeFilter === 'Completed'}
            onPress={() => setActiveFilter('Completed')}
          />
          <FilterButton
            title="Refunded"
            isActive={activeFilter === 'Refunded'}
            onPress={() => setActiveFilter('Refunded')}
          />
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsList}>
          {filteredTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </View>

        {/* Need Help Section - Original Design */}
        <View style={styles.helpSection}>
          <View style={styles.helpIcon}>
            <Ionicons name="information-circle-outline" size={20} color={colors.grey1} />
          </View>
          <Text style={[styles.helpTitle, { color: colors.text }]}>
            Need Help?
          </Text>
          <Text style={[styles.helpDescription, { color: colors.grey1 }]}>
            If you have any questions about a transaction{'\n'}or need a refund, please contact our customer{'\n'}support.
          </Text>
          
          <Button
            title="Contact Support"
            onPress={handleContactSupport}
            variant="outline"
            style={[styles.supportButton, { borderColor: colors.primary }]}
            textStyle={{ color: colors.primary }}
          />
        </View>
      </ScrollView>

      {/* Contact Support Drawer */}
      <ContactSupportDrawer
        isVisible={showContactSupport}
        onClose={() => setShowContactSupport(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 0,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: Fonts.medium,
    fontSize: 18,
    letterSpacing: 0.3,
  },
  headerRight: {
    width: 32,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // Total Card Styles
  totalCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  totalCardTop: {
    height: 4,
    borderTopWidth: 4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  totalCardContent: {
    padding: 24,
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    marginBottom: 8,
  },
  totalAmount: {
    fontFamily: Fonts.bold,
    fontSize: 36,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    marginLeft: 6,
  },
  servicesCount: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
  },
  
  // Filter Styles - Original Design
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  filterButtonText: {
    fontSize: 14,
  },
  
  // Transactions List Styles
  transactionsList: {
    paddingHorizontal: 20,
  },
  transactionItem: {
    marginBottom: 20,
    padding: 0,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  serviceName: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    marginBottom: 4,
  },
  location: {
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
  },
  transactionId: {
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  transactionBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  amount: {
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  
  // Help Section Styles - Original Design
  helpSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  helpIcon: {
    marginBottom: 16,
  },
  helpTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    marginBottom: 12,
  },
  helpDescription: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  supportButton: {
    borderRadius: 25,
    paddingHorizontal: 32,
  },
});

export default Transactions;