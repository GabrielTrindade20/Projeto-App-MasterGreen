import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useConnection } from '@/context/connection';
import { type PropsWithChildren, type Ref, type RefObject, useState } from 'react';
import { Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text as NativeText, type TextProps, TextInput, type TextInputProps, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Text({style,...props}:TextProps) {
  const {local}=useConnection();
  const flat=StyleSheet.flatten(style)||{};
  return <NativeText {...props} style={[style,{fontSize:(flat.fontSize||20)*local.preferences.fontScale,...(flat.lineHeight?{lineHeight:flat.lineHeight*local.preferences.fontScale}:{})},local.preferences.highContrast&&flat.color!=='#fff'&&{color:'#000'}]} />;
}

export const green = '#002B17';
export const actionGreen = '#167341';
export const colors = { background:'#F4F7F4', surface:'#FFFFFF', ink:'#162B20', muted:'#53645A', line:'#D9E3DB', tint:'#E8F2E9', danger:'#A52D20' };

export function Action({ title, onPress, disabled = false, danger = false, secondary=false }: { title: string; onPress: () => void; disabled?: boolean; danger?: boolean; secondary?:boolean }) {
  const {local}=useConnection();
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [ui.button, secondary&&ui.secondaryButton, local.preferences.highContrast&&!secondary&&{backgroundColor:green}, danger && { backgroundColor: '#FFF1EE',borderColor:colors.danger }, { opacity: disabled ? 0.5 : pressed ? 0.75 : 1 }]}>
    <Text style={[ui.buttonText,secondary&&{color:green},danger&&{color:colors.danger}]}>{title}</Text>
  </Pressable>;
}

export function Card({ children, title }: PropsWithChildren<{ title?: string }>) {
  return <View style={ui.card}>{title && <Text accessibilityRole="header" style={ui.heading}>{title}</Text>}{children}</View>;
}

export function Field({ label, inputRef, ...props }: TextInputProps & { label: string; inputRef?:Ref<TextInput> }) {
  const {local}=useConnection();
  return <View style={ui.field}><Text style={ui.label}>{label}</Text><TextInput ref={inputRef} accessibilityLabel={label}
    placeholderTextColor="#67746A" {...props} style={[ui.input, props.multiline && { minHeight: 88, textAlignVertical: 'top' }, props.style,{fontSize:22*local.preferences.fontScale},local.preferences.highContrast&&{color:'#000',borderColor:'#000'}]} /></View>;
}

export function Screen({ title, children, onReset, back=false, settings=true, scroll=true, footer, subtitle, scrollRef }: PropsWithChildren<{ title: string; onReset?:()=>void; back?:boolean; settings?:boolean; scroll?:boolean; footer?:React.ReactNode; subtitle?:string;scrollRef?:RefObject<ScrollView|null> }>) {
  const [revision, setRevision] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);
  return <View style={ui.screen}>
    <View style={ui.header}>
      {(onReset||back)&&<Pressable accessibilityRole="button" accessibilityLabel={back?'Voltar ao orçamento':`Limpar ${title.toLowerCase()}`} onPress={() => back?router.navigate('/'):setConfirmReset(true)} style={ui.reset}>
        <Ionicons name={back?'arrow-back':'refresh-outline'} size={30} color="#fff" />
      </Pressable>}
      <View style={{flex:1}}><Text style={ui.eyebrow}>MASTERGREEN</Text><Text accessibilityRole="header" style={ui.title}>{title}</Text></View>
      {settings?<Pressable accessibilityRole="button" accessibilityLabel="Configurações" style={ui.reset} onPress={()=>router.navigate('/configuracoes')}><Ionicons name="settings-outline" size={28} color="#fff" /></Pressable>:<Image accessibilityLabel="MasterGreen" source={require('../../assets/mastergreen/logo.png')} style={ui.logo} resizeMode="contain" />}
    </View>
    {!!subtitle&&<Text style={[ui.muted,{paddingHorizontal:20,paddingBottom:12}]}>{subtitle}</Text>}
    {confirmReset && <View style={ui.confirm}>
      <Text style={ui.label}>Limpar os campos desta tela?</Text>
      <Action title="Sim, limpar" danger onPress={() => { onReset?.();setRevision((value) => value + 1); setConfirmReset(false); }} />
      <Action title="Continuar preenchendo" onPress={() => setConfirmReset(false)} />
    </View>}
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {scroll?<ScrollView ref={scrollRef} key={revision} keyboardShouldPersistTaps="handled" contentContainerStyle={ui.content}>{children}</ScrollView>:<View style={{flex:1,width:'100%',maxWidth:760,alignSelf:'center'}}>{children}</View>}
      {!!footer&&<View style={ui.footer}>{footer}</View>}
    </KeyboardAvoidingView>
  </View>;
}

export function Choice({title,selected,onPress}:{title:string;selected:boolean;onPress:()=>void}){
  return <Pressable accessibilityRole="button" accessibilityState={{selected}} onPress={onPress} style={[ui.chip,selected&&{backgroundColor:green,borderColor:green}]}><Text style={[ui.chipText,selected&&{color:'#fff'}]}>{title}</Text></Pressable>;
}

