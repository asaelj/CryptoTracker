import React, {useState} from 'react';
import {TextInput, Platform, StyleSheet, View} from 'react-native';
import Colors from 'cryptoTracker/src/res/colors';

const style = StyleSheet.create({
  textInput: {
    height: 46,
    backgroundColor: Colors.charade,
    paddingLeft: 16,
    color: '#fff',
  },
  textInputAndroid: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.zircon,
  },
  textInputIOS: {
    margin: 8,
    borderRadius: 8,
  },
});

const CoinsSearch = ({onChange}) => {
  const [query, setQuery] = useState('');

  const handleText = (query_) => {
    setQuery(query_);
    if (onChange) {
      onChange(query_);
    }
  };

  return (
    <View>
      <TextInput
        style={[
          style.textInput,
          Platform.OS === 'ios' ? style.textInputIOS : style.textInputAndroid,
        ]}
        onChangeText={handleText}
        placeholder="Search coin"
        placeholderTextColor="#fff"
        value={query}
      />
    </View>
  );
}

export default CoinsSearch;
