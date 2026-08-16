
import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { COLORS, TYPE } from '../theme';

import { ScreenShell } from '../components';
import type { MobilityActions, MobilityData } from './mobilityScreens';

type RideView =
  | 'home'
  | 'whereTo'
  | 'scheduleIntro'
  | 'schedulePicker'
  | 'schoolIntro'
  | 'schoolSearch'
  | 'schoolDetail'
  | 'schoolHome'
  | 'schoolPackage'
  | 'cityToCity'
  | 'forFriend'
  | 'pickupConfirm';

type School = {
  id: string;
  name: string;
  area: string;
  address: string;
  latitude: number;
  longitude: number;
};

type SavedPlace = {
  id: string;
  label: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type CityTrip = {
  id: string;
  city: string;
  fare: string;
  subtitle: string;
};

const SCHOOLS: School[] = [
  {
    id: 'greenhill',
    name: 'Greenhill Academy',
    area: 'Kibuli',
    address: 'Kibuli Road - Kampala - Uganda',
    latitude: 0.3004,
    longitude: 32.5998,
  },
  {
    id: 'kampala-parents',
    name: 'Kampala Parents School',
    area: 'Naguru',
    address: 'Naguru Drive - Kampala - Uganda',
    latitude: 0.3420,
    longitude: 32.6227,
  },
  {
    id: 'kabojja',
    name: 'Kabojja Junior School',
    area: 'Buziga',
    address: 'Buziga Road - Kampala - Uganda',
    latitude: 0.2844,
    longitude: 32.6168,
  },
  {
    id: 'taibah',
    name: 'Taibah International School',
    area: 'Kawempe',
    address: 'Gayaza Road - Kampala - Uganda',
    latitude: 0.3725,
    longitude: 32.5693,
  },
  {
    id: 'vienna',
    name: 'Vienna College Namugongo',
    area: 'Namugongo',
    address: 'Namugongo Road - Kampala - Uganda',
    latitude: 0.3936,
    longitude: 32.6652,
  },
  {
    id: 'delight',
    name: 'Delhi Public School International',
    area: 'Naguru',
    address: 'Naguru - Kampala - Uganda',
    latitude: 0.3448,
    longitude: 32.6201,
  },
];

const SAVED_PLACES: SavedPlace[] = [
  {
    id: 'home',
    label: 'Add Home',
    subtitle: 'Save your home address',
    icon: 'home-outline',
  },
  {
    id: 'work',
    label: 'Add Work',
    subtitle: 'Save your work address',
    icon: 'briefcase-outline',
  },
  {
    id: 'ntinda',
    label: 'Ntinda Complex',
    subtitle: 'Ntinda - Kampala - Uganda',
    icon: 'location-outline',
  },
];

const CITY_TRIPS: CityTrip[] = [
  {
    id: 'entebbe',
    city: 'Entebbe',
    fare: 'UGX 80,000',
    subtitle: 'Airport city • about 45 min',
  },
  {
    id: 'jinja',
    city: 'Jinja',
    fare: 'UGX 260,000',
    subtitle: 'Adventure city • about 2 hr 30 min',
  },
  {
    id: 'mbarara',
    city: 'Mbarara',
    fare: 'UGX 620,000',
    subtitle: 'Western Uganda • about 4 hr 30 min',
  },
  {
    id: 'gulu',
    city: 'Gulu',
    fare: 'UGX 980,000',
    subtitle: 'Northern Uganda • long-distance ride',
  },
];

function regionForCity(city: string) {
  const key = city.trim().toLowerCase();

  if (key.includes('entebbe')) {
    return {
      latitude: 0.0512,
      longitude: 32.4637,
      latitudeDelta: 0.07,
      longitudeDelta: 0.07,
    };
  }

  if (key.includes('jinja')) {
    return {
      latitude: 0.4478,
      longitude: 33.2026,
      latitudeDelta: 0.07,
      longitudeDelta: 0.07,
    };
  }

  return {
    latitude: 0.3476,
    longitude: 32.5825,
    latitudeDelta: 0.085,
    longitudeDelta: 0.085,
  };
}

function trafficMarkers(region: {
  latitude: number;
  longitude: number;
}) {
  const offsets = [
    [-0.010, -0.018],
    [-0.014, -0.006],
    [-0.012, 0.006],
    [-0.004, -0.020],
    [-0.004, 0.015],
    [0.002, -0.010],
    [0.005, 0.001],
    [0.006, 0.013],
    [0.012, -0.014],
    [0.014, -0.002],
    [0.017, 0.011],
    [0.009, 0.022],
  ];

  return offsets.map(([lat, lng], index) => ({
    id: `car-${index}`,
    latitude: region.latitude + lat,
    longitude: region.longitude + lng,
    rotation: index % 2 === 0 ? 12 : -28,
  }));
}

function BackMenuHeader({
  onBack,
  title,
  light = true,
  onMenu,
}: {
  onBack: () => void;
  title?: string;
  light?: boolean;
  onMenu?: () => void;
}) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={({ pressed }) => [styles.headerSquare, pressed && styles.pressed]}>
        <Feather name="arrow-left" size={24} color="#37393C" />
      </Pressable>

      {title ? <Text style={[styles.headerTitle, !light && styles.headerTitleDark]}>{title}</Text> : <View />}

      <Pressable onPress={onMenu} style={({ pressed }) => [styles.menuSquare, pressed && styles.pressed]}>
        <Feather name="menu" size={23} color={COLORS.yellow} />
      </Pressable>
    </View>
  );
}

function Bullet({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bulletIconWrap}>{icon}</View>
      <View style={styles.bulletCopy}>
        <Text style={styles.bulletTitle}>{title}</Text>
        <Text style={styles.bulletBody}>{body}</Text>
      </View>
    </View>
  );
}

function HomeRideTile({
  label,
  image,
  width,
  onPress,
}: {
  label: string;
  image: any;
  width: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.shortcutCard, { width }, pressed && styles.pressed]}
    >
      <View style={styles.shortcutVisual}>
        <Image source={image} resizeMode="contain" style={styles.shortcutImage} />
      </View>
      <Text numberOfLines={2} style={styles.shortcutLabel}>{label}</Text>
    </Pressable>
  );
}

