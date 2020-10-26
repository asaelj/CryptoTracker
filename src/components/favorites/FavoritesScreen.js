import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import FavoritesEmptyState from './FavoritesEmptyState';
import CoinsItem from 'cryptoTracker/src/components/coins/CoinsItem';
import Storage from 'cryptoTracker/src/libs/storage';
import Colors from 'cryptoTracker/src/res/colors';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charade,
  },
});

const FavoritesScreen = (props) => {
  const [favorites, setFavorites] = useState([]);

  const getFavorites = async () => {
    try {
      const allKeys = await Storage.instance.getAllKeys();
      const keys = allKeys.filter((key) => key.includes('favorite-'));
      const favs = await Storage.instance.multiGet(keys);
      const favorites_ = favs.map((fav) => JSON.parse(fav[1]));
      setFavorites(favorites_);
    } catch (err) {
      console.log('Get favoritos err', err);
    }
  };

  const handlePress = (coin) => {
    props.navigation.navigate('CoinDetail', {coin});
  };

  useEffect(() => {
    props.navigation.addListener('focus', getFavorites);
  }, []);

  return (
    <View style={style.container}>
      {favorites.length === 0 ? <FavoritesEmptyState /> : null}
      {favorites.length > 0 ?
        <FlatList
          data={favorites}
          renderItem={({item}) => (
            <CoinsItem item={item} onPress={handlePress} />
          )}
        /> :
      null}
    </View>
  );
};

export default FavoritesScreen;
