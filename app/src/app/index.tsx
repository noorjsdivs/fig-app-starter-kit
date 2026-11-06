import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Fig & Fennel</Text>
      <Text style={styles.sub}>Fresh food, made easy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F8F6', gap: 8 },
  title: { fontSize: 34, fontWeight: '700', color: '#1A1A1A' },
  sub: { fontSize: 15, color: '#55575B' },
});
