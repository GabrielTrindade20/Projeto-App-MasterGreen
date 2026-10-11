import Ionicons from '@expo/vector-icons/Ionicons';
import { type PropsWithChildren, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

export const green = '#002B17';
export const actionGreen = '#138600';

export function Action({ title, onPress, disabled = false, danger = false }: { title: string; onPress: () => void; disabled?: boolean; danger?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [ui.button, danger && { backgroundColor: '#B81100' }, { opacity: disabled ? 0.5 : pressed ? 0.75 : 1 }]}>
    <Text style={ui.buttonText}>{title}</Text>
  </Pressable>;
}

export function Card({ children, title }: PropsWithChildren<{ title?: string }>) {
  return <View style={ui.card}>{title && <Text accessibilityRole="header" style={ui.heading}>{title}</Text>}{children}</View>;
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return <View style={ui.field}><Text style={ui.label}>{label}</Text><TextInput accessibilityLabel={label}
    placeholderTextColor="#67746A" {...props} style={[ui.input, props.multiline && { minHeight: 88, textAlignVertical: 'top' }, props.style]} /></View>;
}

export function Screen({ title, children }: PropsWithChildren<{ title: string }>) {
  const [revision, setRevision] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);
  return <View style={ui.screen}>
    <View style={ui.header}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Limpar ${title.toLowerCase()}`} onPress={() => setConfirmReset(true)} style={ui.reset}>
        <Ionicons name="refresh-outline" size={30} color="#fff" />
      </Pressable>
      <Text accessibilityRole="header" style={ui.title}>{title}</Text>
      <Image accessibilityLabel="MasterGreen" source={require('../../assets/mastergreen/logo.png')} style={ui.logo} resizeMode="contain" />
    </View>
    {confirmReset && <View style={ui.confirm}>
      <Text style={ui.label}>Limpar os campos desta tela?</Text>
      <Action title="Sim, limpar" danger onPress={() => { setRevision((value) => value + 1); setConfirmReset(false); }} />
      <Action title="Continuar preenchendo" onPress={() => setConfirmReset(false)} />
    </View>}
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView key={revision} keyboardShouldPersistTaps="handled" contentContainerStyle={ui.content}>{children}</ScrollView>
    </KeyboardAvoidingView>
  </View>;
}

export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: green },
  content: { padding: 16, paddingBottom: 32, gap: 16, width: '100%', maxWidth: 680, alignSelf: 'center' },
  header: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12, minHeight: 80 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#101A13', flex: 1, textAlign: 'center' },
  logo: { width: 64, height: 56 },
  reset: { backgroundColor: actionGreen, minHeight: 48, minWidth: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 18, gap: 12 },
  field: { gap: 8, width: '100%' },
  heading: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#101A13', marginBottom: 4 },
  label: { fontSize: 20, fontWeight: 'bold', color: '#182A1D', textAlign: 'center' },
  input: { minHeight: 52, borderWidth: 2, borderColor: '#344F3D', borderRadius: 10, textAlign: 'center', fontSize: 22, fontWeight: '600', color: '#101A13', padding: 10, backgroundColor: '#fff' },
  button: { backgroundColor: actionGreen, borderRadius: 10, minHeight: 52, padding: 14, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  value: { fontSize: 27, fontWeight: 'bold', textAlign: 'center', color: green },
  result: { gap: 6, paddingVertical: 10 },
  message: { color: '#A41303', fontSize: 20, textAlign: 'center' },
  confirm: { backgroundColor: '#fff', padding: 16, gap: 10 },
});
