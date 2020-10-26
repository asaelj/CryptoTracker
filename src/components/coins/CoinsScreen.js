import React, {useState, useEffect} from 'react';
import {View, FlatList, ActivityIndicator, StyleSheet} from 'react-native';
import Http from 'cryptoTracker/src/libs/http';
import CoinsItem from './CoinsItem';
import Colors from 'cryptoTracker/src/res/colors';
import CoinsSearch from './CoinSearch';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charade,
  },
  title: {
    color: '#fff',
    textAlign: 'center',
  },
  btn: {
    padding: 8,
    backgroundColor: 'blue',
    borderRadius: 8,
    margin: 16,
    color: '#fff',
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
  loader: {
    marginTop: 60,
  },
});

const CoinsScreen = (props) => {
  const [coins, setCoins] = useState([]);
  const [allCoins, setAllCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  const {navigation} = props;

  const handlePress = (coin) => {
    navigation.navigate('CoinDetail', {coin});
  };

  const loadCoins = async () => {
    setLoading(true);
    const res = await Http.instance.get(
      'https://api.coinlore.net/api/tickers/',
    );
    // console.log(res);
    setCoins(res.data);
    setAllCoins(res.data);
    setLoading(false);
  };

  const handleSearch = (query) => {
    const coinsFiltered = allCoins.filter((coin) => {
      return (
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      );
    });

    setCoins(coinsFiltered);
  };

  useEffect(() => {
    loadCoins();
  }, []);

  return (
    <View style={style.container}>
      <CoinsSearch onChange={handleSearch} />
      {loading ? (
        <ActivityIndicator style={style.loader} color="#fff" size="large" />
      ) : null}
      <FlatList
        data={coins}
        renderItem={({item}) => (
          <CoinsItem onPress={() => handlePress(item)} item={item} />
        )}
      />
    </View>
  );
};

export default CoinsScreen;
