import { StyleSheet, View, StatusBar } from 'react-native';
import Header from './src/components/Header'
import Orcamento from './src/screens/Orcamento';

// No seu componente App
export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#002B17" barStyle="light-content" />
      <Header /> 
      <Orcamento />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
