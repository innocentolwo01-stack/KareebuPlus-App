import React from 'react';
import { ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton, TextButton } from '../components';
import { Kareebu3DIcon } from './Kareebu3DIcon';
import { COLORS, TYPE } from '../theme';

export function BrandedEmptyState({art,title,body,actionLabel,onAction}:{art:ImageSourcePropType;title:string;body:string;actionLabel:string;onAction:()=>void}){return <View style={styles.root}><Kareebu3DIcon source={art} size="hero"/><Text style={styles.title}>{title}</Text><Text style={styles.body}>{body}</Text><View style={styles.action}><PrimaryButton label={actionLabel} onPress={onAction}/></View></View>}
export function BrandedSuccessState({art,title,body,primaryLabel,onPrimary,secondaryLabel,onSecondary}:{art:ImageSourcePropType;title:string;body:string;primaryLabel:string;onPrimary:()=>void;secondaryLabel?:string;onSecondary?:()=>void}){return <View style={styles.root}><View style={styles.successHalo}><Kareebu3DIcon source={art} size="hero" selected/></View><Text style={styles.title}>{title}</Text><Text style={styles.body}>{body}</Text><View style={styles.action}><PrimaryButton label={primaryLabel} onPress={onPrimary}/></View>{secondaryLabel&&onSecondary?<TextButton label={secondaryLabel} onPress={onSecondary} color={COLORS.black}/>:null}</View>}
const styles=StyleSheet.create({root:{alignItems:'center',justifyContent:'center',paddingHorizontal:24,paddingVertical:34},successHalo:{padding:10,borderRadius:44,backgroundColor:COLORS.yellowWash},title:{...TYPE.screenTitle,color:COLORS.black,textAlign:'center',marginTop:16},body:{...TYPE.body,color:COLORS.muted,textAlign:'center',lineHeight:21,maxWidth:330,marginTop:7},action:{width:'100%',maxWidth:360,marginTop:20}});
