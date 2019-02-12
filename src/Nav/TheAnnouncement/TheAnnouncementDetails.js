import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    WebView,
    AsyncStorage
} from 'react-native';
import Utils from "../../Components/Utils";

export default class TheAnnouncementDetails extends React.Component {
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
            let lang = await  AsyncStorage.getItem('lang');
            let formData = new FormData();
            formData.append('new_id', this.props.navigation.state.params.id);
            formData.append('lang', lang);
            let data = await  Utils.postJSON(Utils.size.url + '/v1/contract/noticeDetail', formData);
            console.log(data);
            if (Number(data.code) === 0) {
                this.setState({
                    list: data.result.news
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
                <View style={styles.content}>
                    <View style={styles.messageDetails}>
                        <Text style={styles.messageDetailsTitle}>{this.state.list.new_title}</Text>
                        <View style={styles.messageDetailsTime}>
                            <Text style={styles.messageDetailsTimeText}>{Utils.formatTs(this.state.list.new_time, 'YYYY-MM-DD')}</Text>
                        </View>
                        <Image source={{uri: this.state.list.new_img}} style={styles.newImg}/>
                        <View style={styles.content}>
                            <WebView
                                style={{marginTop: 20,width: Utils.size.width}}
                                bounces={false}
                                scalesPageToFit={Utils.size.os === 'ios' ? false : true}
                                source={{html: this.state.list.new_content}}>
                            </WebView>
                        </View>
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
    },
    newImg: {
        marginTop: 10,
        width: Utils.size.width - 20,
        height: 200
    }

});

