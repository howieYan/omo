import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Animated, AsyncStorage, StatusBar, ToastAndroid, Image, ScrollView,
} from 'react-native';
import Utils from "../../Components/Utils";
import {Loading} from "../../Components/Loading";

export default class CalculateForceWallet extends React.Component {
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
            page: 1,
            size: 100000,
            type: 2,
            language: {},
        }
    }
    componentDidMount () {
        this.LoadData();
    }
    async LoadData () {
        try {
            let results = await AsyncStorage.getItem('language');
            this.setState({
                language: JSON.parse(results),
            });
            let UserId = await AsyncStorage.getItem('UserId');
            let lang = await  AsyncStorage.getItem('lang');
            let formData = new FormData();
            formData.append('user_id', UserId);
            formData.append('page', this.state.page);
            formData.append('size', this.state.size);
            formData.append('type', this.state.type);
            formData.append('lang', lang);
            let data = await Utils.postJSON(Utils.size.url + '/v1/contract/detail', formData);
            console.log(data);
            if (Number(data.code) === 0) {
                Loading.hidden();
                this.setState({
                    data: data.result.list,
                    total: data.result.total
                })
            } else {
                Loading.hidden();
                ToastAndroid.show(data.message, ToastAndroid.SHORT);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <View style={[styles.content,styles.contentBg]}>
                <ScrollView>
                    <View style={{paddingTop: 10}}>
                        {this.renderList()}
                    </View>
                </ScrollView>
            </View>
        );
    }
    renderList () {
        let list = [];
        if (this.state.total > 0) {
            this.state.data.forEach((v, i) => {
                list.push(
                    <View style={styles.RecordList} key={i}>
                        <View style={styles.RecordCard}>
                            <Text style={styles.RecordCardTitle}>{v.coin_classify_name}</Text>
                            <Text style={styles.RecordCardMain}>{v.coin_remark}</Text>
                            <Text style={styles.RecordCardMain}>{v.send_code}</Text>
                            <View style={styles.RecordCardBottom}>
                                <Text style={styles.RecordCardBottomTime}>{Utils.formatTs(v.coin_time, 'YYYY-MM-DD HH:mm')}</Text>
                                <Text style={styles.RecordCardBottomType}>{v.coin_state_name}</Text>
                            </View>
                        </View>
                    </View>
                )
            })
        } else {
            list.push(
                <View style={{flex: 1,alignItems: 'center',justifyContent: 'center',height: 400,}} key={this.state.page}>
                    <Text style={{color: '#000',fontSize: 20,}}>{this.state.language.app_Operate_Contract_Record_null}</Text>
                </View>
            )
        }
        return list;

    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    // 文本
    RecordList: {
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    RecordCard: {
        borderRadius: 3,
        backgroundColor: '#2b2b2b',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    RecordCardTitle: {
        fontSize: Utils.setSpText(15),
        color: '#fff',
    },
    RecordCardMain: {
        paddingTop: 10,
        fontSize: Utils.setSpText(14),
        color: '#fff',
    },
    RecordCardMainbg: {
        paddingTop: 5,
        fontSize: Utils.setSpText(14),
        color: '#fff',
    },
    RecordCardBottom: {
        paddingTop: 10,
        flexDirection: 'row',
    },
    RecordCardBottomTime: {
        flex: 1,
        fontSize: Utils.setSpText(12),
        color: '#fff',
    },
    RecordCardBottomType: {
        fontSize: Utils.setSpText(12),
        color: '#fff',
    }
});