function CityCard({
  item,
  onPress,
}: {
  item: CityTrip;
  onPress: () => void;
}) {
  const background = item.id === 'entebbe'
    ? '#D8EEF5'
    : item.id === 'jinja'
    ? '#D9E8F8'
    : item.id === 'mbarara'
    ? '#E9E4D8'
    : '#E3EBE1';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.cityCard, { backgroundColor: background }, pressed && styles.pressed]}>
      <View style={styles.cityCardCopy}>
        <Text style={styles.cityTitle}>{item.city}</Text>
        <Text style={styles.cityFare}>Starting from {item.fare}</Text>
        <Text style={styles.citySubtitle}>{item.subtitle}</Text>
      </View>
      <Image
        source={require('../../assets/kareebu-plus/rides-home/city-to-city.png')}
        resizeMode="contain"
        style={styles.cityCardIcon}
      />
    </Pressable>
  );
}

export function KareebuRidesHomeScreen({
  data,
  actions,
}: {
  data: MobilityData;
  actions: MobilityActions;
}) {
  const { width } = useWindowDimensions();
  const region = useMemo(() => regionForCity(data.city ?? 'Kampala'), [data.city]);
  const pickupName =
    data.pickup && data.pickup.trim().length > 0
      ? data.pickup
      : 'Kareebu Pickup Point';
  const pickupSubtitle = `${data.city ?? 'Kampala'}, ${data.country ?? 'Uganda'}`;

  const [view, setView] = useState<RideView>('home');
  const [history, setHistory] = useState<RideView[]>(['home']);
  const [schoolQuery, setSchoolQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<School>(SCHOOLS[0]);
  const [selectedPlace, setSelectedPlace] = useState<SavedPlace>(SAVED_PLACES[2]);
  const [selectedTime, setSelectedTime] = useState('Today · 5:23 PM');

  const rideTiles = [
    {
      label: 'Schedule',
      image: require('../../assets/kareebu-plus/rides-home/schedule.png'),
      next: 'scheduleIntro' as RideView,
    },
    {
      label: 'School Rides',
      image: require('../../assets/kareebu-plus/rides-home/school-rides.png'),
      next: 'schoolIntro' as RideView,
    },
    {
      label: 'City to City',
      image: require('../../assets/kareebu-plus/rides-home/city-to-city.png'),
      next: 'cityToCity' as RideView,
    },
    {
      label: 'For a Friend',
      image: require('../../assets/kareebu-plus/rides-home/for-a-friend.png'),
      next: 'forFriend' as RideView,
    },
  ];

  const tileWidth = useMemo(() => {
    const available = width - 32 - 24;
    return Math.max(78, Math.min(104, Math.floor(available / 4)));
  }, [width]);

  const laterChipLabel = selectedTime === 'Now' ? 'Later' : selectedTime.replace('Today · ', '');

  const filteredSchools = useMemo(() => {
    const q = schoolQuery.trim().toLowerCase();
    if (!q) {
      return SCHOOLS;
    }

    return SCHOOLS.filter(
      (school) =>
        school.name.toLowerCase().includes(q) ||
        school.area.toLowerCase().includes(q) ||
        school.address.toLowerCase().includes(q),
    );
  }, [schoolQuery]);

  const cars = useMemo(() => trafficMarkers(region), [region]);

  const navigate = (next: RideView) => {
    setView(next);
    setHistory((prev) => [...prev, next]);
  };

  const goBack = () => {
    setHistory((prev) => {
      if (prev.length <= 1) {
        actions.go('home');
        return prev;
      }

      const copy = prev.slice(0, -1);
      setView(copy[copy.length - 1]);
      return copy;
    });
  };

  const openSchool = (school: School) => {
    setSelectedSchool(school);
    navigate('schoolDetail');
  };

  const renderMapCars = () =>
    cars.map((item) => (
      <Marker
        key={item.id}
        coordinate={{ latitude: item.latitude, longitude: item.longitude }}
        anchor={{ x: 0.5, y: 0.5 }}
        rotation={item.rotation}
        flat
      >
        <Image
          source={require('../../assets/kareebu-plus/rides-home/map-car.png')}
          resizeMode="contain"
          style={styles.mapCar}
        />
      </Marker>
    ));

  const renderHome = () => (
    <ScrollView style={styles.screen} contentContainerStyle={styles.homePage} showsVerticalScrollIndicator={false}>
      <View style={styles.mapHero}>
        <MapView
          style={styles.absoluteFill}
          initialRegion={region}
          region={region}
          scrollEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          zoomEnabled={false}
          toolbarEnabled={false}
          showsCompass={false}
          showsMyLocationButton={false}
        >
          {renderMapCars()}
          <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
            <View style={styles.userDot} />
          </Marker>
        </MapView>

        <BackMenuHeader onBack={() => actions.go('home')} onMenu={() => actions.go('rideSettings')} />

        <View style={styles.searchPanel}>
          <View style={styles.searchPanelTop}>
            <Pressable onPress={() => actions.go('whereTo')} style={({ pressed }) => [styles.searchBigButton, pressed && styles.pressed]}>
              <View style={styles.searchIconBox}>
                <Feather name="search" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.searchBigText}>Where to?</Text>
            </Pressable>

            <Pressable onPress={() => navigate('scheduleIntro')} style={({ pressed }) => [styles.laterButton, pressed && styles.pressed]}>
              <Ionicons name="calendar-outline" size={20} color="#44484C" />
              <Text style={styles.laterButtonText}>{laterChipLabel}</Text>
            </Pressable>
          </View>

          <Pressable onPress={() => navigate('pickupConfirm')} style={({ pressed }) => [styles.pickupPanel, pressed && styles.pressed]}>
            <Ionicons name="location-outline" size={29} color="#44484C" />
            <View style={styles.pickupPanelCopy}>
              <Text numberOfLines={1} style={styles.pickupPanelTitle}>{pickupName}</Text>
              <Text numberOfLines={1} style={styles.pickupPanelSubtitle}>{pickupSubtitle}</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.pageHeading}>Rides for every need</Text>

        <View style={styles.tileRow}>
          {rideTiles.map((tile) => (
            <HomeRideTile
              key={tile.label}
              label={tile.label}
              image={tile.image}
              width={tileWidth}
              onPress={() => navigate(tile.next)}
            />
          ))}
        </View>

        <Pressable onPress={() => actions.go('plusManage')} style={styles.plusBanner}>
          <View style={styles.plusPatternOne} />
          <View style={styles.plusPatternTwo} />
          <View style={styles.plusCopyBox}>
            <Text style={styles.plusKareebu}>Kareebu+</Text>
            <Text style={styles.plusTitle}>Exclusive gift: 30 days for free!</Text>
            <Text style={styles.plusBody}>Tap to unlock ride perks across Kareebu Rides.</Text>
          </View>
          <View style={styles.plusGiftBox}>
            <Ionicons name="gift" size={42} color="#FFC928" />
          </View>
        </Pressable>

        <View style={styles.compactActionRow}>
          <Pressable onPress={() => actions.go('rideBusiness')} style={styles.compactAction}><Ionicons name="briefcase-outline" size={18} color="#0F1113"/><Text style={styles.compactActionText}>Business</Text></Pressable>
          <Pressable onPress={() => actions.go('rideHistory')} style={styles.compactAction}><Ionicons name="time-outline" size={18} color="#0F1113"/><Text style={styles.compactActionText}>Your rides</Text></Pressable>
          <Pressable onPress={() => actions.go('rideSettings')} style={styles.compactAction}><Ionicons name="options-outline" size={18} color="#0F1113"/><Text style={styles.compactActionText}>Settings</Text></Pressable>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Offers</Text>
          <Pressable style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}>
            <Text style={styles.linkText}>See all</Text>
            <Feather name="arrow-right" size={21} color={COLORS.black} />
          </Pressable>
        </View>

        <View style={styles.offerCard}>
          <Text style={styles.offerTitle}>Add a promo code</Text>
          <Text style={styles.offerBody}>Use a voucher or apply a ride offer.</Text>
          <View style={styles.offerBlob} />
        </View>
      </View>
    </ScrollView>
  );

  const renderWhereTo = () => (
    <View style={styles.whiteScreen}>
      <BackMenuHeader onBack={goBack} title="Now  |  For me" />

      <View style={styles.whereCard}>
        <View style={styles.whereRow}>
          <View style={styles.whereIconBox}>
            <MaterialCommunityIcons name="car-arrow-left" size={23} color="#FFFFFF" />
          </View>
          <Text numberOfLines={1} style={styles.whereFilledText}>{pickupName}</Text>
        </View>

        <View style={styles.inputDividerColumn}>
          <View style={styles.verticalConnector} />
        </View>

        <View style={styles.whereRow}>
          <View style={styles.whereIconBox}>
            <Ionicons name="navigate-outline" size={23} color="#FFFFFF" />
          </View>
          <Text style={styles.wherePlaceholderText}>Enter your destination</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {['Suggested', 'Saved', 'Airports', 'Malls'].map((chip, index) => (
          <Pressable
            key={chip}
            style={({ pressed }) => [
              index === 0 ? styles.chipActive : styles.chip,
              pressed && styles.pressed,
            ]}
          >
            <Text style={index === 0 ? styles.chipActiveText : styles.chipText}>{chip}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={styles.listScroll} contentContainerStyle={styles.whereList}>
        {[
          {
            title: 'Acacia Mall',
            subtitle: 'Kololo - Kampala',
            distance: '6 km',
          },
          {
            title: 'Entebbe International Airport',
            subtitle: 'Entebbe - Uganda',
            distance: '42 km',
          },
          {
            title: 'Forest Mall, Lugogo',
            subtitle: 'Nakawa - Kampala',
            distance: '8 km',
          },
          {
            title: 'Kampala Serena Hotel',
            subtitle: 'Nakasero - Kampala',
            distance: '4 km',
          },
        ].map((item, index) => (
          <Pressable
            key={item.title}
            onPress={() => actions.go('whereTo')}
            style={({ pressed }) => [styles.suggestionRow, pressed && styles.pressed]}
          >
            <Ionicons name="location-outline" size={32} color={COLORS.black} />
            <View style={styles.suggestionCopy}>
              <Text style={styles.suggestionTitle}>{item.title}</Text>
              <Text style={styles.suggestionSubtitle}>{item.subtitle}</Text>
            </View>
            <View style={styles.suggestionMeta}>
              <Text style={styles.suggestionDistance}>{item.distance}</Text>
              <Feather name="more-vertical" size={22} color="#7A7E82" />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const renderScheduleIntro = () => (
    <ScrollView style={styles.darkScreen} contentContainerStyle={styles.darkScroll} showsVerticalScrollIndicator={false}>
      <View style={styles.scheduleHeaderBg}>
        <BackMenuHeader onBack={goBack} />
        <View style={styles.scheduleMiniMap}>
          <MapView
            style={styles.absoluteFill}
            initialRegion={region}
            region={region}
            scrollEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            zoomEnabled={false}
            toolbarEnabled={false}
            showsCompass={false}
            showsMyLocationButton={false}
          >
            {renderMapCars()}
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
              <View style={styles.userDot} />
            </Marker>
          </MapView>

          <View style={styles.scheduleSearchPanel}>
            <View style={styles.searchPanelTop}>
              <View style={styles.searchBigButton}>
                <View style={styles.searchIconBox}>
                  <Feather name="search" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.searchBigText}>Where to?</Text>
              </View>
              <View style={styles.laterButton}>
                <Ionicons name="calendar-outline" size={20} color="#44484C" />
                <Text style={styles.laterButtonText}>{laterChipLabel}</Text>
              </View>
            </View>

            <View style={styles.pickupPanel}>
              <Ionicons name="location-outline" size={29} color="#44484C" />
              <View style={styles.pickupPanelCopy}>
                <Text numberOfLines={1} style={styles.pickupPanelTitle}>{pickupName}</Text>
                <Text numberOfLines={1} style={styles.pickupPanelSubtitle}>{pickupSubtitle}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.schedulePanel}>
        <View style={styles.panelHandle} />
        <Image
          source={require('../../assets/kareebu-plus/rides-home/schedule.png')}
          resizeMode="contain"
          style={styles.bigFlowIcon}
        />

        <Text style={styles.howItWorks}>How it works</Text>
        <Text style={styles.scheduleTitle}>Schedule now, ride later</Text>

        <View style={styles.scheduleBullets}>
          <Bullet
            icon={<Ionicons name="car-sport-outline" size={24} color="#FFFFFF" />}
            title="Choose your pickup time up to 90 days ahead"
            body=""
          />
          <Bullet
            icon={<Ionicons name="person-circle-outline" size={24} color="#FFFFFF" />}
            title="Captain details will be shared before pickup"
            body=""
          />
          <Bullet
            icon={<Ionicons name="receipt-outline" size={24} color="#FFFFFF" />}
            title="Change or cancel for free up to 1 hour before"
            body=""
          />
        </View>

        <Pressable onPress={() => actions.go('rideSchedule')} style={({ pressed }) => [styles.primaryCta, pressed && styles.pressed]}>
          <Text style={styles.primaryCtaText}>Schedule ride</Text>
        </Pressable>
      </View>
    </ScrollView>
  );

  const renderSchedulePicker = () => (
    <View style={styles.whiteScreen}>
      <BackMenuHeader onBack={goBack} />

      <ScrollView contentContainerStyle={styles.schedulePickerPage}>
        <View style={styles.calendarHero}>
          <View style={styles.calendarBadge}>
            <View style={styles.calendarBadgeTop}>
              <Text style={styles.calendarBadgeMonth}>AUG</Text>
            </View>
            <Text style={styles.calendarBadgeDay}>15</Text>
          </View>

          <Text style={styles.scheduleQuestion}>When would you like to be picked up in Kampala?</Text>
          <Text style={styles.scheduleQuestionSub}>Free cancellation up to 1 hour before pickup</Text>
        </View>

        <Pressable style={({ pressed }) => [styles.todayRow, pressed && styles.pressed]}>
          <View>
            <Text style={styles.todayTitle}>Today</Text>
            <Text style={styles.todaySub}>Fri, August 15</Text>
          </View>
          <Feather name="chevron-right" size={28} color="#323436" />
        </Pressable>

        <View style={styles.timeWheelCard}>
          <Text style={styles.timeWheelBig}>5</Text>
          <Text style={styles.timeWheelBig}>23</Text>
          <Text style={styles.timeWheelBig}>PM</Text>
        </View>

        <Text style={styles.localTimeText}>Local time (GMT+3)</Text>

        <Pressable
          onPress={() => {
            setSelectedTime('Today · 5:23 PM');
            setView('home');
            setHistory(['home']);
          }}
          style={({ pressed }) => [styles.confirmCta, pressed && styles.pressed]}
        >
          <Text style={styles.confirmCtaText}>Confirm date and time</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setSelectedTime('Now');
            setView('home');
            setHistory(['home']);
          }}
          style={({ pressed }) => [styles.secondaryCta, pressed && styles.pressed]}
        >
          <Text style={styles.secondaryCtaText}>Book ride for now</Text>
        </Pressable>
      </ScrollView>
    </View>
  );

  const renderSchoolIntro = () => (
    <ScrollView style={styles.whiteScreen} contentContainerStyle={styles.schoolIntroPage} showsVerticalScrollIndicator={false}>
      <View style={styles.schoolHero}>
        <BackMenuHeader onBack={goBack} />
        <View style={styles.schoolHeroArt}>
          <Image source={require('../../assets/kareebu-plus/rides-home/school-rides.png')} resizeMode="contain" style={styles.schoolHeroImage} />
        </View>
      </View>

      <View style={styles.schoolBrandRow}>
        <Text style={styles.schoolBrand}>Kareebu SchoolRides</Text>
      </View>

      <Text style={styles.schoolTitle}>School packages you can count on</Text>
      <Text style={styles.schoolPrice}>Starting at UGX 390,000 for 20 rides</Text>

      <View style={styles.schoolBenefitList}>
        <Bullet
          icon={<Ionicons name="shield-checkmark-outline" size={24} color="#6E7378" />}
          title="Safe & comfortable"
          body="Live track premium rides with trusted drivers."
        />
        <Bullet
          icon={<Ionicons name="pricetag-outline" size={24} color="#6E7378" />}
          title="Budget-friendly"
          body="Save more when 2 or more kids go to the same school."
        />
        <Bullet
          icon={<Ionicons name="checkmark-outline" size={24} color="#6E7378" />}
          title="Super flexible"
          body="No daily commitments. Ride when you need to."
        />
      </View>

      <Pressable onPress={() => navigate('schoolSearch')} style={({ pressed }) => [styles.confirmCta, pressed && styles.pressed]}>
        <Text style={styles.confirmCtaText}>Search schools</Text>
      </Pressable>
    </ScrollView>
  );

  const renderSchoolSearch = () => (
    <View style={styles.whiteScreen}>
      <BackMenuHeader onBack={goBack} />

      <View style={styles.schoolSearchBar}>
        <TextInput
          placeholder="Search schools"
          placeholderTextColor="#A0A4A7"
          value={schoolQuery}
          onChangeText={setSchoolQuery}
          style={styles.schoolInput}
        />
        <Feather name="search" size={24} color="#6B6F72" />
      </View>

      <ScrollView style={styles.listScroll}>
        {filteredSchools.map((school) => (
          <Pressable key={school.id} onPress={() => openSchool(school)} style={({ pressed }) => [styles.schoolRow, pressed && styles.pressed]}>
            <View style={styles.schoolRowIcon}>
              <Ionicons name="school-outline" size={22} color="#44484C" />
            </View>
            <View style={styles.schoolRowCopy}>
              <Text style={styles.schoolRowTitle}>{school.name}</Text>
              <Text style={styles.schoolRowSubtitle}>{school.address}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const schoolRegion = {
    latitude: selectedSchool.latitude,
    longitude: selectedSchool.longitude,
    latitudeDelta: 0.045,
    longitudeDelta: 0.045,
  };

  const renderSchoolDetail = () => (
    <ScrollView style={styles.whiteScreen} contentContainerStyle={styles.schoolDetailPage}>
      <BackMenuHeader onBack={goBack} title="SchoolRides" />

      <Text style={styles.schoolDetailTitle}>{selectedSchool.name}</Text>

      <View style={styles.schoolAddressRow}>
        <Ionicons name="location-outline" size={28} color="#44484C" />
        <Text style={styles.schoolAddressText}>{selectedSchool.address}</Text>
      </View>

      <View style={styles.schoolMapCard}>
        <MapView
          style={styles.absoluteFill}
          initialRegion={schoolRegion}
          region={schoolRegion}
          scrollEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          zoomEnabled={false}
          toolbarEnabled={false}
          showsCompass={false}
          showsMyLocationButton={false}
        >
          <Marker coordinate={{ latitude: selectedSchool.latitude, longitude: selectedSchool.longitude }}>
            <View style={styles.schoolPin} />
          </Marker>
        </MapView>
      </View>

      <Pressable onPress={() => navigate('schoolHome')} style={({ pressed }) => [styles.confirmCta, pressed && styles.pressed]}>
        <Text style={styles.confirmCtaText}>Confirm school</Text>
      </Pressable>
    </ScrollView>
  );

  const renderSchoolHome = () => (
    <View style={styles.whiteScreen}>
      <BackMenuHeader onBack={goBack} title="SchoolRides" />

      <View style={styles.schoolDetailTopMini}>
        <Text style={styles.schoolDetailTitle}>{selectedSchool.name}</Text>
        <View style={styles.schoolAddressRow}>
          <Ionicons name="location-outline" size={28} color="#44484C" />
          <Text style={styles.schoolAddressText}>{selectedSchool.address}</Text>
        </View>

        <View style={styles.schoolMapMini}>
          <MapView
            style={styles.absoluteFill}
            initialRegion={schoolRegion}
            region={schoolRegion}
            scrollEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            zoomEnabled={false}
            toolbarEnabled={false}
            showsCompass={false}
            showsMyLocationButton={false}
          >
            <Marker coordinate={{ latitude: selectedSchool.latitude, longitude: selectedSchool.longitude }}>
              <View style={styles.schoolPin} />
            </Marker>
          </MapView>
        </View>
      </View>

      <View style={styles.bottomSheetPanel}>
        <View style={styles.panelHandle} />
        <View style={styles.bottomSheetHeader}>
          <Text style={styles.bottomSheetTitle}>Home location</Text>
          <View style={styles.flagBadge}>
            <Text style={styles.flagText}>UG</Text>
          </View>
        </View>

        <View style={styles.addressSearch}>
          <Feather name="search" size={23} color="#43474A" />
          <Text style={styles.addressPlaceholder}>Search an address</Text>
          <Ionicons name="map-outline" size={24} color="#9CB0C5" />
        </View>

        <View style={styles.savedRowHeader}>
          <Text style={styles.savedHeaderText}>Saved addresses</Text>
          <Pressable style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}>
            <Text style={styles.linkText}>Add new</Text>
          </Pressable>
        </View>

        <ScrollView style={{ maxHeight: 340 }}>
          {SAVED_PLACES.map((place) => (
            <Pressable
              key={place.id}
              onPress={() => setSelectedPlace(place)}
              style={({ pressed }) => [styles.savedPlaceRow, pressed && styles.pressed]}
            >
              <Ionicons name={place.icon} size={28} color={place.id === selectedPlace.id ? COLORS.black : '#50555A'} />
              <View style={styles.savedPlaceCopy}>
                <Text style={styles.savedPlaceTitle}>{place.label}</Text>
                <Text style={styles.savedPlaceSub}>{place.subtitle}</Text>
              </View>
              <Feather name={place.id === selectedPlace.id ? 'check' : 'plus'} size={22} color="#6A7074" />
            </Pressable>
          ))}

          <Pressable onPress={() => navigate('schoolPackage')} style={({ pressed }) => [styles.confirmCta, pressed && styles.pressed, { marginTop: 12 }]}>
            <Text style={styles.confirmCtaText}>Continue</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );

  const renderSchoolPackage = () => (
    <ScrollView style={styles.whiteScreen} contentContainerStyle={styles.schoolPackagePage}>
      <View style={styles.schoolPackageHero}>
        <BackMenuHeader onBack={goBack} />
        <Image
          source={require('../../assets/kareebu-plus/rides-home/school-rides.png')}
          resizeMode="contain"
          style={styles.schoolPackageHeroImage}
        />
      </View>

      <Text style={styles.schoolPackageSave}>Save up to 35%</Text>

      <View style={styles.packageCard}>
        <View>
          <Text style={styles.packageMain}>20 rides</Text>
          <Text style={styles.packageSub}>Save up to 35%</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.packagePrice}>UGX 390,000</Text>
          <Text style={styles.packagePerRide}>UGX 19,500 per ride</Text>
        </View>
      </View>

      <Text style={styles.travelBetween}>Travel between</Text>

      <View style={styles.travelCard}>
        <Ionicons name="school-outline" size={30} color="#666A6F" />
        <View style={styles.travelCopy}>
          <Text style={styles.travelTitle}>{selectedSchool.name}</Text>
          <Text style={styles.travelSub}>{selectedSchool.address}</Text>
        </View>
        <Text style={styles.editText}>Edit</Text>
      </View>

      <View style={styles.travelCard}>
        <Ionicons name="home-outline" size={30} color="#666A6F" />
        <View style={styles.travelCopy}>
          <Text style={styles.travelTitle}>{selectedPlace.label}</Text>
          <Text style={styles.travelSub}>{selectedPlace.subtitle}</Text>
        </View>
        <Text style={styles.editText}>Edit</Text>
      </View>

      <Text style={styles.whatYouGet}>What you get</Text>
      <View style={styles.whatList}>
        {[
          '20 one-way rides to or from your school',
          'Track rides in real time',
          'Priority support for schedule changes',
          'Trusted, vetted drivers',
        ].map((item) => (
          <View key={item} style={styles.whatRow}>
            <Feather name="check" size={20} color={COLORS.green} />
            <Text style={styles.whatText}>{item}</Text>
          </View>
        ))}
      </View>

      <Pressable
        onPress={() => actions.go('schoolRun')}
        style={({ pressed }) => [styles.confirmCta, pressed && styles.pressed, { marginTop: 18 }]}
      >
        <Text style={styles.confirmCtaText}>Buy package</Text>
      </Pressable>
    </ScrollView>
  );

  const renderCityToCity = () => (
    <ScrollView style={styles.whiteScreen} contentContainerStyle={styles.cityPage} showsVerticalScrollIndicator={false}>
      <BackMenuHeader onBack={goBack} />

      <Text style={styles.cityHeading}>On your way out of town?</Text>
      <Text style={styles.citySubheading}>Select a city to book your ride</Text>

      {CITY_TRIPS.map((item) => (
        <CityCard
          key={item.id}
          item={item}
          onPress={() => actions.go('whereTo')}
        />
      ))}
    </ScrollView>
  );

  const renderForFriend = () => (
    <ScrollView style={styles.whiteScreen} contentContainerStyle={styles.friendPage} showsVerticalScrollIndicator={false}>
      <View style={styles.friendHero}>
        <BackMenuHeader onBack={goBack} />
        <Image
          source={require('../../assets/kareebu-plus/rides-home/for-a-friend.png')}
          resizeMode="contain"
          style={styles.friendHeroImage}
        />
      </View>

      <Text style={styles.friendTitle}>Add contacts to Kareebu</Text>
      <Text style={styles.friendBody}>
        Use Kareebu together with contacts. Get started by syncing contacts or adding a contact by phone number.
      </Text>

      <Pressable onPress={() => actions.go('whereTo')} style={({ pressed }) => [styles.confirmCta, pressed && styles.pressed]}>
        <Text style={styles.confirmCtaText}>Select from device</Text>
      </Pressable>

      <Pressable style={({ pressed }) => [styles.secondaryCta, pressed && styles.pressed]}>
        <Text style={styles.secondaryCtaText}>Add by phone number</Text>
      </Pressable>
    </ScrollView>
  );

  const renderPickupConfirm = () => (
    <View style={styles.whiteScreen}>
      <View style={styles.fullMap}>
        <MapView
          style={styles.absoluteFill}
          initialRegion={region}
          region={region}
          scrollEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          zoomEnabled={false}
          toolbarEnabled={false}
          showsCompass={false}
          showsMyLocationButton={false}
        >
          {renderMapCars()}
          <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
            <View style={styles.pickupPin}>
              <MaterialCommunityIcons name="car-arrow-left" size={22} color="#FFFFFF" />
            </View>
          </Marker>
        </MapView>

        <BackMenuHeader onBack={goBack} />

        <View style={styles.confirmSheet}>
          <View style={styles.confirmSheetRow}>
            <View style={styles.pickupPinSquare}>
              <MaterialCommunityIcons name="car-arrow-left" size={23} color="#FFFFFF" />
            </View>
            <View style={styles.confirmCopy}>
              <Text style={styles.confirmPlaceTitle}>{pickupName}</Text>
              <Text style={styles.confirmPlaceSub}>{pickupSubtitle}</Text>
            </View>
            <Feather name="heart" size={28} color="#43474A" />
          </View>

          <View style={styles.confirmActionsRow}>
            <Pressable
              onPress={() => actions.go('whereTo')}
              style={({ pressed }) => [styles.confirmPickupButton, pressed && styles.pressed]}
            >
              <Text style={styles.confirmPickupText}>Confirm pick-up</Text>
            </Pressable>

            <Pressable style={({ pressed }) => [styles.adjustButton, pressed && styles.pressed]}>
              <Feather name="sliders" size={22} color="#44484C" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenShell>
      {view === 'home' && renderHome()}
      {view === 'whereTo' && renderWhereTo()}
      {view === 'scheduleIntro' && renderScheduleIntro()}
      {view === 'schedulePicker' && renderSchedulePicker()}
      {view === 'schoolIntro' && renderSchoolIntro()}
      {view === 'schoolSearch' && renderSchoolSearch()}
      {view === 'schoolDetail' && renderSchoolDetail()}
      {view === 'schoolHome' && renderSchoolHome()}
      {view === 'schoolPackage' && renderSchoolPackage()}
      {view === 'cityToCity' && renderCityToCity()}
      {view === 'forFriend' && renderForFriend()}
      {view === 'pickupConfirm' && renderPickupConfirm()}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  absoluteFill: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0, left: 0,
  },
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  whiteScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  darkScreen: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  darkScroll: {
    paddingBottom: 20,
    backgroundColor: COLORS.black,
  },

  header: {
    paddingTop: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSquare: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7DADD',
  },
  menuSquare: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.black,
  },
  headerTitle: {
    color: '#2D3134',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
  },
  headerTitleDark: {
    color: '#0F1113',
  },

  homePage: {
    paddingBottom: 28,
    backgroundColor: '#FFFFFF',
  },
  mapHero: {
    height: 405,
    backgroundColor: '#EFF2F4',
    overflow: 'hidden',
  },
  userDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4486F3',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  searchPanel: {
    position: 'absolute',
    top: 70,
    left: 14,
    right: 14,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  searchPanelTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBigButton: {
    flex: 1,
    minHeight: 58,
    borderRadius: 14,
    backgroundColor: '#F4F6F6',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIconBox: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBigText: {
    marginLeft: 10,
    color: '#4A4E52',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  laterButton: {
    width: 96,
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D7DBDD',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  laterButtonText: {
    color: '#43474C',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
  },
  pickupPanel: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  pickupPanelCopy: {
    flex: 1,
    marginLeft: 10,
  },
  pickupPanelTitle: {
    color: '#35393D',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
  },
  pickupPanelSubtitle: {
    marginTop: 2,
    color: '#81868B',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },

  contentSection: {
    marginTop: -4,
    paddingTop: 16,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  pageHeading: {
    color: '#313437',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  tileRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shortcutCard: {
    height: 108,
    paddingTop: 10,
    borderRadius: 18,
    backgroundColor: '#F5F6F6',
    alignItems: 'center',
  },
  shortcutVisual: {
    width: '100%',
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutImage: {
    width: '90%',
    height: 62,
  },
  shortcutLabel: {
    marginTop: 8,
    paddingHorizontal: 4,
    color: '#363A3E',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
  },

  plusBanner: {
    minHeight: 112,
    marginTop: 18,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.yellow,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  plusPatternOne: {
    position: 'absolute',
    left: -30,
    right: 120,
    bottom: -14,
    height: 54,
    backgroundColor: COLORS.black,
    transform: [{ rotate: '-8deg' }],
  },
  plusPatternTwo: {
    position: 'absolute',
    right: -18,
    bottom: -22,
    width: 130,
    height: 74,
    borderRadius: 35,
    backgroundColor: COLORS.blackSoft,
  },
  plusCopyBox: {
    flex: 1,
    paddingRight: 12,
  },
  plusKareebu: {
    color: COLORS.black,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
  },
  plusTitle: {
    marginTop: 6,
    color: '#2F3336',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
  },
  plusBody: {
    marginTop: 4,
    color: '#5E6469',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  plusGiftBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFF4CE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  compactActionRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
  compactAction: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    backgroundColor: '#F5F6F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  compactActionText: {
    color: '#0F1113',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
  },
  sectionHeaderRow: {
    marginTop: 18,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeading: {
    color: '#313437',
    fontSize: 19,
    lineHeight: 23,
    fontWeight: '900',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  linkText: {
    color: COLORS.black,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
  },
  offerCard: {
    minHeight: 86,
    borderRadius: 14,
    backgroundColor: '#F0F2FF',
    padding: 14,
    overflow: 'hidden',
  },
  offerTitle: {
    color: '#0F1113',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
  },
  offerBody: {
    marginTop: 4,
    color: '#73787E',
    fontSize: 15,
    lineHeight: 20,
  },
  offerBlob: {
    position: 'absolute',
    right: -12,
    top: -12,
    width: 128,
    height: 128,
    borderRadius: 44,
    backgroundColor: '#D5DEFF',
  },

  whereCard: {
    marginHorizontal: 10,
    marginTop: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DADDDD',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  whereRow: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
  },
  whereIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whereFilledText: {
    flex: 1,
    marginLeft: 16,
    color: '#35393D',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  wherePlaceholderText: {
    flex: 1,
    marginLeft: 16,
    color: '#B0B4B7',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  inputDividerColumn: {
    paddingLeft: 20,
    height: 26,
  },
  verticalConnector: {
    width: 3,
    height: 26,
    borderRadius: 2,
    backgroundColor: '#E2E4E5',
    marginLeft: 4,
  },
  chipRow: {
    paddingLeft: 10,
    paddingRight: 20,
    paddingVertical: 10,
    gap: 8,
  },
  chipActive: {
    paddingHorizontal: 16,
    minHeight: 40,
    borderRadius: 15,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    paddingHorizontal: 16,
    minHeight: 40,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#D4D7D9',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActiveText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  chipText: {
    color: '#303437',
    fontSize: 17,
    fontWeight: '800',
  },
  listScroll: {
    flex: 1,
  },
  whereList: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 92,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF1F2',
  },
  suggestionCopy: {
    flex: 1,
    marginLeft: 10,
  },
  suggestionTitle: {
    color: '#2F3336',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
  },
  suggestionSubtitle: {
    marginTop: 2,
    color: '#7D8288',
    fontSize: 12,
    lineHeight: 16,
  },
  suggestionMeta: {
    marginLeft: 10,
    alignItems: 'flex-end',
  },
  suggestionDistance: {
    color: '#8C9197',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 5,
  },

  scheduleHeaderBg: {
    backgroundColor: COLORS.black,
    paddingBottom: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  scheduleMiniMap: {
    height: 360,
    marginTop: 20,
    overflow: 'hidden',
  },
  scheduleSearchPanel: {
    position: 'absolute',
    left: 18,
    right: 18,
    top: 28,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  schedulePanel: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingBottom: 22,
  },
  panelHandle: {
    width: 74,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(211,226,221,0.8)',
    alignSelf: 'center',
    marginBottom: 18,
  },
  bigFlowIcon: {
    width: 210,
    height: 108,
    marginTop: 8,
    marginLeft: 4,
  },
  howItWorks: {
    marginTop: 14,
    color: COLORS.yellowSoft,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
  },
  scheduleTitle: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 52,
    fontWeight: '900',
    letterSpacing: -1.4,
  },
  scheduleBullets: {
    marginTop: 22,
    gap: 18,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletCopy: {
    flex: 1,
    marginLeft: 14,
    paddingTop: 8,
  },
  bulletTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
  bulletBody: {
    color: COLORS.yellowSoft,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },

  primaryCta: {
    marginTop: 28,
    minHeight: 70,
    borderRadius: 18,
    backgroundColor: COLORS.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCtaText: {
    color: COLORS.black,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
  },

  schedulePickerPage: {
    paddingBottom: 24,
  },
  calendarHero: {
    paddingTop: 26,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  calendarBadge: {
    width: 112,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#F5F6F6',
    marginBottom: 24,
  },
  calendarBadgeTop: {
    height: 42,
    backgroundColor: '#2E3134',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarBadgeMonth: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  calendarBadgeDay: {
    color: '#2E3134',
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '900',
    paddingVertical: 10,
  },
  scheduleQuestion: {
    color: '#2E3134',
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 47,
    fontWeight: '900',
    letterSpacing: -1.2,
  },
  scheduleQuestionSub: {
    marginTop: 8,
    color: '#70757B',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
  },
  todayRow: {
    marginTop: 28,
    minHeight: 104,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ECEEEF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todayTitle: {
    color: '#2D3134',
    fontSize: 24,
    lineHeight: 40,
    fontWeight: '900',
  },
  todaySub: {
    marginTop: 4,
    color: '#777C82',
    fontSize: 18,
    lineHeight: 22,
  },
  timeWheelCard: {
    alignSelf: 'center',
    marginTop: 42,
    width: 280,
    minHeight: 132,
    borderRadius: 28,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#ECEEEF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  timeWheelBig: {
    color: '#2F3337',
    fontSize: 26,
    lineHeight: 48,
    fontWeight: '900',
  },
  localTimeText: {
    marginTop: 28,
    textAlign: 'center',
    color: '#6A7076',
    fontSize: 18,
    lineHeight: 22,
  },
  confirmCta: {
    marginHorizontal: 12,
    marginTop: 12,
    minHeight: 72,
    borderRadius: 18,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmCtaText: {
    color: COLORS.yellow,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
  },
  secondaryCta: {
    marginHorizontal: 12,
    marginTop: 16,
    minHeight: 72,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D8DCDD',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryCtaText: {
    color: '#323639',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
  },

  schoolIntroPage: {
    paddingBottom: 26,
  },
  schoolHero: {
    backgroundColor: COLORS.yellowWash,
    paddingBottom: 12,
  },
  schoolHeroArt: {
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  schoolHeroImage: {
    width: '92%',
    height: 250,
  },
  schoolBrandRow: {
    marginTop: 12,
    paddingHorizontal: 14,
  },
  schoolBrand: {
    color: COLORS.black,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '900',
  },
  schoolTitle: {
    marginTop: 20,
    paddingHorizontal: 14,
    color: '#2F3336',
    fontSize: 24,
    lineHeight: 50,
    fontWeight: '900',
    letterSpacing: -1.2,
  },
  schoolPrice: {
    marginTop: 14,
    paddingHorizontal: 14,
    color: COLORS.green,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '800',
  },
  schoolBenefitList: {
    marginTop: 26,
    paddingHorizontal: 14,
    gap: 22,
  },
  schoolDetailPage: {
    paddingBottom: 26,
  },
  schoolDetailTitle: {
    marginTop: 24,
    paddingHorizontal: 14,
    color: '#101214',
    fontSize: 24,
    lineHeight: 45,
    fontWeight: '900',
    letterSpacing: -1.1,
  },
  schoolAddressRow: {
    marginTop: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  schoolAddressText: {
    flex: 1,
    marginLeft: 14,
    color: '#17191B',
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '700',
  },
  schoolMapCard: {
    marginTop: 22,
    marginHorizontal: 24,
    height: 335,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#EEF1F2',
  },
  schoolPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#14B872',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },

  schoolDetailTopMini: {
    paddingBottom: 14,
  },
  schoolMapMini: {
    marginTop: 12,
    marginHorizontal: 22,
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#EEF1F2',
  },
  bottomSheetPanel: {
    flex: 1,
    marginTop: -10,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: '#E6E8E9',
  },
  bottomSheetHeader: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomSheetTitle: {
    color: '#2F3336',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
  },
  flagBadge: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D7DADD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagText: {
    color: '#1A1C1E',
    fontSize: 18,
    fontWeight: '900',
  },
  addressSearch: {
    marginTop: 12,
    minHeight: 60,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8DCDD',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addressPlaceholder: {
    flex: 1,
    color: '#B0B4B7',
    fontSize: 18,
    lineHeight: 22,
  },
  savedRowHeader: {
    marginTop: 28,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savedHeaderText: {
    color: '#323639',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
  },
  savedPlaceRow: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F3',
    gap: 14,
  },
  savedPlaceCopy: {
    flex: 1,
  },
  savedPlaceTitle: {
    color: '#33373A',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
  },
  savedPlaceSub: {
    marginTop: 2,
    color: '#7B8187',
    fontSize: 12,
    lineHeight: 16,
  },

  schoolPackagePage: {
    paddingBottom: 28,
  },
  schoolPackageHero: {
    height: 320,
    backgroundColor: COLORS.yellowWash,
  },
  schoolPackageHeroImage: {
    width: '100%',
    height: 220,
    marginTop: 40,
  },
  schoolPackageSave: {
    marginTop: 20,
    marginHorizontal: 24,
    color: '#111315',
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '900',
  },
  packageCard: {
    marginTop: 12,
    marginHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 22,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  packageMain: {
    color: '#0F1113',
    fontSize: 27,
    lineHeight: 31,
    fontWeight: '900',
  },
  packageSub: {
    marginTop: 6,
    color: COLORS.green,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
  },
  packagePrice: {
    color: '#0F1113',
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '900',
  },
  packagePerRide: {
    marginTop: 6,
    color: '#8A8F95',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
  },
  travelBetween: {
    marginTop: 28,
    marginHorizontal: 24,
    color: '#74797E',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
  },
  travelCard: {
    marginTop: 14,
    marginHorizontal: 24,
    minHeight: 90,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEEEF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  travelCopy: {
    flex: 1,
  },
  travelTitle: {
    color: '#262A2D',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
  },
  travelSub: {
    marginTop: 4,
    color: '#7F848A',
    fontSize: 12,
    lineHeight: 16,
  },
  editText: {
    color: COLORS.black,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
  },
  whatYouGet: {
    marginTop: 30,
    marginHorizontal: 24,
    color: '#23272A',
    fontSize: 19,
    lineHeight: 23,
    fontWeight: '900',
  },
  whatList: {
    marginTop: 16,
    marginHorizontal: 24,
    gap: 18,
  },
  whatRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  whatText: {
    flex: 1,
    color: '#464B4F',
    fontSize: 17,
    lineHeight: 22,
  },


  cityPage: {
    paddingBottom: 28,
  },
  cityHeading: {
    marginTop: 12,
    marginHorizontal: 22,
    color: '#2E3134',
    fontSize: 24,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  citySubheading: {
    marginTop: 6,
    marginHorizontal: 22,
    color: '#787D83',
    fontSize: 12,
    lineHeight: 16,
  },
  cityCard: {
    marginTop: 12,
    marginHorizontal: 22,
    minHeight: 190,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 14,
    justifyContent: 'flex-end',
  },
  cityCardCopy: {
    zIndex: 2,
    maxWidth: '64%',
  },
  cityTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowRadius: 3,
  },
  cityFare: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
  },
  citySubtitle: {
    marginTop: 4,
    color: COLORS.yellowWash,
    fontSize: 12,
    lineHeight: 16,
  },
  cityCardIcon: {
    position: 'absolute',
    right: 10,
    bottom: 8,
    width: 180,
    height: 150,
  },

  friendPage: {
    paddingBottom: 28,
  },
  friendHero: {
    height: 430,
    backgroundColor: COLORS.yellowSoft,
  },
  friendHeroImage: {
    width: '92%',
    height: 290,
    marginTop: 50,
    alignSelf: 'center',
  },
  friendTitle: {
    marginTop: 16,
    marginHorizontal: 22,
    color: '#0F1113',
    fontSize: 24,
    lineHeight: 42,
    fontWeight: '900',
    letterSpacing: -1,
  },
  friendBody: {
    marginTop: 12,
    marginHorizontal: 22,
    color: '#33373A',
    fontSize: 18,
    lineHeight: 30,
  },

  fullMap: {
    flex: 1,
    backgroundColor: '#EEF2F4',
  },
  confirmSheet: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.10,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  confirmSheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupPinSquare: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmCopy: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },
  confirmPlaceTitle: {
    color: '#3A3E41',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
  },
  confirmPlaceSub: {
    marginTop: 3,
    color: '#81858A',
    fontSize: 15,
    lineHeight: 20,
  },
  confirmActionsRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 14,
  },
  confirmPickupButton: {
    flex: 1,
    minHeight: 70,
    borderRadius: 18,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmPickupText: {
    color: COLORS.yellow,
    fontSize: 18,
    fontWeight: '900',
  },
  adjustButton: {
    width: 88,
    minHeight: 70,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D9DDDE',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  pickupPin: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.black,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  schoolRow: {
    minHeight: 112,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 18,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  schoolRowIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  schoolRowCopy: {
    flex: 1,
  },
  schoolRowTitle: {
    color: '#121416',
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '800',
  },
  schoolRowSubtitle: {
    marginTop: 4,
    color: '#7D8287',
    fontSize: 15,
    lineHeight: 22,
  },
  schoolSearchBar: {
    marginTop: 12,
    marginHorizontal: 22,
    minHeight: 60,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.yellow,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  schoolInput: {
    flex: 1,
    color: '#1B1D1F',
    fontSize: 18,
    lineHeight: 22,
  },

  mapCar: {
    width: 32,
    height: 18,
  },

  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
});
