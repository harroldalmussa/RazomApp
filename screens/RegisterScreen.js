// screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  useColorScheme,
  Platform,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const titleColor = colorScheme === 'dark' ? '#f7fafc' : '#1f2937';
  const labelColor = colorScheme === 'dark' ? '#e2e8f0' : '#374151';
  const inputBackgroundColor = colorScheme === 'dark' ? 'rgba(74, 85, 104, 0.7)' : 'rgba(255, 255, 255, 0.7)';
  const inputBorderColor = colorScheme === 'dark' ? '#4a5568' : '#d1d5db';
  const inputTextColor = colorScheme === 'dark' ? '#e2e8f0' : '#374151';
  const errorTextColor = colorScheme === 'dark' ? '#fca5a5' : '#ef4444';
  const loginTextColor = colorScheme === 'dark' ? '#cbd5e0' : '#4b5563';
  const loginLinkColor = colorScheme === 'dark' ? '#93c5fd' : '#3b82f6';

  const handleRegister = async () => {
    let isValid = true;
    setEmailError('');
    setFirstNameError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    }

    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    }

    if (!confirmPassword.trim()) {
        setConfirmPasswordError('Confirm Password is required');
        isValid = false;
    } else if (password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
        isValid = false;
    }

    if (isValid) {
      console.log('Attempting registration with:', email, firstName, password);

      try {
        const YOUR_LOCAL_IP_ADDRESS = '192.168.1.174';

        const response = await fetch(`http://${YOUR_LOCAL_IP_ADDRESS}:3000/users/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            first_name: firstName,
            password: password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Registration successful:', data);
          Alert.alert('Success', 'Registration successful! Please log in.');

          // OPTIONAL: If your registration endpoint returns user data and/or access_token,
          // you might store it here, similar to login.
          // For now, we assume registration just creates the user, and they need to log in separately.
          // If you uncomment these, remember to remove the navigation.replace('Auth') below
          // and let AppNavigator handle the transition as done in AuthScreen.
          // if (data.access_token) {
          //   await AsyncStorage.setItem('access_token', data.access_token);
          // }
          // if (data.user) {
          //   await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
          // }

          // For now, we still navigate to Auth screen after successful registration
          // because it's a separate step for the user to log in.
          // If the backend auto-logs in, then remove this and use AsyncStorage methods.
          navigation.replace('Auth');
          console.log("Registration: Successfully registered. Navigating to Auth screen for login.");
        } else {
          console.error('Registration error:', data);
          Alert.alert('Registration Failed', data.error || data.detail || 'An unexpected error occurred.');
        }
      } catch (error) {
        console.error('Network or API Error:', error);
        Alert.alert('Error', `Network or API Error: ${error.message || 'Unknown error'}. Ensure backend is running and IP is correct.`);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colorScheme === 'dark' ? '#1a202c' : 'transparent' }]}>
      <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#2d3748' : 'rgba(255, 255, 255, 0.9)' }]}>
        <Text style={[styles.title, { color: titleColor }]}>Register</Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: labelColor }]}>Email:</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: inputTextColor },
            ]}
            placeholder="Email"
            placeholderTextColor={colorScheme === 'dark' ? '#a0aec0' : '#6b7280'}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="none"
            value={email}
            onChangeText={setEmail}
          />
          {emailError ? <Text style={[styles.errorText, { color: errorTextColor }]}>{emailError}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: labelColor }]}>First Name:</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: inputTextColor },
            ]}
            placeholder="First Name"
            placeholderTextColor={colorScheme === 'dark' ? '#a0aec0' : '#6b7280'}
            autoCapitalize="words"
            autoCorrect={false}
            value={firstName}
            onChangeText={setFirstName}
          />
          {firstNameError ? <Text style={[styles.errorText, { color: errorTextColor }]}>{firstNameError}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: labelColor }]}>Password:</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: inputTextColor },
            ]}
            placeholder="Password"
            placeholderTextColor={colorScheme === 'dark' ? '#a0aec0' : '#6b7280'}
            secureTextEntry
            autoCorrect={false}
            textContentType="newPassword"
            value={password}
            onChangeText={setPassword}
          />
          {passwordError ? <Text style={[styles.errorText, { color: errorTextColor }]}>{passwordError}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: labelColor }]}>Confirm Password:</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: inputTextColor },
            ]}
            placeholder="Confirm Password"
            placeholderTextColor={colorScheme === 'dark' ? '#a0aec0' : '#6b7280'}
            secureTextEntry
            autoCorrect={false}
            textContentType="newPassword"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {confirmPasswordError ? <Text style={[styles.errorText, { color: errorTextColor }]}>{confirmPasswordError}</Text> : null}
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <Text style={[styles.loginText, { color: loginTextColor }]}>
          Already have an account?{' '}
          <Text style={[styles.loginLink, { color: loginLinkColor }]} onPress={() => navigation.navigate('Auth')}>
            Login
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderRadius: 4,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  errorText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  registerButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginText: {
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
  },
  loginLink: {
    fontWeight: 'bold',
  },
});