export function Section({title,summary,children,initiallyOpen=false,open:controlled,onToggle,onLayout}:PropsWithChildren<{title:string;summary?:string;initiallyOpen?:boolean;open?:boolean;onToggle?:()=>void;onLayout?:ViewProps['onLayout']}>){
  const [expanded,setExpanded]=useState(initiallyOpen);const open=controlled??expanded;
  return <View onLayout={onLayout} style={ui.card}><Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{expanded:open}} onPress={()=>onToggle?onToggle():setExpanded(value=>!value)} style={ui.sectionHeader}>
    <View style={{flex:1,gap:4}}><Text style={ui.heading}>{title}</Text>{!open&&!!summary&&<Text style={ui.muted}>{summary}</Text>}</View><Ionicons name={open?'chevron-up':'chevron-down'} size={24} color={green}/>
  </Pressable>{open&&children}</View>;
}

export function Sheet({title,visible,onClose,children}:PropsWithChildren<{title:string;visible:boolean;onClose:()=>void}>){
  return <Modal visible={visible} animationType="fade" onRequestClose={onClose} transparent><View style={ui.overlay}><SafeAreaView style={ui.sheet} edges={['top','bottom']}>
    <View style={ui.sheetHeader}><Text accessibilityRole="header" style={[ui.heading,{flex:1}]}>{title}</Text><Pressable accessibilityRole="button" accessibilityLabel="Fechar" onPress={onClose} style={ui.close}><Ionicons name="close" size={26} color={green}/></Pressable></View>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{padding:20,gap:16}}>{children}</ScrollView>
  </SafeAreaView></View></Modal>;
}

export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32, gap: 16, width: '100%', maxWidth: 680, alignSelf: 'center' },
  header: { backgroundColor: colors.background, flexDirection: 'row', alignItems: 'center', padding: 20, gap: 12, minHeight: 96 },
  title: { fontSize: 28, fontWeight: 'bold', color: green },
  eyebrow: { fontSize:13,fontWeight:'700',letterSpacing:2,color:actionGreen,marginBottom:5 },
  logo: { width: 64, height: 56 },
  reset: { backgroundColor: green, minHeight: 48, minWidth: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 18, borderWidth:1,borderColor:colors.line,padding: 20, gap: 16 },
  field: { gap: 8, width: '100%' },
  heading: { fontSize: 23, fontWeight: '700', color: colors.ink },
  label: { fontSize: 20, fontWeight: '600', color: colors.ink },
  muted:{fontSize:18,color:colors.muted,lineHeight:26},
  input: { minHeight: 58, borderWidth: 1.5, borderColor: '#819B89', borderRadius: 12, textAlign: 'left', fontSize: 22, fontWeight: '500', color: colors.ink, padding: 14, backgroundColor: '#FAFCFA' },
  button: { backgroundColor: actionGreen, borderColor:actionGreen,borderWidth:1.5,borderRadius: 14, minHeight: 56, padding: 14, alignItems: 'center', justifyContent: 'center' },
  secondaryButton:{backgroundColor:colors.surface,borderColor:'#809988'},
  buttonText: { color: '#fff', fontSize: 20, fontWeight: '700', textAlign: 'center' },
  value: { fontSize: 32, fontWeight: '700', color: green },
  result: { gap: 6, paddingVertical: 10 },
  message: { color: '#A41303', fontSize: 20, textAlign: 'center' },
  confirm: { backgroundColor: '#fff', padding: 16, gap: 10 },
  footer:{borderTopWidth:1,borderColor:colors.line,backgroundColor:colors.surface,padding:16,gap:10,width:'100%',maxWidth:760,alignSelf:'center'},
  chip:{paddingHorizontal:14,paddingVertical:12,minHeight:48,borderRadius:24,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface,justifyContent:'center'},
  chipText:{fontSize:18,fontWeight:'600',color:green},
  wrap:{flexDirection:'row',flexWrap:'wrap',gap:8},
  row:{flexDirection:'row',alignItems:'center',gap:12},
  listRow:{backgroundColor:colors.surface,padding:18,borderBottomWidth:1,borderColor:colors.line,gap:8},
  divider:{height:1,backgroundColor:colors.line},
  sectionHeader:{flexDirection:'row',alignItems:'center',gap:12,minHeight:48},
  overlay:{flex:1,backgroundColor:'rgba(0,24,12,0.45)',justifyContent:'flex-end'},
  sheet:{maxHeight:'94%',backgroundColor:colors.background,borderTopLeftRadius:24,borderTopRightRadius:24,width:'100%',maxWidth:760,alignSelf:'center'},
  sheetHeader:{flexDirection:'row',alignItems:'center',gap:12,padding:20,borderBottomWidth:1,borderColor:colors.line},
  close:{minHeight:48,minWidth:48,alignItems:'center',justifyContent:'center',borderRadius:24,backgroundColor:colors.tint},
  hero:{backgroundColor:green,borderRadius:22,padding:24,gap:12},
  heroLabel:{fontSize:20,color:'#fff',fontWeight:'500'},
  heroValue:{fontSize:36,color:'#fff',fontWeight:'700'},
});
