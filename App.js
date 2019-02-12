import React, { Component } from 'react';
import {
    StyleSheet,
    AsyncStorage,
    View,
    StatusBar
} from 'react-native';
import configAppNavigator from './src/AppNavigator';
import Utils from './src/Components/Utils'
import SplashScreen from "react-native-splash-screen";
export default class App extends Component<> {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            language: {}
        }
    }
    componentDidMount () {
        this.LoadData();
    }
    async LoadData() {
        try {
            let results = await AsyncStorage.getItem('lang');
            if (!results) {
                AsyncStorage.setItem('lang', 'tw');
            }
            let UserId = await AsyncStorage.getItem('UserId');
            let formData = new FormData();
            formData.append("lang", results);
            let data = await Utils.postJSON(Utils.size.url + '/v1/settings/getLang', formData);
            if (data.result instanceof Array) {
                this.LoadData()
            } else {
                SplashScreen.hide()
                if (Number(data.code) === 0) {
                    this.setState({
                        language: data.result,
                    });
                    console.log(this.state.language)
                    AsyncStorage.setItem('language', JSON.stringify(data.result));
                    if (UserId) {
                        this.setState({
                            isLoggedIn: true,
                        })
                    } else {
                        this.setState({
                            isLoggedIn: false,
                        })
                    }
                }

            }
        }
        catch (e) {
            console.log(e);
        }
    }
    render() {
        const AppNavigator = configAppNavigator(this.state.isLoggedIn, this.state.language);
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="#000"
                    barStyle="light-content"
                />
                <AppNavigator/>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
