import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    AsyncStorage
} from 'react-native';
import Utils from "../../Components/Utils";
// import AnnouncementDetails from './AnnouncementDetails';
export default class TheAnnouncement extends React.Component {
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
            let language = await AsyncStorage.getItem('language');
            this.setState({
                language: JSON.parse(language),
            });
            let lang = await  AsyncStorage.getItem('lang');
            let formData = new FormData();
            formData.append('page', this.state.page);
            formData.append('lang', lang);
            formData.append('size', this.state.size);
            let data = await  Utils.postJSON(Utils.size.url + '/v1/contract/notice', formData);
            console.log(data);
            if (Number(data.code) === 0) {
                this.setState({
                    list: data.result.list,
                    total: data.result.total
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
                <ScrollView>
                    {this.renderList()}
                </ScrollView>
            </View>
        );
    }
    renderList () {
        let list = [];
        if (this.state.total > 0) {
            this.state.list.forEach((v, i) => {
                list.push(
                    <TouchableOpacity key={i} activeOpacity={0.8} onPress={this.onMessageDetails.bind(this, v.new_title, v.new_id)}>
                        <View style={styles.messageList}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={styles.newLeft}>
                                    <Text style={styles.messageListText}>{ v.new_title}</Text>
                                    <Text style={styles.messageListTextTime}>{Utils.formatTs(v.new_time, 'YYYY-MM-DD')}</Text>
                                </View>
                                <Image style={styles.newImg} source={{uri: v.new_img}}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            })
        } else {
            list.push(
                <View style={{alignItems: 'center', justifyContent: 'center',height: 400}} key={this.state.total}>
                    <Text style={{fontSize: 20}}>{this.state.language.app_Operate_Contract_Record_null}</Text>
                </View>
            )
        }
        return list;
    }

    // 消息详情
    onMessageDetails (title, record) {
        this.props.navigation.navigate('TheAnnouncementDetails', {name: title, id: record,})
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
        paddingTop: 10,
        paddingBottom: 10,
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
    },
    newLeft: {
        width: Utils.size.width - 120
    },
    newImg: {
        borderRadius: 3,
        width: 100,
        height: 70
    }
});

