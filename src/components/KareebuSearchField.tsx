import React from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, CONTROL, RADIUS, SHADOW, TYPE } from '../theme';
import type { SearchContext } from '../search/context';
import { searchProviderFor } from '../search/provider';

type Props = { context: SearchContext; value?: string; onChangeText?: (value: string) => void; onPress?: () => void; autoFocus?: boolean; elevated?: boolean; inputRef?: React.Ref<TextInput> };

export function KareebuSearchField({ context, value, onChangeText, onPress, autoFocus, elevated = true, inputRef }: Props) {
  const provider = searchProviderFor(context);
  const searchHint = provider.localEntityOnly
    ? `Search only within this ${context.scope === 'seller' ? 'shop' : 'menu'}`
    : `Search ${provider.resultTypes.join(', ')} in ${context.scope.replace(/_/g, ' ')}`;
  const frameStyle = [styles.frame, elevated ? styles.elevated : styles.outlined];
  if (onChangeText) return <View accessibilityRole="search" accessibilityLabel={context.placeholder} style={frameStyle}>
    <TextInput ref={inputRef} accessibilityLabel={context.placeholder} accessibilityHint={searchHint} value={value} onChangeText={onChangeText} placeholder={context.placeholder} placeholderTextColor={COLORS.muted} autoFocus={autoFocus} returnKeyType="search" style={styles.input}/>
    {value?<Pressable accessibilityRole="button" accessibilityLabel="Clear search" hitSlop={8} onPress={()=>onChangeText('')} style={styles.iconButton}><Ionicons name="close-circle" size={21} color={COLORS.muted}/></Pressable>:<Feather name="search" size={21} color={COLORS.black}/>}</View>;
  return <Pressable accessibilityRole="search" accessibilityLabel={context.placeholder} accessibilityHint={searchHint} onPress={onPress} style={({pressed})=>[frameStyle,pressed&&styles.pressed]}><Text numberOfLines={1} style={styles.placeholder}>{context.placeholder}</Text><Feather name="search" size={21} color={COLORS.black}/></Pressable>;
}

const styles=StyleSheet.create({frame:{height:CONTROL.pageHeaderSearch,borderRadius:RADIUS.xl,backgroundColor:COLORS.white,paddingHorizontal:15,flexDirection:'row',alignItems:'center',gap:12},elevated:{...SHADOW},outlined:{borderWidth:1,borderColor:COLORS.line},input:{flex:1,...TYPE.body,fontSize:16,lineHeight:20,color:COLORS.black,paddingVertical:0},placeholder:{flex:1,...TYPE.body,fontSize:16,lineHeight:20,color:COLORS.muted},iconButton:{width:36,height:36,alignItems:'center',justifyContent:'center'},pressed:{opacity:.72,transform:[{scale:.99}]}});
