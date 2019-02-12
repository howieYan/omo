import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    WebView, AsyncStorage, InteractionManager, ToastAndroid
} from 'react-native';
import Utils from "../../Components/Utils";
import {Loading} from "../../Components/Loading";

export default class MessageDetails extends React.Component {
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
        this.loadData();
    }
    async loadData() {
        try{
            let results = await AsyncStorage.getItem('language');
            this.setState({
                language: JSON.parse(results),
            });
            Loading.show(this.state.language.app_Loading_show);
            let lang = await  AsyncStorage.getItem('lang');
            let UserId = await AsyncStorage.getItem('UserId');
            let formData = new FormData();
            formData.append('user_id', UserId);
            formData.append('lang', lang);
            formData.append('message_id', this.props.navigation.state.params.id);
            let data = await  Utils.postJSON(Utils.size.url + '/v1/contract/infoDetail', formData);
            console.log(data);
            if (Number(data.code) === 0) {
                this.setState({
                    list: data.result.message
                })
                Loading.hidden();
            } else {
                Loading.hidden();
                Loading.Toast(data.message);
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
                    <View style={styles.messageDetails}>
                        <Text style={styles.messageDetailsTitle}>{this.state.list.msg_title}</Text>
                        <View style={styles.messageDetailsTime}>
                            <Text style={styles.messageDetailsTimeText}>{Utils.formatTs(this.state.list.msg_time, 'YYYY-MM-DD')}</Text>
                        </View>
                        <Text style={styles.messageDetailsMain}>{this.state.list.message}</Text>
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
    aboutUsMainList: {
        backgroundColor: '#2b2b2b'
    },
    // 内容
    messageDetails: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    messageDetailsTitle: {
        fontSize: Utils.setSpText(16),
        fontWeight: 'bold',
        paddingTop: 20,
        color: '#2b2b2b',
    },
    messageDetailsTime: {
        paddingTop: 10,
        flexDirection:'row-reverse',
    },
    messageDetailsTimeText: {
        paddingTop: 10,
        fontSize: Utils.setSpText(13),
        color: '#333',
    },
    messageDetailsMain: {
        paddingTop: 10,
        lineHeight: 25,
        fontSize: Utils.setSpText(15),
        color: '#555'
    }
});

