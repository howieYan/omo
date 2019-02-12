import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    WebView,
    AsyncStorage
} from 'react-native';
import Utils from "../../../Components/Utils";

export default class PrivacyPlokicy extends React.Component {
    static navigationOptions = ({navigation}) => ({
        headerTitle: navigation.state.params.name,
        headerTintColor: '#fff',
        headerTitleStyle:{
            flex:1,
            textAlign: 'center',
        },
        headerStyle: {
            backgroundColor: '#000',
            borderBottomWidth: 0,
        },
        headerRight: <View/>,
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
            formData.append('lang' , lang);
            let result = await  Utils.postJSON(Utils.size.url + '/v1/authorization/privacy', formData);
            console.log(result);
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
            <View style={styles.content}>
                <View style={[styles.content]}>
                    <View style={styles.aboutUsHead}>
                        {this.state.list.new_img ? <Image source={{ uri: Utils.size.url + this.state.list.new_img }} style={styles.aboutUsHeadLogo}/> : <Text/>}
                        <Text style={[styles.aboutUsHeadVersions, styles.aboutUsHeadName]}>{this.state.list.new_title}</Text>
                        <WebView
                            bounces={false}
                            originWhitelist={['*']}
                            scalesPageToFit={Utils.size.os === 'ios' ? false : true}
                            source={{html: this.state.list.new_content,  baseUrl: ''}}
                            style={{width: Utils.size.width, height: Utils.size.height}}>
                        </WebView>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    // 内容
    aboutUsHead: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        width: Utils.size.width,
        alignItems: 'center'
    },
    aboutUsHeadLogo: {
        width: 50,
        height: 50,
    },
    aboutUsHeadVersions: {
        paddingTop: 20,
        fontSize: Utils.setSpText(12),
        color: '#333',
    },
    aboutUsHeadName: {
        paddingTop: 20,
        lineHeight: 20,
        fontSize: Utils.setSpText(14),
        color: '#333',
    },
    aboutUsMainList: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#ececec',
    },
});

