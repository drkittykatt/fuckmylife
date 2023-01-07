import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { globalStyles } from "../../styles/global";

export default function RadioButton({ data, onSelect }) {
  const [userOption, setUserOption] = useState(null);
  const selectHandler = (value) => {
    onSelect(value);
    setUserOption(value);
  };
  return (
    <View>
      {data.map((item) => {
        return (
          <Pressable
            style={
              item.value === userOption
                ? globalStyles.selected
                : globalStyles.unselected
            }
            onPress={() => selectHandler(item.value)}
          >
            <Text style={globalStyles.option}> {item.value}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
