import { router, usePathname, type Href } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { AccessibilityInfo, ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useConnection } from './connection';
import { releaseNavigationFocus, focusScreenHeading } from '@/lib/navigation-focus';

type Feedback = { start:(action:()=>void)=>void; finish:()=>void };
const Context=createContext<Feedback|null>(null);

export function LoadingNotice({label='Carregando…'}:{label?:string}){
  const {local}=useConnection();
  const [reduceMotion,setReduceMotion]=useState(false);
  useEffect(()=>{
    let active=true;
    void AccessibilityInfo.isReduceMotionEnabled().then(value=>{if(active)setReduceMotion(value);}).catch(()=>{});
    const listener=AccessibilityInfo.addEventListener('reduceMotionChanged',setReduceMotion);
    return ()=>{active=false;listener.remove();};
  },[]);
  return <View testID="navigation-loading" accessibilityRole="progressbar" accessibilityLabel={label} accessibilityState={{busy:true}} accessibilityLiveRegion="polite" style={styles.notice}>
    {!reduceMotion&&<ActivityIndicator size="large" color={local.preferences.highContrast?'#002B17':'#167341'} accessible={false}/>}
    <Text style={{fontSize:22*local.preferences.fontScale,fontWeight:'600',color:local.preferences.highContrast?'#000':'#002B17',textAlign:'center'}}>{label}</Text>
  </View>;
}

export function NavigationFeedbackProvider({children}:PropsWithChildren){
  const [pending,setPending]=useState(false);
  const busy=useRef(false),generation=useRef(0),frames=useRef<number[]>([]);
  const watchdog=useRef<ReturnType<typeof setTimeout>|null>(null);
  const cleanup=useCallback(()=>{
    frames.current.forEach(cancelAnimationFrame);frames.current=[];
    if(watchdog.current)clearTimeout(watchdog.current);
    watchdog.current=null;
  },[]);
  const clear=useCallback(()=>{cleanup();busy.current=false;setPending(false);},[cleanup]);
  const finish=useCallback(()=>{
    if(!busy.current)return;
    const current=generation.current;
    frames.current.push(requestAnimationFrame(()=>{if(current===generation.current){clear();frames.current.push(requestAnimationFrame(focusScreenHeading));}}));
  },[clear]);
  const start=useCallback((action:()=>void)=>{
    if(busy.current)return;
    releaseNavigationFocus();cleanup();busy.current=true;generation.current++;setPending(true);
    // Give the indicator a frame to paint before mounting the next screen.
    // No fixed minimum display time: focus of the destination dismisses it.
    frames.current.push(requestAnimationFrame(()=>{
      frames.current.push(requestAnimationFrame(()=>{
        try{action();}catch{clear();}
      }));
    }));
    // Cancelled/failed navigation must never leave the app blocked.
    watchdog.current=setTimeout(clear,8000);
  },[cleanup,clear]);
  useEffect(()=>cleanup,[cleanup]);
  return <Context.Provider value={{start,finish}}><View style={{flex:1}}>
    <View style={{flex:1}} accessibilityElementsHidden={pending} importantForAccessibility={pending?'no-hide-descendants':'auto'}>{children}</View>
    {pending&&<View style={styles.overlay} accessibilityViewIsModal><LoadingNotice/></View>}
  </View></Context.Provider>;
}

export function useNavigationFeedback(){
  const context=useContext(Context);
  if(!context)throw new Error('NavigationFeedbackProvider ausente.');
  return context;
}
export function useAppNavigation(){
  const {start}=useNavigationFeedback(),pathname=usePathname();
  return {navigate:(href:Href)=>{
    const destination=typeof href==='string'?href:href.pathname;
    if(destination===pathname){router.navigate(href);return;}
    start(()=>router.navigate(href));
  }};
}
const styles=StyleSheet.create({
  overlay:{position:'absolute',top:0,right:0,bottom:0,left:0,zIndex:1000,backgroundColor:'rgba(244,247,244,0.94)',alignItems:'center',justifyContent:'center',padding:24},
  notice:{alignItems:'center',justifyContent:'center',gap:16,padding:24},
});
