/*
 Copyright (c) 2022 Skyflow, Inc.
*/

import React from "react";
import { StyleSheet, View } from "react-native";
import CollectElements from "./CollectElements";
import RevealElements from "./RevealElements";

const Skyview = ()=>{
  const [tokens, setTokens] = React.useState(null);
  const [showReveal,setShowRevealView] = React.useState<boolean>(false);
  
  React.useEffect(()=>{
    if(tokens){
      setShowRevealView(true);
    }
  },[tokens]);
  
  return (
    <View style={styles.container}>
    {
      showReveal ? <RevealElements tokens={tokens} setShowRevealView={setShowRevealView}/> 
                 : <CollectElements setTokens={setTokens} />
    }
  </View>
  )

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default Skyview;