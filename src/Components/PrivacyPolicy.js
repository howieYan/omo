import React from 'react';
import {
    View,
    StyleSheet,
    WebView,
    AsyncStorage
} from 'react-native';
import Utils from "./Utils";
export default class PrivacyPolicy extends React.Component {
    static navigationOptions = ({navigation}) => ({
        headerTitle: navigation.state.params.name,
        headerTintColor: '#fff',
        headerTitleStyle:{
            flex:1,
            textAlign: 'center'
        },
        headerStyle: {
            backgroundColor: '#000',
            borderBottomWidth: 0
        },
        headerRight: <View />,
    })
    constructor(props) {
        super(props);
        this.state = {
            list: {},
            language: {},
        }
    }
    componentDidMount () {
        this.listData();
    }
    async listData() {
        try{
            let results = await AsyncStorage.getItem('language');
            this.setState({
                language: JSON.parse(results),
            });
            let lang = await  AsyncStorage.getItem('lang');
            let formData = new FormData();
            formData.append('lang', lang);
            let result = await  Utils.postJSON(Utils.size.url + '/v1/authorization/privacy', formData);
            if (Number(result.code) === 0) {
                this.setState({
                    list: result.result
                })
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    render() {
        return (
            <View style={[styles.content, styles.aboutUsMainList]}>
                <WebView
                    bounces={false}
                    scalesPageToFit={Utils.size.os === 'ios' ? false : true}
                    source={{html: this.state.list.new_content}}
                    style={{width: Utils.size.width, height: Utils.size.height, backgroundColor: '#2b2b2b'}}>
                </WebView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    aboutUsMainList: {
        flex: 1,
        backgroundColor: '#2b2b2b'
    },
});

