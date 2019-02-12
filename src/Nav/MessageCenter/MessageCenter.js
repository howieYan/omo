import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated, AsyncStorage, ScrollView, InteractionManager, ToastAndroid
} from 'react-native';
import Utils from "../../Components/Utils";
import {Loading} from "../../Components/Loading";
// import MessageDetails from './MessageDetails';
export default class MessageCenter extends React.Component {
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
            list: [],
            page: 1,
            size: 100,
            total: null,
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
            formData.append('page', this.state.page);
            formData.append('size', this.state.size);
            let data = await  Utils.postJSON(Utils.size.url + '/v1/contract/information', formData);
            console.log(data);
            if (Number(data.code) === 0) {
                this.setState({
                    list: data.result.list,
                    total: data.result.total
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
                <View style={styles.content}>
                    <ScrollView>
                        {this.renderList()}
                    </ScrollView>
                </View>
            </View>
        );
    }
    renderList () {
        let list = [];
        if (this.state.total > 0) {
            this.state.list.forEach((v, i) => {
                list.push(
                    <TouchableOpacity key={i} activeOpacity={0.8} onPress={this.onMessageDetails.bind(this, v.msg_id)}>
                        <View style={styles.messageList}>
                            <Text style={styles.messageListText}>{ v.message}</Text>
                            <Text style={styles.messageListTextTime}>{Utils.formatTs(v.msg_time, 'YYYY年MM月DD')}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })
        } else {
            list.push(
                <View style={{height:400, alignItems: 'center', justifyContent: 'center'}} key={this.state.total}>
                    <Text style={{fontSize: 20}}>{this.state.language.app_Operate_Contract_Record_null}</Text>
                </View>
            )
        }
        return list;
    }
    // 消息详情
    onMessageDetails (record) {
        this.props.navigation.navigate('MessageDetails', {name: this.state.language.app_MessageDetails_title, id: record})
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
    messageList: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15,
        paddingBottom: 15,
        justifyContent: 'center',
        borderBottomColor: '#ececec',
        borderBottomWidth: 1,
    },
    messageListText: {
        fontSize: Utils.setSpText(14),
        color: '#2b2b2b'
    },
    messageListTextTime: {
        paddingTop: 10,
        fontSize: Utils.setSpText(12),
        color: '#333',
    }
});

