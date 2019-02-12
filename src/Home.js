import React, { Component } from 'react';
import {
    AsyncStorage,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView, Alert, Linking,
    BackHandler,
    ToastAndroid
} from 'react-native';
import Utils from './Components/Utils'
import List from './Components/List';
import SideMenu from 'react-native-side-menu';
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: {},
            data: {},
            isOpen: false,
        }
    }
    componentDidMount () {
        if (Utils.size.os === 'android') {
            BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        }
        this.LoadData();
    }
    componentWillUnmount() {
        if (Utils.size.os === 'android') {
            BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
        }
    }
    onBackPress = () => {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
            return false;
        }
        this.lastBackPressed = Date.now();
        ToastAndroid.show(this.state.language.app_close , ToastAndroid.SHORT);
        return true;
    };
    async LoadData () {
        try {
            let results = await AsyncStorage.getItem('language');
            this.setState({
                language: JSON.parse(results),
            });
            let lang = await  AsyncStorage.getItem('lang');
            let UserId = await AsyncStorage.getItem('UserId');
            let formData = new FormData();
            formData.append('user_id', UserId);
            formData.append('lang', lang);
            let data = await Utils.postJSON(Utils.size.url + '/v1/contract/getInfo', formData);
            console.log(data);
            if (Number(data.code) === 0) {
                this.setState({
                    data: data.result,
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    render() {
        return (
            <SideMenu
                menu={this.renderMenu()}                    //抽屉内的组件
                isOpen={this.state.isOpen}     //抽屉打开/关闭
                openMenuOffset={Utils.size.width - 100}     //抽屉的宽度
                // hiddenMenuOffset={20}          //抽屉关闭状态时,显示多少宽度 默认0 抽屉完全隐藏
                edgeHitWidth={60}              //距离屏幕多少距离可以滑出抽屉,默认60
                disableGestures={true}        //是否禁用手势滑动抽屉 默认false 允许手势滑动
                onChange={                   //抽屉状态变化的监听函数
                    (isOpen) => {isOpen ? this.setState({isOpen: true}) : this.setState({isOpen: false})}}
                onMove={                     //抽屉移动时的监听函数 , 参数为抽屉拉出来的距离 抽屉在左侧时参数为正,右侧则为负
                    (marginLeft) => {console.log(marginLeft)}}
                menuPosition={'left'}     //抽屉在左侧还是右侧
                autoClosing={true}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => {this.setState({isOpen: true})}}>
                            <View style={styles.headerLeft}>
                                <Image style={styles.headerLeftImage} source={{uri: this.state.data.avatar}}/>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.headerCenter}>
                            <Text style={styles.headerCenterText} numberOfLines={1}>{this.state.language.app_name}</Text>
                        </View>
                        <View style={styles.headerRight}>
                            {/*<Image style={styles.headerRightImage} source={require('./image/More.png')}/>*/}
                        </View>
                    </View>
                    <View style={styles.container}>
                        <List navigation={this.props.navigation}/>
                    </View>
                </View>
            </SideMenu>

        );
    }
    renderMenu () {
        return (
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={0.8} onPress={this.onUserDetails.bind(this)}>
                    <View style={styles.menuHeader}>
                        <Image style={styles.menuHeaderImage} source={{uri: this.state.data.avatar}}/>
                        <Text style={styles.menuHeaderText} numberOfLines={1}>{this.state.data.real_name ?  this.state.data.real_name : this.state.data.account}</Text>
                    </View>
                </TouchableOpacity>
                <ScrollView>
                    <ScrollView
                        showsVerticalScrollIndicator={false}>
                        {this.menuComponent()}
                    </ScrollView>
                </ScrollView>
                <View style={{flexDirection: 'row', alignItems: 'flex-end',paddingLeft: 10, paddingTop: 5, borderTopWidth: 1, borderTopColor: '#f6f6f6'}}>
                    <TouchableOpacity activeOpacity={0.8} onPress={this.onStting.bind(this)}>
                        <View style={styles.menuBott}>
                            <View style={styles.menuBottStting}>
                                <Image source={require('./Image/setting.png')} style={styles.menuBottSttingImage}/>
                                <Text style={styles.menuBottSettingText} numberOfLines={1}>{this.state.language.app_nav_name_Stting}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {Utils.size.os === 'ios'
                        ?
                        null
                        :
                        <TouchableOpacity activeOpacity={0.8} onPress={this.onUpgrade.bind(this)}>
                            <View style={styles.menuBott}>
                                <View style={styles.menuBottStting}>
                                    <Image source={require('./Image/shengji.png')} style={styles.menuBottSttingImage}/>
                                    <Text style={styles.menuBottSettingText} numberOfLines={1}>{this.state.language.app_nav_name_Upgrade}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }

                </View>
            </View>
        )

    }
    menuComponent () {
        let list = [];
        let array = [
            {name: this.state.language.app_nav_name_Home, image: require('./Image/Home.png'), component: 'Home'},
            {name: this.state.language.app_Operate_title, image: require('./Image/caozuo.png'), component: 'TheWalletOperation'},
            {name: this.state.language.app_nav_name_Team, image: require('./Image/Team.png'), component: 'TeamManagement'},
            {name: this.state.language.app_nav_name_Message, image: require('./Image/message.png'), component: 'MessageCenter'},
            {name: this.state.language.app_AboutUs_title, image: require('./Image/guanyu.png'), component: 'AboutUs'},
            {name: this.state.language.app_FileDownload_title, image: require('./Image/downloadImg.png'), component: 'FileDownload'},
            {name: this.state.language.app_nav_name_Announcement, image: require('./Image/announcement.png'), component: 'TheAnnouncement'},
        ];
        array.forEach((v, i) => {
            list.push(
                <TouchableOpacity key={i}
                                  activeOpacity={0.5}
                                  onPress={this._onOpenComponent.bind(this, v.component, v.name)}>
                    <View style={[i % 2 !== 0 ? styles.menuMainHeight : styles.menuMainHeightBg]}>
                        <Image source={v.image} style={styles.menuMainHeightIcon}/>
                        <Text style={styles.menuMainHeightText} numberOfLines={1}>{v.name}</Text>
                    </View>
                </TouchableOpacity>
            )
        })
        return list;
    }
    _onOpenComponent (component, title) {
        if (component === 'Home') {
            this.setState({isOpen: false})
        } else {
            this.props.navigation.navigate(component,{name: title,})
        }

    }
    // 更换头像
    onUserDetails () {
        let _this = this;
        this.props.navigation.navigate('Photo',
            {
                name: this.state.language.app_nav_Photo_title,
                ReCodeLoadData: function () {
                    _this.LoadData();
                }
            })
    }
    //  设置
    onStting () {
        this.props.navigation.navigate('SetUpThe', {name: this.state.language.app_nav_name_Stting,})
    }
    // 系统更新
    async onUpgrade () {
        try {
            let data = await Utils.postJSON(Utils.size.url + '/v1/settings/upgraded');
            console.log(data);
            if (Number(data.result.downloadId) === Number(data.result.status)) {
                // this.refs.toast.show('亲，暂时没有更新的包！');
                Alert.alert(
                    this.state.language.toast_onUpgrade_Alert_title,
                    this.state.language.toast_onUpgrade_Alert_main,
                    [
                        {text: this.state.language.toast_onUpgrade_Alert_button_left, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: this.state.language.findPwd_button, onPress: () => console.log('OK Pressed')},
                    ],
                    { cancelable: false }
                )
            } else {
                Linking.canOpenURL(data.result.downloadURI)
                    .then(supported => {
                        if (!supported) {
                            console.log('Can\'t handle url: ' + data.result.downloadURI);
                        } else {
                            return Linking.openURL(data.result.downloadURI)
                        }
                    }).catch(err => console.error('An error occurred', err));
            }
        }
        catch (e) {
            console.log(e);
        }
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
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: ( Utils.size.os === 'ios') ? 40 : 20,
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
    },
    menuBottStting: {
        paddingLeft: 10,
        paddingRight: 10,
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
        width: 200,
    },
    // home
    Main: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    MainCard: {
        backgroundColor: '#2b2b2b',
        width: Utils.size.width - 20,
        height: 100,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    MainCardImage: {
        width: 30,
        height: 30,
    },
    MainCardNumber: {
        marginLeft: 10,
        marginRight: 10,
        paddingLeft: 20,
    },
    MainCardNumberText: {
        width: Utils.size.width - 140,
        fontSize: Utils.setSpText(25),
        color: '#fff',
    },
    MainCardNumberTextSize: {
        paddingTop: 10,
        fontSize: Utils.setSpText(16),
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
    }
});
