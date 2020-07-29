import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Text, View, Image, Button, Linking, ScrollView, RefreshControl,TouchableOpacity } from 'react-native'; 
import { showLocation } from 'react-native-map-link'

export default class FetchExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isLoading: true, veriler: [], telefon: [], coords: [], enlem: [], boylam: [], eczaneAdi: [], currentLatitude: [], currentLongitude: [] };
    this._onPress = this._onPress.bind(this);
  }

  fetchdata = () => {
    return fetch('https://gis.ankara.bel.tr/BaskentKentRehberi/Handlers/AppData.ashx?f=nobetcieczaneler');
  }

  componentDidMount() {

    this.fetchdata()
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          veriler: responseJson,
          refreshing: false,
        }, function () { });
      })
      .catch((error) => {
        console.error(error);
      }); 
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          this.setState({
            currentLatitude: position.coords.latitude,
            currentLongitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
      );
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.setState({ dataSource: [] });
    this.fetchdata().then(() => {
      this.setState({ refreshing: false });
    });
  }
  _renderItem = ({ item }) =>
    (
      <ScrollView>
        <Text style={{ paddingTop: 25, marginLeft: 15, marginRight: 10, fontSize: 15 }}>Eczane Adı: {item.eczane} ECZANESİ {'\n'}Adres: {item.adres}{'\n'}Semt: {item.semt}{'\n'}Telefon: 0{item.telefon}{'\n'}</Text>
        <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center' }}>
        <TouchableOpacity onPress={() => this._onPress(this.telefon = item.telefon)}>
          <Image source={require('./PHONE.png')}  />
        </TouchableOpacity> 
          <Text>   </Text> 
          <Text>                    </Text>
          <TouchableOpacity onPress={() => this._hedefeGit(this.enlem = item.enlem, this.boylam = item.boylam, this.eczaneAdi = item.eczane)}>  
          <Image source={require('./GPS.png')}  />
          </TouchableOpacity>
          <Text>   </Text> 
        </View>
        <Text> </Text>
      </ScrollView>
    );
  _onPress = (telNo) => { 
    Linking.openURL("tel:{0" + telNo + "}")
  }
  _hedefeGit = () => { 
    showLocation({ 
      latitude: this.enlem,
      longitude: this.boylam,
      sourceLatitude: this.state.currentLatitude,   
      sourceLongitude: this.state.currentLongitude, 
      googleForceLatLon: false,   
      googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58', 
      alwaysIncludeGoogle: true,  
      appsWhiteList: ['google-maps'] 
    })

  }
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ justifyContent: "center", alignItems: "center", flex: 1, padding: 20, marginTop: 23 }}>
          <ActivityIndicator size="large" />
          <Text style={{ textAlign: "center", fontSize: 35 }}>Yükleniyor...</Text>
        </View>
      )
    }
    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <Text style={{ backgroundColor: "#8cd66b", textAlign: "center", marginTop: 10, marginBottom: 10, padding: 10, flexDirection: "row", fontStyle: "italic", fontWeight: "bold", fontSize: 25 }}>Ankara Nöbetçi Eczaneler</Text>
        <FlatList
          data={this.state.veriler}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          renderItem={this._renderItem}
          keyExtractor={({ enlem }, index) => enlem}
        />
      </View>
    );
  }
}  
