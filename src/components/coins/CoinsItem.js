import React from 'react';
import {View, Pressable, Text, Image, StyleSheet, Platform} from 'react-native';
import ArrowUp from 'cryptoTracker/src/assets/arrow_up.png';
import ArrowDown from 'cryptoTracker/src/assets/arrow_down.png';
import Colors from 'cryptoTracker/src/res/colors';

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomColor: Colors.zircon,
    borderBottomWidth: 1,
    paddingLeft: Platform.OS === 'ios' ? 0 : 16,
    marginLeft: Platform.OS === 'ios' ? 16 : 0,
  },
  row: {
    flexDirection: 'row',
  },
  symbolText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 12,
  },
  nameText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 16,
  },
  porcentText: {
    color: '#fff',
    fontSize: 12,
    marginRight: 8,
  },
  priceText: {
    color: '#fff',
    fontSize: 14,
  },
  imgIcon: {
    width: 22,
    height: 22,
  },
});

const CoinsItem = ({item, onPress}) => {
  const getImageArrow = () => {
    if (item.percent_change_1h > 0) {
      return ArrowUp;
    } else {
      return ArrowDown;
    }
  };

  return (
    <Pressable onPress={onPress} style={style.container}>
      <View style={style.row}>
        <Text style={style.symbolText}>{item.symbol}</Text>
        <Text style={style.nameText}>{item.name}</Text>
        <Text style={style.priceText}>{`$${item.price_usd}`}</Text>
      </View>
      <View style={style.row}>
        <Text style={style.porcentText}>{item.percent_change_1h}</Text>
        <Image style={style.imgIcon} source={getImageArrow()} />
      </View>
    </Pressable>
  );
};

export default CoinsItem;
