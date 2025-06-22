import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 50,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
  illustrationContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  illustration: {
    width: 250,
    height: 250,
  },
  loginSection: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    color: "white",
    fontWeight: "900"
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: COLORS.surface,
    fontWeight: 'bold',
    fontSize: 16,
  },
  helperText: {
    color: COLORS.gray,
    fontSize: 14,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
