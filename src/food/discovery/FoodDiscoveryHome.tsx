import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPE } from '../../theme';

import { useKareebuFoodHomeController } from './controller';
import { renderKareebuFoodWidget } from './renderer';
import {
  FoodFiltersSurface,
  FoodListingSurface,
  FoodSearchSurface,
} from './surfaces';
import type {
  FoodHomeActions,
  FoodHomeRestaurant,
} from './types';

type Props = {
  city: string;
  country: string;
  loading?: boolean;
  restaurants: FoodHomeRestaurant[];
  favouriteIds: string[];
  initialSurface?: 'home' | 'search';
  actions: FoodHomeActions;
};

export function KareebuFoodDiscoveryHome({
  city,
  country,
  loading = false,
  restaurants,
  favouriteIds,
  initialSurface = 'home',
  actions,
}: Props) {
  const [membershipVisible, setMembershipVisible] = useState(true);
  const controller = useKareebuFoodHomeController({
    city,
    country,
    restaurants,
    favouriteIds,
    initialSurface,
    actions,
  });

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.black} />
      </View>
    );
  }

  if (controller.surface.kind === 'search') {
    return <FoodSearchSurface controller={controller} />;
  }

  if (controller.surface.kind === 'listing') {
    return <FoodListingSurface controller={controller} />;
  }

  if (controller.surface.kind === 'filters') {
    return <FoodFiltersSurface controller={controller} />;
  }

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {controller.document.widgets.map((widget) => (
          <React.Fragment key={widget.id}>
            {renderKareebuFoodWidget(widget, controller)}
          </React.Fragment>
        ))}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {membershipVisible ? (
        <View style={styles.membership}>
          <Pressable
            onPress={controller.actions.openMembership}
            style={({ pressed }) => [
              styles.membershipMain,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.membershipLogo}>
              <Text style={styles.membershipLogoText}>K+</Text>
            </View>
            <View style={styles.divider} />
            <Text numberOfLines={1} style={styles.membershipText}>
              Try free delivery with Kareebu+
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setMembershipVisible(false)}
            hitSlop={10}
            style={styles.membershipClose}
          >
            <Feather name="x" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:'#FFFFFF'},
  scroll:{flex:1,backgroundColor:'#FFFFFF'},
  content:{paddingTop:6},
  loading:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#FFFFFF'},
  bottomSpace:{height:86},
  membership:{position:'absolute',left:15,right:15,bottom:10,height:54,borderRadius:28,backgroundColor:COLORS.black,flexDirection:'row',alignItems:'center',paddingLeft:14,paddingRight:8,zIndex:20},
  membershipMain:{flex:1,height:54,flexDirection:'row',alignItems:'center'},
  membershipClose:{width:38,height:38,borderRadius:19,alignItems:'center',justifyContent:'center'},
  membershipLogo:{width:30,height:30,borderRadius:15,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},
  membershipLogoText:{fontSize:12,fontWeight:'900',color:COLORS.black},
  divider:{width:1,height:28,marginHorizontal:10,backgroundColor:'rgba(255,255,255,0.55)'},
  membershipText:{flex:1,color:COLORS.white,...TYPE.bodyStrong,fontWeight:'900'},
  pressed:{opacity:0.76},
});
