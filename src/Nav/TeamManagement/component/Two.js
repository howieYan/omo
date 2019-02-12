import React from 'react';
import {
    Text,
    View,
    StyleSheet, ScrollView, AsyncStorage, InteractionManager, ToastAndroid,
} from 'react-native';
import Utils from "../../../Components/Utils";
import {Loading} from '../../../Components/Loading';
export default class Two extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: null,
            page: 1,
            size: 100,
            total: null,
            data: [],
            language: {},
        };
    }
    componentDidMount () {
        this.loadData();
    }
    async loadData () {
        try {
            let results = await AsyncStorage.getItem('language');
            this.setState({
                language: JSON.parse(results),
            });
            Loading.show(this.state.language.app_Loading_show);
            let lang = await  AsyncStorage.getItem('lang');
            let UserId = await AsyncStorage.getItem('UserId');
            let formData = new FormData();
            formData.append('lang', lang);
            formData.append('user_id', UserId);
            formData.append('page', this.state.page);
            formData.append('size', this.state.size);
            formData.append('level', 2);
            let data = await Utils.postJSON(Utils.size.url + '/v1/contract/team', formData);
            if (Number(data.code) === 0) {
                this.setState({
                    data: data.result.list,
                    total: data.result.total
                })
                Loading.hidden();
            } else {
                Loading.hidden();
                Loading.Toast(data.message)
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    render() {
        return (
            <View style={styles.main}>
                <View style={styles.mainTable}>
                    <View style={styles.table}>
                        <View style={styles.tableWidth}>
                            <Text numberOfLines={1} ellipsizeMode="middle" style={[styles.tableTitle, styles.tableTitleWight]}>{this.state.language.app_Team_one_account}</Text>
                        </View>
                        <View style={styles.tableWidth}>
                            <Text numberOfLines={1} ellipsizeMode="middle" style={[styles.tableTitle, styles.tableTitleWight]}>{this.state.language.app_Team_one_real_name}</Text>
                        </View>
                        <View style={styles.tableWidth}>
                            <Text numberOfLines={1} ellipsizeMode="middle" style={[styles.tableTitle, styles.tableTitleWight]}>{this.state.language.app_Team_one_phone}</Text>
                        </View>
                        <View style={styles.tableWidth}>
                            <Text numberOfLines={1} ellipsizeMode="middle" style={[styles.tableTitle, styles.tableTitleWight]}>{this.state.language.app_Team_one_name}</Text>
                        </View>
                    </View>
                    <ScrollView>
                        {this.renderComponent()}
                    </ScrollView>
                </View>
            </View>
        );
    }
    renderComponent () {
        let list = [];
        if (Number(this.state.total) > 0) {
            this.state.data.forEach((v, i) => {
                list.push(
                    <View style={[i%2 !== 0 ? styles.table : styles.tableBg]} key={i} >
                        <View style={styles.tableWidth}>
                            <Text numberOfLines={1} ellipsizeMode="middle" style={[styles.tableTitle]}>{v.account}</Text>
                        </View>
                        <View style={styles.tableWidth}>
                            <Text numberOfLines={1} ellipsizeMode="middle" style={[styles.tableTitle]}>{v.real_name}</Text>
                        </View>
                        <View style={styles.tableWidth}>
                            <Text numberOfLines={1} ellipsizeMode="middle" style={[styles.tableTitle]}>{v.phone}</Text>
                        </View>
                        <View style={styles.tableWidth}>
                            <Text numberOfLines={1} ellipsizeMode="middle" style={[styles.tableTitle]}>{v.name}</Text>
                        </View>
                    </View>
                )
            })
        }  else if (Number(this.state.total) === 0){
            list.push(
                <View style={styles.content} key={this.state.total}>
                    <View style={{alignItems: 'center', justifyContent: 'center', height: Utils.size.height -150, width: Utils.size.width}}>
                        <Text style={{fontSize: 16}}>{this.state.language.app_Operate_Contract_Record_null}</Text>
                    </View>
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
    main: {
        flex: 1,
        // paddingTop: 10,
        // paddingBottom: 10,
        backgroundColor: '#2b2b2b',
        width: Utils.size.width,
    },
    mainTable: {
        width: Utils.size.width,
        borderRadius: 5
    },
    table: {
        paddingTop: 10,
        width: Utils.size.width,
        paddingBottom: 10,
        flexDirection: 'row',
    },
    tableBg: {
        backgroundColor: '#000',
        paddingTop: 10,
        width: Utils.size.width,
        paddingBottom: 10,
        flexDirection: 'row',
    },
    tableWidth: {
        width: Utils.size.width / 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tableTitle: {
        color: '#fff',
        fontSize:Utils.setSpText(16),
    },
    tableTitleWight: {
        fontWeight: 'bold'
    }
});

