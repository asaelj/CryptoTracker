import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SectionList,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import Colors from 'cryptoTracker/src/res/colors';
import Http from 'cryptoTracker/src/libs/http';
import Storage from 'cryptoTracker/src/libs/storage';
import CoinMarketItem from './CoinMarketItem';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charade,
  },
  row: {
    flexDirection: 'row',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0, 0.2)',
    padding: 16,
  },
  titleText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  iconImage: {
    width: 25,
    height: 25,
  },
  section: {
    maxHeight: 220,
  },
  list: {
    maxHeight: 100,
    paddingLeft: 16,
  },
  sectionHeader: {
    backgroundColor: 'rgba(0,0,0, 0.2)',
    padding: 8,
  },
  sectionItem: {
    padding: 8,
  },
  itemText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  marketTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  btnFavorite: {
    padding: 8,
    borderRadius: 8,
  },
  btnFavoriteText: {
    color: '#fff',
  },
  btnFavoriteAdd: {
    backgroundColor: Colors.picton,
  },
  btnFavoriteRemove: {
    backgroundColor: Colors.carmine,
  },
});

const CoinDetailScreen = ({route, navigation}) => {
  const {coin} = route.params;
  const [coinDetail, setCoinDetail] = useState(coin);
  const [markets, setMarkets] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const getSymbolIcon = (name) => {
    if (name) {
      const symbol = name.toLowerCase().replace(' ', '-');
      return `https://c1.coinlore.com/img/16x16/${symbol}.png`;
    }
  };

  const getSections = () => {
    const sections = [
      {
        title: 'Market cap',
        data: [coinDetail.market_cap_usd],
      },
      {
        title: 'Volume 24h',
        data: [coinDetail.volume24],
      },
      {
        title: 'Change 24h',
        data: [coinDetail.percent_change_24h],
      },
    ];
    return sections;
  };

  const getMarkets = async (coinId) => {
    const url = `https://api.coinlore.net/api/coin/markets/?id=${coinId}`;
    const markets_ = await Http.instance.get(url);
    setMarkets(markets_);
  };

  const addFavorite = async () => {
    const coin_ = JSON.stringify(coin);
    const key = `favorite-${coin.id}`;

    const stored = await Storage.instance.store(key, coin_);
    console.log(stored);
    if (stored) {
      setIsFavorite(true);
    }
  };

  const removeFavorite = async () => {
    Alert.alert('Remove favorite', 'Are you sure?', [
      {
        text: 'cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Remove',
        onPress: async () => {
          const key = `favorite-${coin.id}`;
          await Storage.instance.remove(key);
          setIsFavorite(false);
        },
        style: 'destructive',
      },
    ]);
  };

  const getFavorite = async () => {
    try {
      const key = `favorite-${coin.id}`;
      const favStr = await Storage.instance.get(key);
      if (favStr !== null) {
        setIsFavorite(true);
      }
    } catch (err) {
      console.log('Get favorites err', err);
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite();
    } else {
      addFavorite();
    }
    console.log('isFavorite', isFavorite);
  };

  useEffect(() => {
    navigation.setOptions({title: coinDetail.symbol});
    getMarkets(coin.id);
    getFavorite();
  }, [coin]);

  return (
    <View style={style.container}>
      <View style={style.subHeader}>
        <View style={style.row}>
          <Image
            style={style.iconImage}
            source={{uri: getSymbolIcon(coinDetail.nameid)}}
          />
          <Text style={style.titleText}>{coinDetail.name}</Text>
        </View>

        <Pressable
          onPress={toggleFavorite}
          style={[
            style.btnFavorite,
            isFavorite ? style.btnFavoriteRemove : style.btnFavoriteAdd,
          ]}>
          <Text style={style.btnFavoriteText}>
            {isFavorite ? 'Remove Favorite' : 'Add Favorite'}
          </Text>
        </Pressable>
      </View>

      <SectionList
        style={style.section}
        sections={getSections()}
        keyExtractor={(item) => item}
        renderItem={({item}) => (
          <View style={style.sectionItem}>
            <Text style={style.itemText}>{item}</Text>
          </View>
        )}
        renderSectionHeader={({section}) => (
          <View style={style.sectionHeader}>
            <Text style={style.itemText}>{section.title}</Text>
          </View>
        )}
      />

      <Text style={style.marketTitle}>Markets</Text>

      <FlatList
        style={style.list}
        horizontal={true}
        data={markets}
        renderItem={({item}) => <CoinMarketItem item={item} />}
      />
    </View>
  );
};

export default CoinDetailScreen;
