import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { COLORS, SHADOW } from '../theme';
type Size='compact'|'standard'|'large'|'hero'; type Shape='circle'|'squircle';
const metrics={compact:{box:52,art:46,radius:16},standard:{box:74,art:66,radius:22},large:{box:94,art:84,radius:28},hero:{box:128,art:116,radius:38}};
export function Kareebu3DIcon({source,size='standard',shape='squircle',selected=false}:{source:ImageSourcePropType;size?:Size;shape?:Shape;selected?:boolean}){const m=metrics[size];return <View style={[styles.box,{width:m.box,height:m.box,borderRadius:shape==='circle'?m.box/2:m.radius},selected&&styles.selected]}><Image source={source} resizeMode="contain" style={{width:m.art,height:m.art}}/></View>}
const styles=StyleSheet.create({box:{backgroundColor:COLORS.yellowWash,alignItems:'center',justifyContent:'center',...SHADOW},selected:{backgroundColor:COLORS.yellow}});
