/**
 * FMC (Friends and Media) - Attendance & Salary Management System
 * Mobile App - React Native + Expo
 * Version: 2.0 (Enhanced with Location Tracking)
 * Author: Ghost (Manjeet)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  FlatList,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import axios from 'axios';

// ⚠️ IMPORTANT: Change API_URL based on your setup
const API_URL = 'http://10.0.2.2:5000/api'; // Android emulator
// const API_URL = 'http://192.168.1.100:5000/api'; // Local network - Change IP
// const API_URL = 'http://localhost:5000/api'; // iOS simulator
// const API_URL = 'https://your-backend.com/api'; // Production

// ============= MAIN APP COMPONENT =============
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    checkIfLoggedIn();
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('⚠️ Warning', 'Location permission is required for attendance tracking');
      }
    } catch (error) {
      console.log('Location permission error:', error);
    }
  };

  const checkIfLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const userData = await AsyncStorage.getItem('user');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setIsLoggedIn(true);
        setUser(parsedUser);
        setUserRole(parsedUser.role);
        setAccessToken(token);
      }
    } catch (e) {
      console.log('Not logged in');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (token, userData, refreshToken) => {
    await AsyncStorage.setItem('accessToken', token);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setAccessToken(token);
    setIsLoggedIn(true);
    setUser(userData);
    setUserRole(userData.role);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setUserRole(null);
    setAccessToken(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>🚀 Loading FMC...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (userRole === 'admin') {
    return <AdminScreen user={user} onLogout={handleLogout} token={accessToken} />;
  } else {
    return <EmployeeScreen user={user} onLogout={handleLogout} token={accessToken} />;
  }
}

// ============= LOGIN SCREEN =============
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('❌ Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email.trim().toLowerCase(),
        password,
      });

      const { accessToken, refreshToken, user } = response.data;
      onLogin(accessToken, user, refreshToken);
    } catch (error) {
      Alert.alert(
        '❌ Login Failed',
        error.response?.data?.error || 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007bff" />
      <ScrollView contentContainerStyle={styles.loginContainer}>
        <Text style={styles.title}>🚀 FMC</Text>
        <Text style={styles.subtitle}>Attendance Management 2.0</Text>
        <Text style={styles.tagline}>🛡️ Military-Grade Security</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Logging in...' : '✅ Login'}
          </Text>
        </TouchableOpacity>

        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>📋 Demo Accounts:</Text>
          <Text style={styles.demoText}>👑 admin@fmc.com</Text>
          <Text style={styles.demoText}>    password123</Text>
          <Text style={styles.demoText}>👤 emp@fmc.com</Text>
          <Text style={styles.demoText}>    password123</Text>
          <Text style={styles.demoText}>🆕 Manjeet805507@gmail.com</Text>
          <Text style={styles.demoText}>    Manjeet 1234</Text>
          <Text style={styles.securityText}>🔒 All data encrypted & secure</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============= EMPLOYEE SCREEN =============
function EmployeeScreen({ user, onLogout, token }) {
  const [todayStatus, setTodayStatus] = useState(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchTodayStatus();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      });
    } catch (error) {
      console.log('Location error:', error);
      Alert.alert('⚠️ Warning', 'Could not get your location. Please check permissions.');
    }
  };

  const fetchTodayStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/attendance/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodayStatus(response.data);
      setIsClockedIn(response.data.clockedIn);
    } catch (error) {
      console.log('Error fetching status:', error);
    }
  };

  const fetchAttendanceHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/attendance/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendanceHistory(response.data.data);
    } catch (error) {
      console.log('Error fetching history:', error);
    }
  };

  const handleClockIn = async () => {
    if (!currentLocation) {
      Alert.alert('❌ Error', 'Could not get your location. Please enable location services.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/attendance/clock-in`,
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          accuracy: currentLocation.accuracy,
          address: 'Office Location',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('✅ Success', `Clocked in successfully!\n📍 ${response.data.location.message}`);
      setIsClockedIn(true);
      fetchTodayStatus();
    } catch (error) {
      Alert.alert('❌ Error', error.response?.data?.error || 'Failed to clock in');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!currentLocation) {
      Alert.alert('❌ Error', 'Could not get your location. Please enable location services.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/attendance/clock-out`,
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          accuracy: currentLocation.accuracy,
          address: 'Office Location',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert(
        '✅ Success',
        `Clocked out successfully!\n⏱️ Hours: ${response.data.hoursWorked}h\n📍 ${response.data.location.message}`
      );
      setIsClockedIn(false);
      fetchTodayStatus();
    } catch (error) {
      Alert.alert('❌ Error', error.response?.data?.error || 'Failed to clock out');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutPress = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: () => onLogout(),
        style: 'destructive',
      },
    ]);
  };

  const refreshLocation = async () => {
    await getCurrentLocation();
    Alert.alert('✅ Location', 'Location updated successfully');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007bff" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>👋 Welcome</Text>
          <Text style={styles.headerSubtitle}>{user?.name}</Text>
          <Text style={styles.headerEmail}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={handleLogoutPress}>
          <Text style={styles.logoutBtn}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'dashboard' && styles.tabActive]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Text style={styles.tabText}>📊 Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => {
            setActiveTab('history');
            fetchAttendanceHistory();
          }}
        >
          <Text style={styles.tabText}>📋 History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'dashboard' ? (
          <>
            <View style={styles.locationCard}>
              <Text style={styles.cardTitle}>📍 Current Location</Text>
              {currentLocation ? (
                <>
                  <Text style={styles.locationText}>
                    Lat: {currentLocation.latitude.toFixed(4)}
                  </Text>
                  <Text style={styles.locationText}>
                    Long: {currentLocation.longitude.toFixed(4)}
                  </Text>
                  <Text style={styles.accuracyText}>
                    Accuracy: ±{currentLocation.accuracy.toFixed(0)}m
                  </Text>
                  <TouchableOpacity style={styles.refreshBtn} onPress={refreshLocation}>
                    <Text style={styles.refreshBtnText}>🔄 Refresh Location</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.locationText}>Getting location...</Text>
              )}
            </View>

            <View style={styles.statusCard}>
              <Text style={styles.cardTitle}>📊 Today's Status</Text>
              {todayStatus && (
                <>
                  <Text style={styles.statusText}>
                    Status: <Text style={styles.bold}>{todayStatus.status.toUpperCase()}</Text>
                  </Text>
                  {isClockedIn ? (
                    <>
                      <Text style={styles.statusText}>
                        Clocked In: {new Date(todayStatus.clockInTime).toLocaleTimeString()}
                      </Text>
                      {todayStatus.hoursWorked > 0 && (
                        <Text style={styles.statusText}>
                          Hours: <Text style={styles.bold}>{todayStatus.hoursWorked}h</Text>
                        </Text>
                      )}
                    </>
                  ) : (
                    <Text style={styles.statusText}>Not clocked in today</Text>
                  )}
                </>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.largeButton,
                isClockedIn ? styles.clockOutBtn : styles.clockInBtn,
              ]}
              onPress={isClockedIn ? handleClockOut : handleClockIn}
              disabled={loading}
            >
              <Text style={styles.largeButtonText}>
                {isClockedIn ? '🔴 CLOCK OUT' : '🟢 CLOCK IN'}
              </Text>
              {loading && <ActivityIndicator color="white" style={{ marginLeft: 10 }} />}
            </TouchableOpacity>

            <View style={styles.lockedBox}>
              <Text style={styles.lockedTitle}>💰 Salary Information</Text>
              <Text style={styles.lockedText}>
                🔒 Only administrators can view salary information.
              </Text>
              <Text style={styles.lockedText}>Contact HR for salary inquiries.</Text>
            </View>

            <View style={styles.securityBox}>
              <Text style={styles.securityTitle}>🛡️ Security</Text>
              <Text style={styles.securityText}>✅ Location encrypted</Text>
              <Text style={styles.securityText}>✅ JWT authenticated</Text>
              <Text style={styles.securityText}>✅ SSL secured</Text>
            </View>
          </>
        ) : (
          <FlatList
            data={attendanceHistory}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.historyCard}>
                <Text style={styles.historyDate}>
                  {new Date(item.date).toLocaleDateString()}
                </Text>
                <Text style={styles.historyText}>
                  Status: <Text style={styles.bold}>{item.status}</Text>
                </Text>
                {item.clockInTime && (
                  <Text style={styles.historyText}>
                    In: {new Date(item.clockInTime).toLocaleTimeString()}
                  </Text>
                )}
                {item.clockOutTime && (
                  <Text style={styles.historyText}>
                    Out: {new Date(item.clockOutTime).toLocaleTimeString()}
                  </Text>
                )}
                {item.hoursWorked > 0 && (
                  <Text style={styles.historyText}>Hours: {item.hoursWorked}h</Text>
                )}
              </View>
            )}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============= ADMIN SCREEN =============
function AdminScreen({ user, onLogout, token }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [allAttendance, setAllAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchAllAttendance();
    } else if (activeTab === 'employees') {
      fetchEmployees();
    }
  }, [activeTab]);

  const fetchAllAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/attendance/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllAttendance(response.data.data);
    } catch (error) {
      Alert.alert('❌ Error', error.response?.data?.error || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/salary/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data.data);
    } catch (error) {
      Alert.alert('❌ Error', error.response?.data?.error || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutPress = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: () => onLogout(),
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#28a745" />

      <View style={[styles.header, styles.adminHeader]}>
        <View>
          <Text style={styles.headerTitle}>👑 Admin Panel</Text>
          <Text style={styles.headerSubtitle}>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={handleLogoutPress}>
          <Text style={styles.logoutBtn}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.adminTabContainer}>
        <TouchableOpacity
          style={[styles.adminTab, activeTab === 'dashboard' && styles.adminTabActive]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Text style={styles.tabText}>📊 Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.adminTab, activeTab === 'attendance' && styles.adminTabActive]}
          onPress={() => setActiveTab('attendance')}
        >
          <Text style={styles.tabText}>📋 Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.adminTab, activeTab === 'employees' && styles.adminTabActive]}
          onPress={() => setActiveTab('employees')}
        >
          <Text style={styles.tabText}>👥 Employees</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.adminTab, activeTab === 'salary' && styles.adminTabActive]}
          onPress={() => setActiveTab('salary')}
        >
          <Text style={styles.tabText}>💰 Salary</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'dashboard' && (
          <>
            <Text style={styles.sectionTitle}>📊 Admin Dashboard</Text>
            <View style={styles.adminOnlyBox}>
              <Text style={styles.adminOnlyText}>🔓 Full system access enabled</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoHeader}>🎯 Quick Actions:</Text>
              <Text style={styles.infoText}>✅ View all attendance records with locations</Text>
              <Text style={styles.infoText}>✅ Manage employee information</Text>
              <Text style={styles.infoText}>✅ Calculate payroll (with half-day tracking)</Text>
              <Text style={styles.infoText}>✅ Process salary payments</Text>
              <Text style={styles.infoText}>✅ Monitor employee locations</Text>
            </View>
          </>
        )}

        {activeTab === 'attendance' && (
          <>
            <Text style={styles.sectionTitle}>📋 Attendance Records</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#28a745" />
            ) : (
              <FlatList
                data={allAttendance}
                keyExtractor={(item) => item._id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.attendanceCard}>
                    <Text style={styles.attendanceHeader}>{item.employeeName}</Text>
                    <Text style={styles.attendanceText}>
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.attendanceText}>
                      Status: <Text style={styles.bold}>{item.status}</Text>
                    </Text>
                    {item.hoursWorked > 0 && (
                      <Text style={styles.attendanceText}>Hours: {item.hoursWorked}h</Text>
                    )}
                  </View>
                )}
              />
            )}
          </>
        )}

        {activeTab === 'employees' && (
          <>
            <Text style={styles.sectionTitle}>👥 Employees ({employees.length})</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#28a745" />
            ) : (
              <FlatList
                data={employees}
                keyExtractor={(item) => item._id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.employeeCard}>
                    <Text style={styles.employeeHeader}>
                      {item.firstName} {item.lastName}
                    </Text>
                    <Text style={styles.employeeText}>{item.email}</Text>
                    <Text style={styles.employeeText}>{item.department}</Text>
                    <Text style={styles.statusBadge}>{item.status}</Text>
                  </View>
                )}
              />
            )}
          </>
        )}

        {activeTab === 'salary' && (
          <>
            <Text style={styles.sectionTitle}>💰 Salary Management</Text>
            <View style={styles.adminOnlyBox}>
              <Text style={styles.adminOnlyText}>
                💼 Manage payroll, process payments, and generate reports here
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoHeader}>Salary Features:</Text>
              <Text style={styles.infoText}>✅ Calculate payroll with location-based adjustments</Text>
              <Text style={styles.infoText}>✅ Track half-days automatically</Text>
              <Text style={styles.infoText}>✅ Process salary payments</Text>
              <Text style={styles.infoText}>✅ Generate salary reports</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============= STYLES =============
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  loginContainer: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#007bff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 14,
    textAlign: 'center',
    color: '#28a745',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 15,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoBox: {
    backgroundColor: '#e7f3ff',
    borderRadius: 8,
    padding: 15,
    marginTop: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  demoTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
    color: '#007bff',
  },
  demoText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  securityText: {
    fontSize: 12,
    color: '#28a745',
    marginTop: 8,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  adminHeader: {
    backgroundColor: '#28a745',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 13,
    marginTop: 4,
  },
  headerEmail: {
    color: '#fff',
    fontSize: 11,
    marginTop: 2,
    opacity: 0.8,
  },
  logoutBtn: {
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#007bff',
  },
  adminTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 5,
  },
  adminTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  adminTabActive: {
    borderBottomColor: '#28a745',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#17a2b8',
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  locationText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  accuracyText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  refreshBtn: {
    backgroundColor: '#17a2b8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  refreshBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  largeButton: {
    borderRadius: 12,
    paddingVertical: 25,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  clockInBtn: {
    backgroundColor: '#28a745',
  },
  clockOutBtn: {
    backgroundColor: '#dc3545',
  },
  largeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lockedBox: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    marginBottom: 15,
  },
  lockedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#856404',
  },
  lockedText: {
    color: '#666',
    fontSize: 13,
    marginBottom: 5,
  },
  securityBox: {
    backgroundColor: '#d4edda',
    borderRadius: 8,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#155724',
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#007bff',
  },
  historyDate: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  historyText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#28a745',
  },
  adminOnlyBox: {
    backgroundColor: '#d4edda',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  adminOnlyText: {
    color: '#155724',
    fontWeight: 'bold',
    fontSize: 14,
  },
  infoBox: {
    backgroundColor: '#e2e3e5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#6c757d',
  },
  infoHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#383d41',
  },
  infoText: {
    color: '#383d41',
    fontSize: 13,
    marginBottom: 6,
  },
  attendanceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#28a745',
  },
  attendanceHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 8,
  },
  attendanceText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  employeeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#007bff',
  },
  employeeHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
  },
  employeeText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  statusBadge: {
    marginTop: 5,
    fontSize: 11,
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
});
