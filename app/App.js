import { StyleSheet, View, StatusBar } from 'react-native';
import Navigation from './src/navigation/Navigation';
import Header from './src/components/Header'

// No seu componente App
export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#002B17" barStyle="light-content" />
      <Header /> 
      <Navigation />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
