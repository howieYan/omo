import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    AsyncStorage,
    Clipboard,
    ToastAndroid
} from 'react-native';
import Utils from "./Utils";
import {Loading} from "./Loading";
import {SwRefreshScrollView,} from 'react-native-swRefresh';
import CalculateForceWallet from "../Nav/List/CalculateForceWallet";
// import AgreementDetails from './AgreementDetails';
// import CalculateDetails from './CalculateDetails';
export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            list: [],
            language: {},
        }
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
            formData.append('user_id', UserId);
            formData.append('lang', lang);
            let data = await Utils.postJSON(Utils.size.url + '/v1/contract/getInfo', formData);
            let dataList = await Utils.postJSON(Utils.size.url + '/v1/contract/getM', formData);
            console.log(dataList);
            console.log(data);
            if (Number(data.code) === 0) {
                this.setState({
                    data: data.result,
                    list: dataList.result
                })
                Loading.hidden();
            } else {
                Loading.hidden();
                Loading.Toast(data.message);
                Loading.Toast(dataList.message);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    _onRefresh(end){
        let _this = this;
        let timer =  setTimeout(()=>{
            clearTimeout(timer)
            _this.loadData();
            end()//刷新成功后需要调用end结束刷新
        },1500)

    }

    render() {
        return (
            <View style={styles.content}>
                <SwRefreshScrollView
                    onRefresh={this._onRefresh.bind(this)}
                    ref="scrollView"
                    //其他你需要设定的属性(包括ScrollView的属性)
                >
                    <View style={styles.Main}>
                        {/*{this.renderComponent()}*/}
                        <View style={styles.ListCard}>
                            <TouchableOpacity activeOpacity={0.5} onPress={this.onDetailsAgreement.bind(this)}>
                                <View style={styles.ListCardBg}>
                                    <Image source={ require('../Image/heyueqianbao.png') } style={styles.ListCardBgImage}/>
                                    <View style={styles.ListCardBgRight}>
                                        <Text numberOfLines={1} ellipsizeMode='middle' style={styles.ListCardBgRightTop}>{this.state.data.capital}</Text>
                                        <Text numberOfLines={1} ellipsizeMode='middle' style={styles.ListCardBgRightBottom}>{this.state.language.app_Home_capital}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5} onPress={this.onDetailsCalculate.bind(this)}>
                                <View style={[styles.ListCardBg, styles.ListCardBgTwo]}>
                                    <Image source={ require('../Image/suanli.png') } style={styles.ListCardBgImage}/>
                                    <View style={styles.ListCardBgRight}>
                                        <Text numberOfLines={1} ellipsizeMode='middle' style={styles.ListCardBgRightTop}>{this.state.data.profit}</Text>
                                        <Text numberOfLines={1} ellipsizeMode='middle' style={styles.ListCardBgRightBottom}>{this.state.language.app_Home_profit}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.ListCard}>
                            <View style={styles.ListCardBg}>
                                <Image source={ require('../Image/yeji.png') } style={styles.ListCardBgImage}/>
                                <View style={styles.ListCardBgRight}>
                                    <Text numberOfLines={1} ellipsizeMode='middle' style={styles.ListCardBgRightTop}>{this.state.data.l_yeji}</Text>
                                    <Text numberOfLines={1} ellipsizeMode='middle' style={styles.ListCardBgRightBottom}>{this.state.language.app_Home_l_yeji}</Text>
                                </View>
                            </View>
                            <View style={[styles.ListCardBg, styles.ListCardBgTwo]}>
                                <Image source={ require('../Image/suanlichi.png') } style={styles.ListCardBgImage}/>
                                <View style={styles.ListCardBgRight}>
                                    <Text numberOfLines={1} ellipsizeMode='middle' style={styles.ListCardBgRightTop}>{this.state.data.c_yeji}</Text>
                                    <Text numberOfLines={1} ellipsizeMode='middle' style={styles.ListCardBgRightBottom}>{this.state.language.app_Home_c_yeji}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.ListCard}>
                            <TouchableOpacity activeOpacity={0.8}  onPress={ this.copy.bind(this, this.state.data.uid)}>
                                <View style={styles.ListCardBg}>
                                    <Image source={ require('../Image/tuiguang.png') } style={styles.ListCardBgImage}/>
                                    <View style={styles.ListCardBgRight}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text numberOfLines={1} ellipsizeMode='middle' style={styles.ListCardBgRightTopBg}>{this.state.data.uid}</Text>
                                        </View>
                                        <Text numberOfLines={1} ellipsizeMode='middle' style={styles.ListCardBgRightBottom}>{this.state.language.app_Home_uid}</Text>
                                    </View>
                                    <Image style={{width: 20, height: 25,marginLeft: 10,}} source={require('../Image/fuzhi.png')}/>
                                </View>
                            </TouchableOpacity>

                            <View style={[styles.ListCardBg, styles.ListCardBgTwo]}>
                                <Image source={ require('../Image/fensi.png') } style={styles.ListCardBgImageBg}/>
                                <View style={styles.ListCardBgRight}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text numberOfLines={1} ellipsizeMode='middle' style={styles.ListCardBgRightTopBg}>{this.state.data.recommend}</Text>
                                        <Text numberOfLines={1} ellipsizeMode='middle' style={{paddingLeft: 5,paddingRight: 5,color: '#fff'}}>|</Text>
                                        <Text numberOfLines={1} ellipsizeMode='middle' style={[styles.ListCardBgRightTopBg]}>{this.state.data.follower}</Text>
                                    </View>
                                    <Text numberOfLines={1} ellipsizeMode='middle' style={styles.ListCardBgRightBottom}>{this.state.language.app_Home_follower}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{marginTop: 10}}>
                            <TouchableOpacity activeOpacity={0.8}  onPress={ this.copy.bind(this, this.state.data.trading)}  >
                                <View style={styles.MainCard}>
                                    <Image source={ require('../Image/heyue.png') } style={styles.MainCardImage}/>
                                    <View style={styles.MainCardNumber}>
                                        <Text style={styles.MainCardNumberText} numberOfLines={1} ellipsizeMode='middle'>{this.state.data.trading}</Text>
                                        <View style={styles.MainCardNumberView}>
                                            <Text style={[styles.MainCardNumberTextSize, styles.MainCardNumberTextSizeText]} numberOfLines={1} ellipsizeMode='middle'>{this.state.language.app_Home_trading}</Text>
                                        </View>
                                    </View>
                                    <Image style={{width: 20, height: 25}} source={require('../Image/fuzhi.png')}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginTop: 10}}>
                            <View style={styles.MainCardbgl}>
                                <Image source={ require('../Image/xingji.png') } style={styles.MainCardImageBg}/>
                                <View style={styles.MainCardNumberBg}>
                                    <Text style={styles.MainCardNumberText} numberOfLines={1} ellipsizeMode='middle'>{this.state.language.app_Home_xin}</Text>
                                    <View style={{flexDirection: 'row',width: Utils.size.width - 80,paddingTop: 10, alignItems:'center',}}>
                                        {this.renderListXin()}
                                    </View>
                                    <View style={{flexDirection: 'row',width: Utils.size.width - 100,marginTop:5,justifyContent:'center',alignItems: 'center'}}>
                                        {this.renderListXinText()}
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{marginTop: 10}}>
                            <View style={styles.MainCardbgl}>
                                <Image source={ require('../Image/shangye.png') } style={styles.MainCardImagebg}/>
                                <View style={styles.MainCardNumberbg}>
                                    <Text style={styles.MainCardNumberText} numberOfLines={1} ellipsizeMode='middle'>{this.state.language.app_Home_chain}</Text>
                                    <View style={{flexDirection: 'row',width: Utils.size.width-100,paddingTop: 10, alignItems:'center',}}>
                                        <View style={{borderRadius: 5, width: 10,height: 10,backgroundColor:'#00A5A1',}}/>
                                        <View style={{borderBottomColor: '#00A5A1',borderBottomWidth: 1,flex:5,}}/>
                                        <View style={{borderRadius: 5, width: 10,height: 10,backgroundColor:'#00A5A1',}}/>
                                        <View style={{borderBottomColor: '#00A5A1',borderBottomWidth: 1,flex:5,}}/>
                                        <View style={{borderRadius: 5, width: 10,height: 10,backgroundColor:'#00A5A1',}}/>
                                        <View style={{borderBottomColor: '#fff',borderBottomWidth: 1,flex:5,}}/>
                                        <View style={{borderRadius: 5, width: 10,height: 10,backgroundColor:'#fff',}}/>
                                        <View style={{borderBottomColor: '#fff',borderBottomWidth: 1,flex:5,}}/>
                                    </View>
                                    <View style={{flexDirection: 'row',width: Utils.size.width-100,marginTop:5,}}>
                                        <Text style={{color: '#00A5A1',flex:4,fontSize: Utils.setSpText(10)}}>{this.state.language.app_Home_Omo_contract_launch}</Text>
                                        <Text style={{color: '#00A5A1',flex:4,fontSize: Utils.setSpText(10)}}>{this.state.language.app_Home_OToken_online}</Text>
                                        <Text style={{color: '#00A5A1',flex:4,fontSize: Utils.setSpText(10)}}>{this.state.language.app_Home_In_force}</Text>
                                        <Text style={{color: '#fff',flex:4,fontSize: Utils.setSpText(10)}}>{this.state.language.app_Home_Coinup_online}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{marginTop: 10}}>
                            <View style={styles.MainTable}>
                                <View style={styles.MainTableTitle}>
                                    <Text numberOfLines={1} style={styles.MainTableTitleText}>{this.state.language.app_Home_Calculate_list}</Text>
                                </View>
                                <View style={styles.MainTableTitleTab}>
                                    <View style={styles.MainTableTitleTabHeader}>
                                        <Text numberOfLines={1} style={[styles.MainTableTitleTabHeaderFont, styles.MainTableTitleTabHeaderFontWi]}>{this.state.language.app_Home_Calculate_name}</Text>
                                    </View>
                                    <View style={styles.MainTableTitleTabHeader}>
                                        <Text numberOfLines={1} style={[styles.MainTableTitleTabHeaderFont, styles.MainTableTitleTabHeaderFontWi]}>{this.state.language.app_Home_Calculate_number}</Text>
                                    </View>
                                </View>
                                {this.renderList()}
                            </View>
                        </View>
                    </View>
                </SwRefreshScrollView>
            </View>
        );
    }
    renderListXinText () {
        let list = [];
        this.state.list.forEach((v, i) => {
            list.push(
                <View key={i} style={{flex: this.state.list.length,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color: v.current === 'active'? '#F3C228' : '#fff',fontSize: Utils.setSpText(10)}} >{v.number}</Text>
                </View>
            )
        })
        return list;
    }
    renderListXin () {
        let list = [];
        let data = this.state.list;
        for (let i = 0; i < 7; i++) {
            if (data[i]) {
                list.push(
                    <View style={{flexDirection: 'row',flex: this.state.list.length,}} key={i}>
                        {i >= 6 ? <View/> : <View style={{borderRadius: 5, width: 10,height: 10,backgroundColor:data[i].current === 'active'? '#F3C228' : '#fff',marginTop: -5,}}/>}
                        {i >= 5 ? <View/> :<View style={{borderTopColor: data[i].current === 'active'? '#F3C228' : '#fff',borderTopWidth: 1,flex:data.length,marginTop: i >= 6 ? -3: 0}}/>}
                    </View>
                )
            }

        }
        return list;
    }
    renderList () {
        let list = [];
        let array = [
            {name: this.state.language.app_Home_Calculate_list_heyue, number: this.state.data.heyue, },
            {name: this.state.language.app_Home_Calculate_list_lianjie, number: this.state.data.lianjie, },
            {name: this.state.language.app_Home_Calculate_list_duideng, number: this.state.data.duideng, },
            {name: this.state.language.app_Home_Calculate_list_tuandui, number: this.state.data.tuandui, },
            {name: this.state.language.app_Home_Calculate_list_shaoshang, number: this.state.data.shaoshang,},
            {name: this.state.language.app_Home_Calculate_list_shiji, number: this.state.data.shiji, },
        ];
        array.forEach((v, i) => {
            list.push(
                <View style={[i % 2 !== 0 ? styles.MainTableTitleTab : styles.MainTableTitleTabBg]} key={i}>
                    <View style={styles.MainTableTitleTabHeader}>
                        <Text numberOfLines={1} style={styles.MainTableTitleTabHeaderFont}>{v.name}</Text>
                    </View>
                    <View style={styles.MainTableTitleTabHeader}>
                        <Text numberOfLines={1} style={styles.MainTableTitleTabHeaderFont}>{v.number}</Text>
                    </View>
                </View>
            )
        })
        return list;
    }
    async copy(record){
        Clipboard.setString(record);
        let str = await Clipboard.getString();
        Loading.Toast(this.state.language.app_Clipboard_text + str );
        // this.refs.toast.show('复制成功' + str);
    }
    // 合约钱包
    onDetailsAgreement () {
        this.props.navigation.navigate('ContractThePurse', { name: this.state.language.app_Home_capital})
    }
    // 算力钱包
    onDetailsCalculate () {
        this.props.navigation.navigate('CalculateForceWallet', { name: this.state.language.app_Home_profit})
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E9E9ED'
    },
    header: {
        height: (Utils.size.os === 'ios') ? 74 : 72,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#000',
        borderBottomWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: ( Utils.size.os === 'ios') ? 40 : 20,
        borderBottomColor: '#E9E8E8',
    },
    headerLeft: {
        width: 60,
        justifyContent: 'center',
    },
    headerLeftImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    headerCenter: {
        width: Utils.size.width - 140,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    headerCenterText: {
        fontSize: Utils.setSpText(17),
        color: '#fff',
    },
    headerRight: {
        width: 60,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    headerRightImage: {
        width: 20,
        height: 20,
    },
    modal: {
        backgroundColor: '#fff',
        width: 100,
        height: 100,
        position: 'absolute',
        left: Utils.size.width - 95 - 10,
        top: Utils.size.os === 'ios' ? 74 : 52,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
    },
    itemView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    textStyle: {
        color: '#38424A',
        fontSize: Utils.setSpText(15),
        marginLeft: 2,
    },
    menuLeft: {
        backgroundColor: '#fff',
        flex: 1,
    },
    menuHeader: {
        height: 230,
        justifyContent: 'center',
        backgroundColor: '#2b2b2b',
        alignItems: 'center',
    },
    menuHeaderImage: {
        height: 50,
        width: 50,
        borderRadius: 25,
    },
    menuHeaderText: {
        paddingTop: 10,
        fontSize:Utils.setSpText(16),
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: 'transparent',
    },
    menuMain: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 20,
        position: 'relative'
    },
    menuMainHeight: {
        height: 50,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
    },
    menuMainHeightBg :{
        height: 50,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    menuMainHeightIcon: {
        width: 20,
        height: 20,
    },
    menuMainHeightText: {
        fontSize: Utils.setSpText(16),
        color: '#4D5166',
        paddingLeft: 10,
    },
    menuBott: {
        height: 50,
        width: Utils.size.width - 140,
        flexDirection: 'row',
    },
    menuBottStting: {
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    MainCardNumberView : {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuBottSttingImage: {
        width: 18,
        height: 18,
    },
    menuBottSettingText: {
        fontSize: Utils.setSpText(12),
        color: '#4D5166',
        paddingTop: 5,
    },
    MainCardNumberTextSizeText: {
        width: Utils.size.width/ 2,
    },
    // home
    Main: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    MainCard: {
        backgroundColor: '#2b2b2b',
        width: Utils.size.width - 20,
        height: 80,
        paddingLeft: 10,
        paddingRight: 20,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    MainCardbgl: {
        backgroundColor: '#2b2b2b',
        width: Utils.size.width - 20,
        height: 90,
        paddingLeft: 10,
        paddingRight: 20,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    MainCardImage: {
        width: 30,
        height: 30,
    },
    MainCardImagebg: {
        width: 45,
        height: 45,
    },
    MainCardImageBg: {
        width: 38,
        height: 38,
    },
    MainCardNumber: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        paddingLeft: 20,
    },
    MainCardNumberbg: {
        flex: 1,
        paddingLeft: 10,
    },
    MainCardNumberBg: {
        flex: 1,
        paddingLeft: 20,
    },
    MainCardNumberText: {
        fontSize: Utils.setSpText(16),
        color: '#fff',
    },
    MainCardNumberTextExt: {
        fontSize: Utils.setSpText(16),
        color: '#fff',
    },
    MainCardNumberTextExtPadd: {
        paddingLeft: 5,
    },
    MainCardNumberTextSize: {
        paddingTop: 10,
        fontSize: Utils.setSpText(15),
        color: '#fff',
    },
    MainTable: {
        // height: 500,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    MainTableTitle: {
        backgroundColor: '#000',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
    },
    MainTableTitleText: {
        color: '#fff',
        fontSize:Utils.setSpText(16),
    },
    MainTableTitleTab: {
        flexDirection: 'row',
        backgroundColor: '#2b2b2b'
    },
    MainTableTitleTabBg: {
        flexDirection: 'row',
        backgroundColor: '#000'
    },
    MainTableTitleTabHeader: {
        width: (Utils.size.width) / 2,
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#ececec',
        justifyContent: 'center',
    },
    MainTableTitleTabHeaderFont: {
        paddingTop: 16,
        paddingBottom: 16,
        fontSize: Utils.setSpText(16),
        color: '#fff',
    },
    MainTableTitleTabHeaderFontWi: {
        fontWeight: 'bold'
    },
    MainCardNumberTextSizeSize: {
        paddingTop: 10,
        paddingLeft: 10,
        fontSize: Utils.setSpText(13),
        color: '#fff',
    },
    ListCard: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    ListCardBg: {
        flex: 1,
        width: (Utils.size.width - 30) / 2 ,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#2b2b2b',
        height: 80,
    },
    ListCardBgTwo: {
        marginLeft: 10,
    },
    ListCardBgImageBg: {
        marginLeft: 10,
        width: 30,
        height: 30,
    },
    ListCardBgImage: {
        marginLeft: 10,
        width: 25,
        height: 25,
    },
    ListCardBgRight: {
        paddingLeft: 20,
    },
    ListCardBgRightTopBg:{
        fontSize: Utils.setSpText(16),
        color: '#fff',
    },
    ListCardBgRightTop: {
        width: Utils.size.width / 2 - 70,
        fontSize: Utils.setSpText(16),
        color: '#fff',
    },
    ListCardBgRightTopBgL: {
        width: Utils.size.width  - 70,
        fontSize: Utils.setSpText(16),
        color: '#fff',
    },
    ListCardBgRightBottom: {
        fontSize: Utils.setSpText(15),
        color: '#fff',
        paddingTop: 10,
    },
    ListCardBgRightTopPaddLeft: {
        paddingLeft: 5,
    }

});

